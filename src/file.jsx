// import {
//   Box,
//   Card,
//   CardContent,
//   CircularProgress,
//   Container,
//   Grid,
//   Typography,
//   Button
// } from "@mui/material";
// import React, { useEffect } from "react";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { setLoading, setProduct } from "../../Admin/Product/ProductSlice";

// const ProductPage = () => {
//   const { list: products = [], loading } = useSelector(
//     (state) => state.productStore
//   );
//   const dispatch = useDispatch();

//   const token = "DocAKBFPpGh4l7vo";

//   useEffect(() => {
//     dispatch(setLoading(true));

//     axios
//       .get("https://generateapi.techsnack.online/api/product", {
//         headers: { Authorization: token },
//       })
//       .then((res) => {
//         dispatch(setProduct(res.data.Data));
//       })
//       .catch((err) => {
//         console.error("Product fetch error:", err);
//       })
//       .finally(() => dispatch(setLoading(false)));
//   }, [dispatch]);

//   return (
//     <Box sx={{ minHeight: "100vh", background: "#F0F7FF", pt: 6 }}>
//       <Container maxWidth="lg">
//         <Typography
//           sx={{
//             fontSize: { xs: "26px", sm: "32px" },
//             textAlign: "center",
//             my: 5,
//             fontWeight: 700,
//             color: "#0F172A",
//           }}
//         >
//           Products
//         </Typography>

//         {loading ? (
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               mt: 10,
//             }}
//           >
//             <CircularProgress sx={{ color: "#1D4ED8" }} />
//             <Typography sx={{ mt: 2 }}>Loading Products...</Typography>
//           </Box>
//         ) : (
//           <Grid container spacing={3}>
//             {products.length > 0 ? (
//               products.map((item, index) => (
//                 <Grid item xs={12} sm={6} md={4} key={item._id ?? index}>
//                   <Card
//                     sx={{
//                       borderRadius: 3,
//                       height: "100%",
//                       display: "flex",
//                       flexDirection: "column",
//                       transition: "0.3s",
//                       boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
//                       "&:hover": {
//                         transform: "translateY(-6px) scale(1.02)",
//                         boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
//                       },
//                     }}
//                   >
//                     {/* Image */}
//                     {item.productImage && (
//                       <Box sx={{ p: 2 }}>
//                         <img
//                           src={item.productImage}
//                           alt={item.productName}
//                           style={{
//                             width: "100%",
//                             height: 180,
//                             objectFit: "cover",
//                             borderRadius: 8,
//                           }}
//                         />
//                       </Box>
//                     )}

//                     <CardContent sx={{ flexGrow: 1 }}>
//                       {/* Category */}
//                       <Typography
//                         sx={{
//                           display: "inline-block",
//                           background: "#1e293b",
//                           color: "#fff",
//                           px: 1.5,
//                           py: 0.3,
//                           borderRadius: 2,
//                           fontSize: 12,
//                           mb: 1,
//                         }}
//                       >
//                         {item.category}
//                       </Typography>

//                       {/* Name */}
//                       <Typography
//                         variant="h6"
//                         sx={{ fontWeight: 700, mb: 0.5 }}
//                       >
//                         {item.productName}
//                       </Typography>

//                       {/* SKU */}
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           color: "gray",
//                           fontSize: 13,
//                           mb: 1,
//                         }}
//                       >
//                         {item.sku}
//                       </Typography>

//                       {/* Price (Mock if not available) */}
//                       <Typography
//                         sx={{
//                           fontWeight: 600,
//                           color: "#1D4ED8",
//                           mb: 2,
//                         }}
//                       >
//                         ₹{item.price}
//                       </Typography>

//                       {/* Actions */}
//                       <Box sx={{ display: "flex", gap: 1 }}>
//                         <Button
//                           variant="contained"
//                           size="small"
//                           sx={{ textTransform: "none" }}
//                         >
//                           View
//                         </Button>
//                         <Button
//                           variant="outlined"
//                           size="small"
//                           sx={{ textTransform: "none" }}
//                         >
//                           Add
//                         </Button>
//                       </Box>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))
//             ) : (
//               <Typography
//                 sx={{
//                   width: "100%",
//                   textAlign: "center",
//                   mt: 5,
//                   fontWeight: 600,
//                   color: "gray",
//                 }}
//               >
//                 No Products Available
//               </Typography>
//             )}
//           </Grid>
//         )}
//       </Container>
//     </Box>
//   );
// };

// export default ProductPage;

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
            <Box sx={{ minHeight: "100vh", pt: 6, background: "linear-gradient(135deg, #F0F7FF 0%, #E0EDFF 100%)" }} >
                <Container maxWidth="lg">
                    {/* Header */}
                    <Box sx={{ textAlign: "center", mb: 5 }}>
                        <Typography
                            sx={{
                                fontSize: { xs: "28px", sm: "34px" },
                                fontWeight: 700,
                                color: "#0F172A"
                            }}
                        >
                            Categories
                        </Typography>
                        <Typography sx={{ color: "#64748B", mt: 1, fontSize: "14px" }}>
                            Browse by category
                        </Typography>
                    </Box>

                    {/* Loader */}
                    {loading ? (
                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center",
                                alignItems: "center", mt: 12
                            }}
                        >
                            <CircularProgress sx={{ color: "#2563EB" }} />
                            <Typography sx={{ fontSize: { xs: "16px", sm: "18px" }, mt: 2, color: "#475569" }}>
                                Loading Categories...
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={4} sx={{ pb: 5 }}>
                            {categories.length > 0 ? categories.map((item, index) => (
                                <Grid xs={12} sm={6} md={4} key={item._id ?? index}>
                                    <Card onClick={() => history.push(`/user/products/${item._id}`, {
                                            categoryName: item.categoryName
                                        })}
                                        sx={{ cursor: "pointer", borderRadius: 4, height: "100%",
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

                                            <Typography
                                                sx={{
                                                    mt: 2,
                                                    fontSize: "13px",
                                                    fontWeight: 600,
                                                    color: "#2563EB"
                                                }}
                                            >
                                                Explore →
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )) : (
                                <Typography component="span" textAlign="center" width="100%" fontWeight={600}
                                    color="#475569"
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