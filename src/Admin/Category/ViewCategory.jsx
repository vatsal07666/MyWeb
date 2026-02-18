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
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Typography><CircularProgress size={20} /> Loading Categories...</Typography>
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
                        py: 0.5, my: 3, background: "#fff"
                    }}
                >
                    <InputBase name="search" placeholder="Search Categories" value={searchItem ?? ""}
                        onChange={(e) => dispatch(setSearchItem(e.target.value))}
                        sx={{ paddingLeft: '40px', width: '100%', boxSizing: "border-box" }}
                    />
                    <SearchIcon sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)'}} />
                </Box>

                {/* Product Grid */}
                <Grid container spacing={3} sx={{mb: {xs: 5, md: 0}}}>
                    {filteredCategory.length > 0 ? (
                        filteredCategory.map((item, index) => (
                            <Grid item size={{xs: 12, sm: 6, md: 4}} key={item._id ?? index}
                                sx={{display: "flex", justifyContent: "center"}}
                            >
                                <Card sx={{ height: "100%", maxWidth: 345, borderRadius: 3, cursor: "pointer", 
                                        transition: "0.3s", boxShadow: "0 6px 20px rgba(0,0,0,0.08)", flex: 1,
                                        "&:hover": { boxShadow: "20px 20px rgba(0,0,0,0.15)" }, border: 1
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="span" sx={{ display: "inline-block", background: "#dbeafe", 
                                                color: "#1d4ed8", px: 1, py: 0.2, borderRadius: 2, opacity: 0.9,
                                                fontWeight: 600, mb: 1
                                            }}
                                        >
                                            {item.categoryName}
                                        </Typography> <br />

                                        <Typography variant="bosy2" textAlign={"justify"}>
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
