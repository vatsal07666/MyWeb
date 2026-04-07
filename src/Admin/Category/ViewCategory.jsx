import { Box, Card, CardContent, CircularProgress, Grid, IconButton, InputBase, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect } from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom/cjs/react-router-dom';
import { setCategory, setLoading, setSearchItem } from './CategorySlice';
import SearchIcon from '@mui/icons-material/Search';

const ViewCategory = () => {
    const { list : categories = [], loading, searchItem } = useSelector((state) => state.categoryStore);
    const dispatch = useDispatch();
    const token = "y5japrtJDM9NkJjU";

    useEffect(() => {
        dispatch(setLoading(true));

        axios.get("https://generateapi.techsnack.online/api/category", { headers: { Authorization: token } })
        .then((res) => dispatch(setCategory(res.data.Data)))
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
                <Typography sx={{ fontSize: "16px", color: "#64748B" }}> Loading Categories... </Typography>
            </Box>
        );
    }

    /* ---------------- Search ---------------- */
    const filteredCategory = categories.filter(
        c => (c.categoryName ?? '').toLowerCase().includes((searchItem ?? '').toLowerCase())
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
                            alignItems: {xs: "center", sm: "normal"}
                        }}
                    >
                        <h1>Categories ({categories.length})</h1>
                        <Typography variant='p' sx={{color: "#888888", textAlign: {xs: "center", sm: "normal"}}}>
                            Manage product categories and their descriptions
                        </Typography>
                    </Box>

                    <Box>
                        <IconButton component={NavLink} to="/admin/category" 
                            sx={{background: "linear-gradient(135deg, #2563eb, #1e40af)", color: "#fff", 
                                borderRadius: 2, transition: "0.3s ease-in-out", whiteSpace: "nowrap",
                                '&:hover': {background: "#dbeafe", color: "#1d4ed8",}
                            }}
                        >
                            <IoIosArrowRoundBack size={30} /> 
                            <Typography component={"span"} sx={{fontSize: "15px", fontWeight: 600}}>
                                Back To AddCategory
                            </Typography>
                        </IconButton>
                    </Box>
                </Box>

                {/* Search Field */}
                <Box sx={{ position: 'relative', border: 1, borderRadius: 2, width: { xs: "100%", sm: "50%", md: "30%" }, 
                        py: 0.5, mb: 5, mt: {xs: 3, sm: 0}, background: "#fff"
                    }}
                >
                    <InputBase name="search" placeholder="Search Categories" value={searchItem ?? ""}
                        onChange={(e) => dispatch(setSearchItem(e.target.value))}
                        sx={{ paddingLeft: '40px', width: '100%', boxSizing: "border-box" }}
                    />
                    <SearchIcon sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)'}} />
                </Box>

                {/* Product Grid */}
                <Grid container spacing={3} sx={{ pb: 5 }}>
                    {filteredCategory.length > 0 ? (
                        filteredCategory.map((item, index) => (
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
                                    {/* Top Visual Section (NEW - replaces image) */}
                                    <Box sx={{ height: "100px", display: "flex", alignItems: "center",
                                            justifyContent: "center", color: "#fff",
                                            background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
                                            fontSize: 36, fontWeight: 700
                                        }}
                                    >
                                        {item.categoryName?.charAt(0)}
                                    </Box>

                                    <CardContent sx={{ px: 3, py: 2 }}>
                                        {/* Category Name */}
                                        <Typography sx={{ fontSize: "20px", fontWeight: 600, color: "#0F172A",
                                                mb: 0.2
                                            }}
                                        >
                                            {item.categoryName}
                                        </Typography>

                                        {/* Description */}
                                        <Typography sx={{ fontSize: "14px", color: "#64748B", display: "-webkit-box",
                                                WebkitLineClamp: 2,  WebkitBoxOrient: "vertical",
                                                overflow: "hidden"
                                            }}
                                        >
                                            {item.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography component={"span"} textAlign="center" width="100%" 
                            fontWeight={600}
                        >
                            No Categories Found
                        </Typography>
                    )}
                </Grid>
            </Box>
        </>
    )
}

export default ViewCategory
