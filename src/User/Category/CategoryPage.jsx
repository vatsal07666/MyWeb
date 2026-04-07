import { Box, Card, CardContent, CircularProgress, Container, Grid, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCategory, setLoading } from "../../Admin/Category/CategorySlice";
import { useEffect } from "react";
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';

const CategoryPage = () => {
    const { list: categories = [], loading } = useSelector((state) => state.categoryStore);
    const history = useHistory();
    const dispatch = useDispatch();

    const token = "y5japrtJDM9NkJjU";

    useEffect(() => {
        dispatch(setLoading(true));

        axios.get("https://generateapi.techsnack.online/api/category", {
            headers: { Authorization: token },
        })
        .then((res) => {
            const activeCategories = res.data.Data.filter(
                (cat) => cat.status === "Active"
            );
            dispatch(setCategory(activeCategories));
        })
        .catch((err) => {
            console.error("Category fetch error:", err);
        })
        .finally(() => dispatch(setLoading(false)));
    }, [dispatch]);

    return (
        <>
            <Box sx={{ minHeight: "100vh", pt: 6, background: "#F0F7FF" }} >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: "center", my: 5 }}>
                        <Typography component={"span"} sx={{fontSize: {xs: "26px", sm: "30px"}, display: "flex",
                                justifyContent: "center", fontWeight: 600
                            }}
                        > 
                            Categories 
                        </Typography>
                        <Typography sx={{ color: "#64748B", fontSize: "14px" }}>
                            Browse by category
                        </Typography>
                    </Box>

                    {/* Category Grid */}
                    {loading ? (
                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center",
                                alignItems: "center", mt: 10, 
                            }}
                        >
                            <CircularProgress sx={{ color: "#1D4ED8" }} />
                            <Typography variant="span" sx={{fontSize: {xs: "17px", sm: "20px"}, mt: 2}}>
                                loading Categories...
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={5} sx={{ pb: 5 }}>
                            {categories.length > 0 ? categories.map((item, index) => (
                                <Grid item size={{xs: 12, sm: 6, md: 4}} key={item._id ?? index} 
                                    sx={{display: "flex", justifyContent: "center"}}
                                >
                                    <Card onClick={() => history.push(`/user/products/${item._id}`, {
                                            categoryName: item.categoryName
                                        })}
                                        sx={{ cursor: "pointer", borderRadius: 4, width: "100%", height: "100%",
                                            transition: "all 0.3s ease", background: "#ffffff",
                                            boxShadow: "0 10px 25px rgba(0,0,0,0.08)", display: "flex", 
                                            flexDirection: "column", justifyContent: "space-between",
                                            "&:hover": {
                                                transform: "translateY(-8px) scale(1.02)",
                                                boxShadow: "0 20px 40px rgba(0,0,0,0.12)"
                                            }
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

                                            <Typography sx={{ mt: 2, fontSize: "13px", fontWeight: 600,
                                                    color: "#2563EB"
                                                }}
                                            >
                                                Explore →
                                            </Typography>
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
                                    <CategoryOutlinedIcon sx={{ fontSize: 100, color: "#cbd5e1", mb: 2 }} />

                                    {/* Title */}
                                    <Typography sx={{ fontSize: "22px", fontWeight: 600, color: "#1e293b" }} >
                                        No Categories Found
                                    </Typography>

                                    {/* Subtitle */}
                                    <Typography sx={{ mt: 1, fontSize: 14 }}>
                                        there aren’t any category added yet.
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

export default CategoryPage