import { Box, Card, CardContent, CircularProgress, Grid, IconButton, InputBase, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom/cjs/react-router-dom';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useEffect } from 'react';
import axios from 'axios';
import { setLoading, setProduct, setSearchItem } from './ProductSlice';
import SearchIcon from '@mui/icons-material/Search';

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
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Typography><CircularProgress size={20} /> Loading Products...</Typography>
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
                        py: 0.5, my: 3, background: "#fff"
                    }}
                >
                    <InputBase name="search" placeholder="Search Products" value={searchItem ?? ""}
                        onChange={(e) => dispatch(setSearchItem(e.target.value))}
                        sx={{ paddingLeft: '40px', width: '100%', boxSizing: "border-box" }}
                    />
                    <SearchIcon sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)'}} />
                </Box>

                {/* Product Grid */}
                <Grid container spacing={3} sx={{mb: {xs: 5, md: 0}}}>
                    {filteredProduct.length > 0 ? (
                        filteredProduct.map((item, index) => (
                            <Grid item size={{xs: 12, sm: 6, md: 4}} key={item._id ?? index}
                                sx={{display: "flex", justifyContent: "center"}}
                            >
                                <Card sx={{ height: "100%", maxWidth: 345, borderRadius: 3, cursor: "pointer", 
                                        transition: "0.3s", boxShadow: "0 6px 20px rgba(0,0,0,0.08)", flex: 1,
                                        "&:hover": { boxShadow: "20px 20px rgba(0,0,0,0.15)" }, border: 1
                                    }}
                                >
                                    <CardContent>
                                        {item.productImage && (
                                            <Box sx={{ textAlign: "center", mb: 1 }}>
                                                <img src={item.productImage} alt={item.productName}
                                                    style={{ width: "100%", maxHeight: 150, objectFit: "contain",
                                                        borderRadius: 10, 
                                                    }}
                                                />
                                            </Box>
                                        )}

                                        <Typography variant="body2" sx={{ display: "inline-block", background: "#dbeafe", 
                                                color: "#1d4ed8", px: 1, py: 0.2, borderRadius: 2, opacity: 0.9,
                                                fontWeight: 600, mb: 1
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
            </Box>
        </>
    )
}

export default ViewProduct;
