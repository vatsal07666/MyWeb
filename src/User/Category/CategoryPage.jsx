import { Box, Card, CardContent, CircularProgress, Container, Grid, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCategory, setLoading } from "../../Admin/Category/CategorySlice";
import { useEffect } from "react";

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
                    <Box>
                        <Typography component={"span"} sx={{fontSize: {xs: "26px", sm: "30px"}, display: "flex",
                                justifyContent: "center", my: 5, fontWeight: 600
                            }}
                        > 
                            Categories 
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
                        <Grid container spacing={3} sx={{mb: {xs: 5, md: 0}}}>
                            {categories.length > 0 ? categories.map((item, index) => (
                                <Grid item size={{xs: 12, sm: 6, md: 4}} key={item._id ?? index} 
                                    sx={{display: "flex", justifyContent: "center"}}
                                >
                                    <Card onClick={() => history.push(`/user/products/${item._id}`, 
                                            {categoryName: item.categoryName}
                                        )}
                                        sx={{ cursor: "pointer", borderRadius: 3, maxWidth: 345, height: "100%",
                                            transition: "transform 0.35s ease, box-shadow 0.35s ease",
                                            boxShadow: "0 6px 20px rgba(0,0,0,0.08)", border: 1,
                                            position: "relative", overflow: "hidden", flex: 1,
                                            "&:hover": { boxShadow: "20px 20px 0px 0px rgba(0,0,0,0.05)" },
                                        }}
                                    >
                                        <CardContent sx={{maxWidth: 364}}>
                                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }} >
                                                {item.categoryName}
                                            </Typography>

                                            <Typography variant="body2" sx={{ color: "text.secondary", whiteSpace: "nowrap",
                                                textOverflow: "ellipsis", overflow: "hidden"
                                            }}>
                                                {item.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )) : (
                                 <Typography component={"span"} textAlign="center" width="100%" 
                                    fontWeight={600}
                                >
                                    No Categories Available For Now...
                                </Typography>
                            )}
                        </Grid> 
                    )}
                </Container>
            </Box>
        </>
    )
}

export default CategoryPage
