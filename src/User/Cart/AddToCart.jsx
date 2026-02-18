import { CartContext } from "../../Context/CartProvider";
import { Box, Button, Card, CardContent, Container, Grid, IconButton, Paper, Typography } from "@mui/material";
import { useContext } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import LoadRazorpay from "../../Payment/LoadRazorpay";

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
                                        <Card sx={{ height: "100%", maxWidth: 345, borderRadius: 3, cursor: "pointer", 
                                                transition: "0.3s", boxShadow: "0 6px 20px rgba(0,0,0,0.08)", flex: 1,
                                                "&:hover": { boxShadow: "20px 20px rgba(0,0,0,0.15)" }, border: 1
                                            }}
                                        >
                                            <CardContent>
                                                <Typography variant="body2" sx={{ display: "inline-block", color: "#fff", 
                                                        background: "#1e293b", px: 1, py: 0.2, borderRadius: 2, opacity: 0.9
                                                    }}
                                                >
                                                    {item.category}
                                                </Typography>

                                                <Typography variant="h6" fontWeight={600}>
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

                                                <Typography sx={{ fontWeight: 600, mt: 2 }}>
                                                    Price: ₹{item.sellingPrice} | Total: {itemTotal(item)}
                                                </Typography>

                                                <Button onClick={() => removeFromCart(item._id)} 
                                                    sx={{ textTransform: "none", color: "#1e293b", border: 1,
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
                                <Typography component={"span"} textAlign="center" width="100%" 
                                    fontWeight={600}
                                >
                                    No Item Found in your Cart
                                </Typography>
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
