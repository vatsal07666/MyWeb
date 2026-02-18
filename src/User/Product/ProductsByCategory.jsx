import { Box, Button, Card, CardContent, CircularProgress, Container, Grid, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../../Context/CartProvider";
import { FiPlus } from "react-icons/fi";

const ProductsByCategory = () => {
    const [products, setProducts] = useState([]);
    const { categoryId } = useParams();
    const [categoryName, setCategoryName] = useState("");
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    const { addToCart } = useContext(CartContext);

    const token = "w4AkMdTjMm7CLvTY";

    useEffect(() => {
        setLoading(true);

        axios.get( `https://generateapi.techsnack.online/api/product?categoryId=${categoryId}`,
            { headers: { Authorization: token } }
        )
        .then((res) => {
            const filtered = (res.data.Data || []).filter((p) => p.category === location.state?.categoryName);
            setProducts(filtered);
            setCategoryName(location.state?.categoryName || "Products");
            console.log("Category ID:", categoryId);
            console.log("Products from API:", res.data.Data);
        })
        .catch((err) => {
            console.error("Product fetch error:", err);
        })
        .finally(() => setLoading(false));
    }, [categoryId, setProducts, location.state]);

    return (
        <>
            <Box sx={{ minHeight: "100vh", pt: 6, background: "#F0F7FF" }} >
                <Container maxWidth="lg">
                    {/* Page Title */}
                    <Typography sx={{ fontSize: { xs: "24px", sm: "30px" }, fontWeight: 600, 
                            textAlign: "center", my: 5, 
                        }}
                    >
                        {categoryName}
                    </Typography>

                    {/* Product Grid */}
                    {loading ? (
                        <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center",
                            alignItems: "center", mt: 10, fontWeight: 600
                        }}>
                            <CircularProgress sx={{color: "#1D4ED8"}} />
                            <Typography sx={{fontSize: {xs: "17px", sm: "20px"}, mt: 2}}>
                                Loading Products....
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={3} sx={{mb: {xs: 5, md: 0}}}>
                            {products.length > 0 ? (
                                products.map((item, index) => (
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

                                                <Typography sx={{ fontWeight: 600, mt: 2 }}>
                                                    Price: ₹{item.sellingPrice}
                                                </Typography>

                                                <Button variant="contained" type="button" onClick={() => addToCart(item)}
                                                    sx={{ color: "#fff", background: "#1e293b", textTransform: "none",
                                                        transition: "0.3s ease-in-out",
                                                        '&:hover': {background: "#fff", color: "#1e293b", fontWeight: 600 }, 
                                                    }}
                                                >
                                                    Add to Cart &nbsp;
                                                    <FiPlus fontSize="large" />
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))
                            ) : (
                                <Typography component={"span"} textAlign="center" width="100%" 
                                    fontWeight={600}
                                >
                                    No Products Found
                                </Typography>
                            )}
                        </Grid>
                    )}
                </Container>
            </Box>
        </>
    );
};

export default ProductsByCategory;
