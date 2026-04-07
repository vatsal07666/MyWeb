import { Box, Card, CardContent, Grid, IconButton, Paper, Typography } from "@mui/material";
import { FaBoxes } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { Link } from "react-router-dom";
import CountUp from 'react-countup';
import { FaTruckLoading } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {setProduct} from "../Product/ProductSlice";
import { useCallback, useEffect } from "react";
import { setCategory } from "../Category/CategorySlice";
import { setSupplier } from "../Supplier/SupplierSlice";
import { GrMoney } from "react-icons/gr";
import { setSales } from "../Sales/SalesSlice";

const Dashboard = () => {
    const {list: products = []} = useSelector((state) => state.productStore);
    const {list: categories = []} = useSelector((state) => state.categoryStore);
    const {list: suppliers = []} = useSelector((state) => state.supplierStore);
    const {list: sales = [] } = useSelector((state) => state.salesStore);

    const dispatch = useDispatch();

    const tokenProduct = "DocAKBFPpGh4l7vo";
    const tokenCategory = "y5japrtJDM9NkJjU";
    const tokenSupplier = "6jA4ILnp672uVwAw";
    const tokenSales = "lwfog6Wx9g3tZrPp";

    const productCount = useCallback(() => {
        axios.get("https://generateapi.techsnack.online/api/product", { headers: { Authorization: tokenProduct } })
        .then((res) => dispatch(setProduct(res.data.Data)))
        .catch((err) => console.error("GET error: ", err))
    }, [dispatch])

    const categoryCount = useCallback(() => {
        axios.get("https://generateapi.techsnack.online/api/category", { headers: { Authorization: tokenCategory } })
        .then((res) => dispatch(setCategory(res.data.Data)))
        .catch((err) => console.error("GET error: ", err))
    }, [dispatch])

    const supplierCount = useCallback(() => {
        axios.get("https://generateapi.techsnack.online/api/supplier", { headers: { Authorization: tokenSupplier } })
        .then((res) => dispatch(setSupplier(res.data.Data)))
        .catch((err) => console.error("GET error: ", err))
    }, [dispatch])

    const salesCount = useCallback(() => {
        axios.get("https://generateapi.techsnack.online/api/sales", { headers: { Authorization: tokenSales } })
        .then((res) => dispatch(setSales(res.data.Data)))
        .catch((err) => console.error("GET error: ", err))
    }, [dispatch])

    useEffect(() => {
        productCount();
        categoryCount();
        supplierCount();
        salesCount();
    }, [productCount, categoryCount, supplierCount, salesCount])

    const cards = [
        {
            icon: <FaBoxes />,
            title: "Products",
            count: products?.length,
            path: "/admin/product",
        },
        {
            icon: <MdCategory />,
            title: "Categories",
            count: categories?.length,
            path: "/admin/category",
        },
        {
            icon: <FaTruckLoading />,
            title: "Suppliers",
            count: suppliers?.length,
            path: "/admin/supplier",
        },
        {
            icon: <GrMoney />,
            title: "Sales",
            count: sales?.length,
            path: "/admin/sales",
        },
    ] 

    return(
        <>
            <Box>
                <Box sx={{mb: 2}}>
                    <Typography variant="h4">Dashboard</Typography>
                </Box>

                <Grid container spacing={{ xs: 2, sm: 3 }}>
                    {cards.map((item, index) => (
                        <Grid size={{ xs: 12, sm: 4 }} key={index} component={Link} to={item.path}
                            sx={{textDecoration: "none"}}
                        >
                            <Card sx={{ width: "100%", borderRadius: 2, color: "#FFF",
                                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb)",
                                    boxShadow: "0 10px 30px rgba(37, 99, 235, 0.3)", transition: "0.3s ease-in-out",
                                    "&:hover": { transform: "translateY(-6px)"},
                                }}
                            >
                                <CardContent sx={{display: "flex", flexDirection: "column"}}>
                                    <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {item.title}
                                        </Typography>
                                        <IconButton component={Paper} 
                                            sx={{ p: 1.2, mb: 1, color: "#065fed", background: "#dce9ff", 
                                                transition: "0.3s ease-in-out", fontSize: "20px",
                                                '&:hover': { background: "#065fed", color: "#dce9ff", fontWeight: 700 },
                                            }}
                                        >
                                            {item.icon}
                                        </IconButton>
                                    </Box>
                                    <Typography variant="h4">
                                        <CountUp delay={0.5} end={item.count ?? 0} duration={0.6} />
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </>
    )
}   

export default Dashboard;