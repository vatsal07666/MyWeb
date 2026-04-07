import { Box, Button, Card, CardContent, CircularProgress, Container, Divider, Grid, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../../Context/CartProvider";
import { FiPlus } from "react-icons/fi";
import { LuBoxes } from "react-icons/lu";

const ProductsByCategory = () => {
    const [products, setProducts] = useState([]);
    const { categoryId } = useParams();
    const [categoryName, setCategoryName] = useState("");
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    const { addToCart } = useContext(CartContext);

    const token = "DocAKBFPpGh4l7vo";

    useEffect(() => {
        setLoading(true);

        axios.get(`https://generateapi.techsnack.online/api/product?categoryId=${categoryId}`,
            { headers: { Authorization: token } }
        )
        .then((res) => {
            const filtered = (res.data.Data || []).filter((p) => p.category === location.state?.categoryName);
            setProducts(filtered);
            setCategoryName(location.state?.categoryName || "Products");
        })
        .catch((err) => {
            console.error("Product fetch error:", err);
        })
        .finally(() => setLoading(false));
    }, [categoryId, location.state]);

    return (
        <>
            <Box sx={{ minHeight: "100vh", pt: 6, background: "#F0F7FF" }}>
                <Container maxWidth="lg">
                    {/* Page Title */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 5,
                            flexDirection: {xs: "column", sm: "row"}, gap: {xs: 2, sm: 0}
                        }}
                    >
                        <Box sx={{ textAlign: {xs: "center", sm: "left"} }}>
                            <Typography component={"span"} sx={{ fontSize: {xs: "26px", sm: "30px"}, fontWeight: 600 }}> 
                                {categoryName} 
                            </Typography>
                            <Typography sx={{ color: "#64748B", fontSize: "14px" }}>
                                Products
                            </Typography>
                        </Box>

                        <Button variant="contained" sx={{ textTransform: "none" }}
                            onClick={() => window.history.back()}
                        >
                            ← Go Back
                        </Button>
                    </Box>

                    {/* Product Grid */}
                    {loading ? (
                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center",
                            alignItems: "center", mt: 10, fontWeight: 600
                        }}>
                            <CircularProgress sx={{ color: "#1D4ED8" }} />
                            <Typography sx={{ fontSize: { xs: "17px", sm: "20px" }, mt: 2 }}>
                                Loading Products....
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={3} sx={{ pb: 5 }}>
                            {products.length > 0 ? (
                                products.map((item, index) => (
                                    <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={item._id ?? index}
                                        sx={{ display: "flex", justifyContent: "center", alignItems: "stretch" }}
                                    >
                                        <Card sx={{ cursor: "pointer", borderRadius: 3, width: "100%", height: "100%",
                                                transition: "transform 0.35s ease, box-shadow 0.35s ease",
                                                boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                                                position: "relative", overflow: "hidden",
                                                display: "flex", flexDirection: "column",
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
                                                    
                                                <Divider sx={{ my: 1 }}/>
                                                    
                                                <Box sx={{ display: "flex", justifyContent: "space-between", 
                                                        alignItems: "center", mb: 1, gap: 1, textOverflow: "ellipsis",
                                                        overflow: "hidden"
                                                    }}
                                                >
                                                    <Typography variant="h6" sx={{ fontWeight: 600, flex: 1,
                                                            minWidth: 0, whiteSpace: "nowrap", overflow: "hidden",
                                                            textOverflow: "ellipsis"
                                                        }} 
                                                    >
                                                        {item.productName}
                                                    </Typography>
                                                    
                                                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#ffffff",
                                                            background: item.stock > 20 ? "green" : item.stock > 0 ? "orange" : "red",
                                                            px: 1.5, py: 0.3, borderRadius: 5
                                                        }}
                                                    >
                                                        { item.stock > 20 ? "In Stock" : item.stock > 0
                                                            ? "Low Stock" : "Out of Stock" }
                                                    </Typography>
                                                </Box>
                                                        
                                                <Typography sx={{ fontWeight: 600, color: "#1D4ED8", mb: 1,
                                                        fontSize: 20
                                                    }}
                                                >
                                                   ₹ {item.sellingPrice} /-
                                                </Typography>
                                                
                                                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 15, mt: 1 }} >
                                                    {item.productName}
                                                </Typography>
                                                
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <Typography sx={{ fontWeight: 600, fontSize: "14px" }}>
                                                        SKU: 
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: "text.secondary", whiteSpace: "nowrap",
                                                        textOverflow: "ellipsis", overflow: "hidden"
                                                    }}>
                                                        {item.sku}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <Typography sx={{ fontWeight: 600, fontSize: "14px" }}>
                                                        Supplier: 
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: "text.secondary", whiteSpace: "nowrap",
                                                        textOverflow: "ellipsis", overflow: "hidden"
                                                    }}>
                                                        {item.supplier}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ mt: 2 }}>
                                                    <Button variant="contained" type="button"
                                                        onClick={() => addToCart(item)}
                                                        sx={{ width: "100%", color: "#fff", background: "#1e293b",
                                                            textTransform: "none", transition: "0.3s ease-in-out",
                                                            '&:hover': { background: "#fff", color: "#1e293b", fontWeight: 600 },
                                                        }}
                                                    >
                                                        Add to Cart &nbsp;
                                                        <FiPlus fontSize="large" />
                                                    </Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))
                            ) : (
                                <Box sx={{ width: "100%", display: "flex", flexDirection: "column",
                                        alignItems: "center", color: "#64748B"
                                    }}
                                >
                                    <LuBoxes style={{ fontSize: 100, color: "#cbd5e1", mb: 2 }} />

                                    <Typography sx={{ fontSize: "20px", fontWeight: 600 }}>
                                        No Products Found
                                    </Typography>

                                    <Typography sx={{ mt: 1 }}>
                                        Try exploring other categories
                                    </Typography>
                                </Box>
                            )}
                        </Grid>
                    )}
                </Container>
            </Box>
        </>
    );
};

export default ProductsByCategory;
