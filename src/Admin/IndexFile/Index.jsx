import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Button, Container, Drawer, Tooltip } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from "react-router-dom";
import { useHistory, useLocation } from 'react-router-dom';
import { FaBoxes } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { useState } from 'react';
import { useEffect } from 'react';
import { useSnackbar } from '../../Context/SnackbarContext';
import useMediaQuery from "@mui/material/useMediaQuery";
import { FaTruckLoading } from "react-icons/fa";
import { GrMoney } from "react-icons/gr";

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
        shouldForwardProp: (prop) => prop !== 'open',
    })(({ theme, open }) => ({
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),

}));

const DesktopDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open'})(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const Items = [
    { name: "Dashboard", icon: <TbLayoutDashboardFilled />, label: "Dashboard", to: "/admin" },
    { name: "Product", icon: <FaBoxes />, label: "Add Product", to: "/admin/product" },
    { name: "Category", icon: <MdCategory />, label: "Add Category", to: "/admin/category" },
    { name: "Supplier", icon: <FaTruckLoading />, label: "Add Supplier", to: "/admin/supplier" },
    { name: "sales", icon: <GrMoney />, label: "Add Sales", to: "/admin/sales" }
]

export default function Index({children}) {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const { ShowSnackbar } = useSnackbar();
    const history = useHistory();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const location = useLocation();
    const prevPathRef = React.useRef(location.pathname);

    const handleDrawerOpen = () => {
        setOpen(prev => !prev);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    // ROLE CHECK
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const role = localStorage.getItem("role");

        if (!token || role !== "admin") {
            history.replace(role === "user" ? "/" : "/log-in");
        } else {
            setIsLoggedIn(true);
        }
    }, [history]);

    useEffect(() => {
        if(prevPathRef.current !== location.pathname){
            if (isMobile && open) {
                setOpen(false);
            }
            prevPathRef.current = location.pathname;
        }
    }, [location.pathname, isMobile, open]); // route change only

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("role");
        setIsLoggedIn(false);
        history.push("/log-in");
        ShowSnackbar("Logged Out successful !", "success");
    };

    if (!isLoggedIn) return null; // Prevent rendering before role check

    const DrawerContent = (
        <>
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            {Items.map((menu) => (
                <List key={menu.name}>
                    <ListItem disablePadding sx={{ display: 'block' }}>
                        <Tooltip title={menu.name} placement="right"
                            slotProps={{
                                tooltip: { sx: {background: "#065fed", color: "#fff", letterSpacing: 2, 
                                    fontWeight: 600 }}
                            }}
                        >
                            <ListItemButton component={Link} to={menu.to} 
                                sx={{  mx: 1,  my: 0.5, borderRadius: "10px", 
                                    backgroundColor: location.pathname === menu.to ? "#dbeafe" : "transparent",
                                    "&:hover": { backgroundColor: "#dbeafe" },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', fontSize: "23px", 
                                        transition: "0.2s ease", mr: open ? 3 : 'auto', 
                                        color: location.pathname === menu.to ? "#1d4ed8" : "#475569", 
                                        ".MuiListItemButton-root:hover &": { color: "#2563eb" },
                                    }}
                                >
                                    {menu.icon}
                                </ListItemIcon>
                                <ListItemText primary={menu.name}
                                    sx={{ opacity: open ? 1 : 0, 
                                        color: location.pathname === menu.to ? "#1d4ed8" : "#475569",
                                    }}
                                />
                            </ListItemButton>
                        </Tooltip>
                    </ListItem>
                </List>
            ))}
        </>
    )

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={!isMobile && open} 
                sx={{ background: "linear-gradient(90deg, #2563eb 0%, #1e40af 100%)", 
                    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)" 
                }}
            >
                <Toolbar>
                    <IconButton color="inherit" aria-label="open drawer"
                        onClick={handleDrawerOpen} edge="start"
                        sx={{ mr: 2, display: { md: open ? "none" : "inline-flex" } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box sx={{width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <Typography variant="h6" noWrap component="div">
                            Dashboard
                        </Typography>
                        <Button sx={{color: "#fff", border: "1px solid rgb(255, 255, 255)", px: 2, py: 0.6,
                                transition: "0.3s ease-in-out", textTransform: "none",
                                '&:hover': { background: "#fff", color: "#2563eb", border: 0, 
                                    boxShadow: "0 0 10px rgba(255, 255, 255, 0.7)", fontWeight: 700
                                }, fontSize: {xs: "13px", sm: "15px"}
                            }}
                            onClick={() => { isLoggedIn ? handleLogout() : history.push("/log-in") }}
                        >
                            {isLoggedIn ? "Log out" : "Log in"}
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Desktop Drawer */}
            {!isMobile ? (
                <DesktopDrawer variant="permanent" open={open} 
                    sx={{ "& .MuiDrawer-paper": { backgroundColor: "#ffffff", color: "#0f172a",
                        borderRight: "1px solid #e2e8f0" },
                    }}
                >
                    {DrawerContent}
                </DesktopDrawer>
            ) : (
                <Drawer variant="temporary" open={open} onClose={handleDrawerClose}
                    ModalProps={{ keepMounted: true }}
                    sx={{ '& .MuiDrawer-paper': { width: drawerWidth, height: '100vh' } }}
                >
                    {DrawerContent}
                </Drawer>
            )}

            <Box component="main" sx={{ minHeight: "100vh", flexGrow: 1, pt: 10, pb: 3, px: { xs: 2, sm: 0 },
                    background: "linear-gradient(to bottom right, #f8fafc, #eef2ff)",
                    transition: theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    overflowX: 'hidden',   // allow horizontal scroll when content overflows
                }}
            >
                <Container maxWidth="lg">
                    {children}
                </Container>
            </Box>

        </Box>
    );
}