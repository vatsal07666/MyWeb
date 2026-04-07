import { CartContext } from "../../Context/CartProvider";
import { Box, Button, Card, CardContent, Container, Divider, Grid, IconButton, Paper, Typography } from "@mui/material";
import { useContext } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import LoadRazorpay from "../../Payment/LoadRazorpay";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

const Cart = () => {
    const { cart, increaseQty, decreaseQty, removeFromCart } = useContext(CartContext);

    const itemTotal = (item) => {
        return (item.sellingPrice) * (item.quantity);
    }

    const subtotal = cart.reduce(
        (acc, item) => acc + item.sellingPrice * item.quantity,
        0
    );

    const handleCheckout = () => {
        LoadRazorpay().then((loaded) => {
            if (!loaded) {
                alert("Razorpay SDK failed to load");
                return;
            }

            const options = {
            key: "rzp_test_SEIgekUY4O2ZUn", // TEST PUBLIC KEY ONLY
            amount: subtotal * 100,   // INR → paise
            currency: "INR",
            name: "My Store",
            description: "Cart Payment",

            handler: function (response) {
                console.log("Payment ID:", response.razorpay_payment_id);
                alert("Payment Successful (TEST MODE)");
            },

            prefill: {
                name: "Test User",
                email: "test@example.com",
                contact: "9999999999",
            },

            theme: {
                color: "#1e293b",
            },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        });
    };


    return (
        <>
            <Box sx={{display: "flex", flexDirection: "column", justifyContent: "space-between", 
                    background: "#F0F7FF"
                }}
            >
                <Box sx={{ minHeight: "100vh", pt: 6 }} >
                    <Container maxWidth="lg">
                        {/* Page Title */}
                        <Typography sx={{ fontSize: { xs: "24px", sm: "30px" }, fontWeight: 600, 
                                textAlign: "center", my: 5, 
                            }}
                        >
                            My Cart
                        </Typography>

                        {/* Cart Grid */}
                        <Grid container spacing={3}>
                            {cart.length > 0 ? (
                                cart.map((item, index) => (
                                    <Grid item size={{xs: 12, sm: 6, md: 4}} key={item._id ?? index}
                                        sx={{display: "flex", justifyContent: "center"}}
                                    >
                                        <Card sx={{ cursor: "pointer", borderRadius: 3, width: "100%", height: "100%",
                                                transition: "transform 0.35s ease, box-shadow 0.35s ease",
                                                boxShadow: "0 6px 20px rgba(0,0,0,0.08)", position: "relative", 
                                                overflow: "hidden", display: "flex", flexDirection: "column",
                                                "&:hover": {
                                                    transform: "translateY(-8px) scale(1.02)",
                                                    boxShadow: "20px 20px 0px 0px rgba(0,0,0,0.05)"
                                                },
                                            }}
                                        >
                                            <CardContent sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                                                <Box sx={{ width: "100%", position: "relative" }}>
                                                    {item.productImage && (
                                                        <img src={item.productImage} alt={item.productName}
                                                            style={{ width: "100%", maxHeight: 200, objectFit: "contain",
                                                                borderRadius: 6
                                                            }}
                                                        />
                                                    )}
    
                                                    {/* Category Badge */}
                                                    <Typography sx={{ position: "absolute", top: 0, left: 0, px: 1.5,
                                                            py: 0.3, bgcolor: "rgba(0,0,0,0.5)", color: "#fff",
                                                            borderRadius: 2, fontSize: 12
                                                        }}
                                                    >
                                                        {item.category}
                                                    </Typography>
                                                </Box>
                                                
                                                <Divider sx={{ my: 1 }} />

                                                <Typography variant="h6" fontWeight={600}sx={{ fontWeight: 600, flex: 1,
                                                            minWidth: 0, whiteSpace: "nowrap", overflow: "hidden",
                                                            textOverflow: "ellipsis"
                                                        }} 
                                                >
                                                    {item.productName}
                                                </Typography>

                                                <Typography sx={{ whiteSpace: "nowrap", mt: 1, display: "flex", 
                                                    alignItems: "center" }} component={"div"}
                                                >
                                                    Quantity: &nbsp;
                                                    <IconButton component={Paper} size="small" 
                                                        onClick={() => increaseQty(item._id)} 
                                                        sx={{fontSize: "16px", color: "rgb(0, 82, 7)"}}
                                                    >
                                                        <FiPlus/>
                                                    </IconButton>

                                                    &nbsp; {item.quantity} &nbsp;

                                                    <IconButton component={Paper} size="small" 
                                                        onClick={() => decreaseQty(item._id)} 
                                                        sx={{fontSize: "16px", color: "#ee0000"}}
                                                    >
                                                        <FiMinus/>
                                                    </IconButton>
                                                </Typography>

                                                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                                                    <Typography sx={{ fontWeight: 600 }}>Product:</Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 15,
                                                            color: "#4d4d4d"
                                                        }} 
                                                    >
                                                        {item.productName}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ mt: 1.5 }}>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                        <Typography sx={{ fontWeight: 600 }}> Price: </Typography>
                                                        <Typography sx={{ color: "#1D4ED8", fontWeight: 600 }}> 
                                                            ₹ {item.sellingPrice} 
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                        <Typography sx={{ fontWeight: 600 }}> Total Ammount: </Typography>
                                                        <Typography sx={{ color: "#1D4ED8", fontWeight: 600 }}> 
                                                            ₹ {itemTotal(item)} 
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Button onClick={() => removeFromCart(item._id)} 
                                                    sx={{ textTransform: "none", color: "#1e293b", border: 1, mt: 2,
                                                        borderRadius: 2, py: 0.5, px: 2, transition: "0.3s ease-in-out", 
                                                        "&:hover": { color: "#fff", background: "#ee0000" }
                                                    }}    
                                                >
                                                    Remove Item
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))
                            ) : (
                                <Box sx={{ width: "100%", display: "flex", flexDirection: "column",
                                        alignItems: "center", justifyContent: "center", py: 10, textAlign: "center",
                                        color: "#64748B"
                                    }}
                                >
                                    {/* Icon */}
                                    <ShoppingCartOutlinedIcon sx={{ fontSize: 100, color: "#cbd5e1", mb: 2 }} />

                                    {/* Title */}
                                    <Typography sx={{ fontSize: "22px", fontWeight: 600, color: "#1e293b" }} >
                                        No Products Found
                                    </Typography>

                                    {/* Subtitle */}
                                    <Typography sx={{ mt: 1, fontSize: 14 }}>
                                        there aren’t any products added yet in the Cart.
                                    </Typography>

                                    <Button variant="contained" sx={{ mt: 3, textTransform: "none" }}
                                        onClick={() => window.history.back()}
                                    >
                                        ← Go Back
                                    </Button>
                                </Box>
                            )}
                        </Grid>
                    </Container>
                </Box>

                <Box sx={{ position: "sticky", bottom: 0, background: "#F0F7FF", borderTop: "2px solid #e7e7e7",
                        py: 2, mt: 4
                    }}
                >
                    <Container maxWidth="lg">
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexWrap: "wrap",
                                gap: 2
                            }}
                        >
                            <Typography fontWeight={600} fontSize={18}>
                                Subtotal: ₹{subtotal}
                            </Typography>

                            <Button variant="contained" sx={{ background: "#1D4ED8", textTransform: "none",
                                    px: 4, "&:hover": { background: "#0f172a" }
                                }}
                                disabled={cart.length === 0} onClick={handleCheckout}
                            >
                                Proceed to Checkout
                            </Button>
                        </Box>
                    </Container>
                </Box>
            </Box>
        </>
    );
};

export default Cart;