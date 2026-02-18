import React from "react";
import { Box, Container, Grid, Typography, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <Box sx={{ backgroundColor: "#111827", color: "#E5E7EB" }}>
            <Container maxWidth="lg">
                <Grid container spacing={4} py={5}>
                    {/* Brand */}
                    <Grid item size={{xs: 12, sm: 4}}>
                        <Typography variant="h6" fontWeight={600}>  My Website </Typography>
                        <Typography sx={{ mt: 1, fontSize: "14px", color: "#cbd5f5" }}>
                            Explore products and categories with a smooth and simple experience.
                        </Typography>
                    </Grid>

                    {/* Quick Links */}
                    <Grid item size={{xs: 12, sm: 4}}>
                        <Typography variant="h6" fontWeight={600}> Quick Links </Typography>
                        <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 0.8,
                            "& .MuiLink-root:hover": {color: "#ffffff"}
                        }}>
                            <MuiLink component={Link} to="/" underline="none" color="inherit">Home</MuiLink>
                            <MuiLink component={Link} to="/user/product" underline="none" color="inherit">Product</MuiLink>
                            <MuiLink component={Link} to="/user/category" underline="none" color="inherit">Category</MuiLink>
                            <MuiLink component={Link} to="/user/cart" underline="none" color="inherit">Cart</MuiLink>
                        </Box>
                    </Grid>

                    {/* Support */}
                    <Grid item size={{xs: 12, sm: 4}}>
                        <Typography variant="h6" fontWeight={600}> Support </Typography>
                        <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 0.8 }}>
                            <Typography fontSize="14px">About Us</Typography>
                            <Typography fontSize="14px">Contact</Typography>
                            <Typography fontSize="14px">Privacy Policy</Typography>
                        </Box>
                    </Grid>
                </Grid>

                {/* Bottom Bar */}
                <Box sx={{ borderTop: "1px solid #334155", py: 2, textAlign: "center", fontSize: "14px",
                        color: "#cbd5f5",
                    }}
                >
                    © {new Date().getFullYear()} My Website. All rights reserved.
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
