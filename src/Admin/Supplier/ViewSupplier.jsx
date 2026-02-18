import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSupplier, setSearchItem, setLoading } from './SupplierSlice';
import { Box, Card, CardContent, CircularProgress, Grid, IconButton, InputBase, Typography } from '@mui/material';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { NavLink } from 'react-router-dom/cjs/react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

const ViewSupplier = () => {
    const { list: suppliers = [], loading, searchItem } = useSelector((state) => state.supplierStore);
    const dispatch = useDispatch();
    const token = "6jA4ILnp672uVwAw";

    useEffect(() => {
        dispatch(setLoading(true))

        axios.get("https://generateapi.techsnack.online/api/supplier", { headers: { Authorization: token } })
        .then((res) => dispatch(setSupplier(res.data.Data)))
        .catch((err) => console.error("GET error: ", err))
        .finally(() => dispatch(setLoading(false)))
    }, [dispatch])

    if(loading){
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Typography><CircularProgress size={20} /> Loading Suppliers...</Typography>
            </Box>
        );
    }

    /* ---------------- Search ---------------- */
    const filteredSupplier = suppliers.filter(
        s => (s.supplierName ?? '').toLowerCase().includes((searchItem ?? '').toLowerCase())
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
                        <h1>Suppliers ({suppliers.length})</h1>
                        <Typography variant='p' sx={{color: "#888888", textAlign: {xs: "center", sm: "normal"}}}>
                            Manage your supplier relationships and contact information
                        </Typography>
                    </Box>

                    <Box>
                        <IconButton component={NavLink} to="/admin/supplier" 
                            sx={{background: "linear-gradient(135deg, #2563eb, #1e40af)", color: "#fff", 
                                borderRadius: 2, transition: "0.3s ease-in-out", whiteSpace: "nowrap",
                                '&:hover': {background: "#dbeafe", color: "#1d4ed8",}
                            }}
                        >
                            <IoIosArrowRoundBack size={30} /> 
                            <Typography component={"span"} sx={{fontSize: "15px", fontWeight: 600}}>
                                Back To AddSupplier
                            </Typography>
                        </IconButton>
                    </Box>
                </Box>

                {/* Search Field */}
                <Box sx={{ position: 'relative', border: 1, borderRadius: 2, width: { xs: "100%", sm: "50%", md: "30%" }, 
                        py: 0.5, my: 3, background: "#fff"
                    }}
                >
                    <InputBase name="search" placeholder="Search Supplier" value={searchItem ?? ""}
                        onChange={(e) => dispatch(setSearchItem(e.target.value))}
                        sx={{ paddingLeft: '40px', width: '100%', boxSizing: "border-box" }}
                    />
                    <SearchIcon sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)'}} />
                </Box>

                {/* Product Grid */}
                <Grid container spacing={3} sx={{mb: {xs: 5, md: 0}}}>
                    {filteredSupplier.length > 0 ? (
                        filteredSupplier.map((item, index) => (
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
                                        }}>
                                            {item.supplierName}
                                        </Typography>

                                        <Typography>
                                            <b>Contact Person:</b> {item.contactPerson}
                                        </Typography>

                                        <Typography>
                                            <b>Email:</b> {item.email}
                                        </Typography>

                                        <Typography>
                                            <b>Phone:</b> {item.phone}
                                        </Typography>

                                        <Typography>
                                            <b>Address:</b> {item.address}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography component={"span"} textAlign="center" width="100%" 
                            fontWeight={600}
                        >
                            No Suppliers Found
                        </Typography>
                    )}
                </Grid>
            </Box>
        </>
    )
}

export default ViewSupplier
