import { Box, Card, CardContent, CircularProgress, Divider, Grid, IconButton, InputBase, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom/cjs/react-router-dom';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useEffect } from 'react';
import axios from 'axios';
import { setLoading, setProduct, setSearchItem } from './ProductSlice';
import SearchIcon from '@mui/icons-material/Search';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

const ViewProduct = () => {
    const {list: products = [], loading, searchItem} = useSelector((state) => state.productStore);
    const dispatch = useDispatch();

    const token = "DocAKBFPpGh4l7vo";

    useEffect(() => {
        dispatch(setLoading(true));

        axios.get("https://generateapi.techsnack.online/api/product", { headers: { Authorization: token } })
        .then((res) => dispatch(setProduct(res.data.Data)))
        .catch((err) => console.error("GET error: ", err))
        .finally(() => dispatch(setLoading(false)))
    }, [dispatch])

    if(loading){
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: "center", flexDirection: "column", 
                    mt: 5, gap: 1 
                }}
            >
                <CircularProgress size={20} thickness={4} /> 
                <Typography sx={{ fontSize: "16px", color: "#64748B" }}> Loading Products... </Typography>
            </Box>
        );
    }

    /* ---------------- Search ---------------- */
    const filteredProduct = products.filter(
        p => (p.productName ?? '').toLowerCase().includes((searchItem ?? '').toLowerCase())
    );
    
    return (
        <>
            <Box sx={{ minHeight: "100vh" }} >
                {/* Page Title */}
                <Box sx={{display: "flex", flexDirection: {xs: "column", sm: "row"},
                        justifyContent: "space-between"
                    }}
                >
                    <Box sx={{mb: 3, display: {xs: "flex", sm: "block"}, flexDirection: {xs: "column", sm: "row"},
                            alignItems: {xs: "center", sm: "normal"},
                        }}
                    >
                        <h1>Products ({products.length})</h1>
                        <Typography variant='p' sx={{color: "#888888", textAlign: {xs: "center", sm: "normal"}}}>
                            List of all products in your inventory
                        </Typography>
                    </Box>

                    <Box>
                        <IconButton component={NavLink} to="/admin/product" 
                            sx={{background: "linear-gradient(135deg, #2563eb, #1e40af)", color: "#fff", 
                                borderRadius: 2, transition: "0.3s ease-in-out", whiteSpace: "nowrap",
                                '&:hover': {background: "#dbeafe", color: "#1d4ed8",}
                            }}
                        >
                            <IoIosArrowRoundBack size={30} /> 
                            <Typography component={"span"} sx={{fontSize: "15px", fontWeight: 600}}>
                                Back To AddProduct
                            </Typography>
                        </IconButton>
                    </Box>
                </Box>

                {/* Search Field */}
                <Box sx={{ position: 'relative', border: 1, borderRadius: 2, width: { xs: "100%", sm: "60%", md: "40%" }, 
                        py: 0.5, mb: 5, mt: {xs: 3, sm: 0}, background: "#fff"
                    }}
                >
                    <InputBase name="search" placeholder="Search Products" value={searchItem ?? ""}
                        onChange={(e) => dispatch(setSearchItem(e.target.value))}
                        sx={{ paddingLeft: '40px', width: '100%', boxSizing: "border-box" }}
                    />
                    <SearchIcon sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)'}} />
                </Box>

                {/* Product Grid */}
                <Grid container spacing={5} sx={{ pb: 5 }}>
                    {filteredProduct.length > 0 ? (
                        filteredProduct.map((item, index) => (
                            <Grid item size={{xs: 12, sm: 6, md: 4}} key={item._id ?? index}
                                sx={{display: "flex", justifyContent: "center"}}
                            >
                                <Card sx={{ cursor: "pointer", borderRadius: 3, width: "100%", height: "100%",
                                        transition: "transform 0.35s ease, box-shadow 0.35s ease",
                                        boxShadow: "0 6px 20px rgba(0,0,0,0.08)", position: "relative", 
                                        overflow: "hidden", flex: 1,
                                        "&:hover": { 
                                            transform: "translateY(-8px) scale(1.02)",
                                            boxShadow: "20px 20px 0px 0px rgba(0,0,0,0.05)" 
                                        },
                                    }}
                                >
                                    <CardContent>
                                        {item.productImage && (
                                            <img src={item.productImage} alt={item.productName}
                                                style={{ width: "100%", maxHeight: 200, objectFit: "contain",
                                                    borderRadius: 6
                                                }}
                                            />
                                        )}

                                        <Divider sx={{ my: 1 }}/>

                                        {/* Category Badge */}
                                        <Typography sx={{ display: "inline", px: 1.5, py: 0.5, fontSize: 12,
                                                bgcolor: "rgba(0,0,0,0.5)", color: "#fff", borderRadius: 2,
                                                letterSpacing: 0.5
                                            }}
                                        >
                                            {item.category}
                                        </Typography>

                                        <Box sx={{ display: "flex", justifyContent: "space-between", 
                                                alignItems: "center", my: 1, gap: 1, textOverflow: "ellipsis",
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
            </Box>
        </>
    )
}

export default ViewProduct;
