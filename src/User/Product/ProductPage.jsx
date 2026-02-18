import { Box, Card, CardContent, CircularProgress, Container, Grid, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setProduct } from "../../Admin/Product/ProductSlice";

const ProductPage = () => {
    const { list: products = [], loading} = useSelector((state) => state.productStore);
    const dispatch = useDispatch();
    
    const token = "DocAKBFPpGh4l7vo";
    
    useEffect(() => {
        dispatch(setLoading(true));

        axios.get("https://generateapi.techsnack.online/api/product", {
            headers: { Authorization: token },
        })
        .then((res) => {
            dispatch(setProduct(res.data.Data));
        })
        .catch((err) => {
            console.error("Category fetch error:", err);
        })
        .finally(() => dispatch(setLoading(false)));
    }, [dispatch]);

    return (
        <>
            <Box sx={{ minHeight: "100vh", background: "#F0F7FF", pt: 6 }}>
                <Container maxWidth="lg">
                    <Box>
                        <Typography sx={{fontSize: {xs: "26px", sm: "30px"}, display: "flex",
                                justifyContent: "center", my: 5, fontWeight: 600, color: "#0F172A"
                            }}
                        > 
                            Products 
                        </Typography>
                    </Box>

                    {/* Category Grid */}
                    {loading ? (
                        <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", 
                            alignItems: "center", mt: 10, fontWeight: 600
                        }}>
                            <CircularProgress sx={{color: "#1D4ED8"}} />
                            <Typography variant='span' sx={{fontSize: {xs: "17px", sm: "20px"}, mt: 2}}>
                                Loading Products...
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={3} sx={{mb: {xs: 5, md: 0}}}>
                            {products.length > 0 ? products.map((item, index) => (
                                <Grid item size={{xs:12, sm: 6, md: 4}} key={item._id ?? index} 
                                    sx={{display: "flex", justifyContent: "center"}}
                                >
                                    <Card
                                        sx={{ cursor: "pointer", borderRadius: 3, maxWidth: 345, height: "100%",
                                            transition: "transform 0.35s ease, box-shadow 0.35s ease",
                                            boxShadow: "0 6px 20px rgba(0,0,0,0.08)", 
                                            position: "relative", overflow: "hidden", flex: 1,
                                            "&:hover": { boxShadow: "20px 20px 0px 0px rgba(0,0,0,0.05)" },
                                        }}
                                    >
                                        <CardContent sx={{maxWidth: 364}}>
                                            <Box sx={{width: "100%"}}>
                                                {item.productImage && (
                                                    <img src={item.productImage} alt={item.productName}
                                                        style={{ width: "100%", maxHeight: 200, objectFit: "contain",
                                                            borderRadius: 6
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                            <Typography variant="body2" sx={{ display: "inline-block", color: "#fff", 
                                                    background: "#1e293b", px: 1, py: 0.2, borderRadius: 2, opacity: 0.9
                                                }}
                                            >
                                                {item.category}
                                            </Typography>

                                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }} >
                                                {item.productName}
                                            </Typography>

                                            <Typography variant="body2" sx={{ color: "text.secondary", whiteSpace: "nowrap",
                                                textOverflow: "ellipsis", overflow: "hidden"
                                            }} >
                                                {item.sku}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )) : (
                                 <Typography component={"span"} textAlign="center" width="100%" 
                                    fontWeight={600}
                                >
                                    No Products Available For Now...
                                </Typography>
                            )}
                        </Grid>
                    )}
                </Container>
            </Box>
        </>
    )
}

export default ProductPage