import { Box, Button, Card, CardContent, CircularProgress, Container, Divider, Grid, Tooltip, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setProduct } from "../../Admin/Product/ProductSlice";
import { useHistory } from 'react-router-dom';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

const ProductPage = () => {
    const { list: products = [], loading} = useSelector((state) => state.productStore);
    const dispatch = useDispatch();
    const history = useHistory();
    
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
                    <Box sx={{ textAlign: "center", my: 5 }}>
                        <Typography sx={{fontSize: {xs: "26px", sm: "32px"}, display: "flex",
                                justifyContent: "center", fontWeight: 600, color: "#0F172A"
                            }}
                        > 
                            Products 
                        </Typography>
                        <Typography sx={{ color: "#64748B", fontSize: "14px" }}>
                            Browse all available products
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
                        <Grid container spacing={5} sx={{ pb: 5 }}>
                            {products.length > 0 ? products.map((item, index) => (
                                <Grid size={{xs:12, sm: 6, md: 4}} key={item._id ?? index} 
                                    sx={{display: "flex", justifyContent: "center"}}
                                >
                                    <Card sx={{ cursor: "pointer", borderRadius: 3, width: "100%", height: "100%",
                                            transition: "transform 0.35s ease, box-shadow 0.35s ease",
                                            boxShadow: "0 6px 20px rgba(0,0,0,0.08)", 
                                            position: "relative", overflow: "hidden", flex: 1,
                                            "&:hover": { 
                                                transform: "translateY(-8px) scale(1.02)",
                                                boxShadow: "20px 20px 0px 0px rgba(0,0,0,0.05)" 
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ maxWidth: 364 }}>
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

                                            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 15, mt: 2 }} >
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

                                            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                                                <Tooltip title="Explore Prouct from Category Section"
                                                    slotProps={{
                                                        tooltip: {
                                                            sx: { letterSpacing: 2, fontSize: 12, fontWeight: 600 }
                                                        }
                                                    }}
                                                >
                                                    <Button variant="contained"
                                                        sx={{ textTransform: "none", flex: 1 }}
                                                        onClick={() => history.push(`/user/category`)}
                                                    >
                                                        View
                                                    </Button>
                                                </Tooltip>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )) : (
                                <Box sx={{ width: "100%", display: "flex", flexDirection: "column",
                                        alignItems: "center", justifyContent: "center", py: 10, textAlign: "center",
                                        color: "#64748B"
                                    }}
                                >
                                    {/* Icon */}
                                    <Inventory2OutlinedIcon sx={{ fontSize: 100, color: "#cbd5e1", mb: 2 }} />

                                    {/* Title */}
                                    <Typography sx={{ fontSize: "22px", fontWeight: 600, color: "#1e293b" }} >
                                        No Products Found
                                    </Typography>

                                    {/* Subtitle */}
                                    <Typography sx={{ mt: 1, fontSize: 14 }}>
                                        there aren’t any products added yet.
                                    </Typography>
                                </Box>
                            )}
                        </Grid>
                    )}
                </Container>
            </Box>
        </>
    )
}

export default ProductPage