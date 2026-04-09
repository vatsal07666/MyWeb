import React, { useContext, useEffect } from 'react'
import * as Yup from 'yup';
import { Box, Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, 
    Divider, IconButton, InputBase, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Tooltip, Typography, useMediaQuery, useTheme
} from '@mui/material'
import { IoMdAdd, IoMdRefresh } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { setProduct, addProduct, deleteProduct, updateProduct, setDeleteId, setDeleteOpen, setEditId, 
    setLoading, setOpenForm, setSearchItem, resetDeleteState, resetUIState, resetFormValues, setFormValues,
    setPreview, resetPreview,
} from './ProductSlice'
import { useSnackbar } from '../../Context/SnackbarContext'
import { DataContext } from '../../Context/ContextProvider'
import { Field, Form, Formik } from 'formik'
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaEdit } from 'react-icons/fa';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import { NavLink } from 'react-router-dom/cjs/react-router-dom';
import { MdOutlineViewInAr } from "react-icons/md";
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

const AddProduct = () => {
    const { list: products = [], formValues, editId, openForm, deleteOpen, deleteId, searchItem, 
        loading, preview } = useSelector((state) => state.productStore);
    const { categories, suppliers } = useContext(DataContext);
    const dispatch = useDispatch();
    const { ShowSnackbar } = useSnackbar();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const validationSchema = Yup.object({
        productName: Yup.string().required("Product Name is Required*"),
        sku: Yup.string().required("SKU is Required*"),
        category: Yup.string().required("Category is required*"),
        supplier: Yup.string().required("Supplier is Required*"),
        stock: Yup.number().typeError("Stock Must be Number").required("Stock is Required")
                .min(0, "Stock cannot be negative"),
        costPrice: Yup.number().typeError("Cost Price must be Number*").required("Cost Price is Required*")
                    .min(0, "Cost Price cannot be negative"),
        sellingPrice: Yup.number().typeError("Selling Price must be Number*")
                .required("selling Price is Required*").min(0, "Selling Price cannot be negative")
                .min(Yup.ref("costPrice"), "Selling Price cannot be less than costPrice"),
        productImage: Yup.mixed().required("Product Image is Required*")
    })

    const token = "DocAKBFPpGh4l7vo";
    
    // Get Method
    const getData = () => {
        return axios.get("https://generateapi.techsnack.online/api/product", {
            headers: { Authorization: token }
        })
        .then((res) => {
            console.log("GET response: ", res.data);
            dispatch(setProduct(res.data.Data));
        })
        .catch((err) => {
            console.error("GET error: ", err);
        })
    }

    // Load Data
    useEffect(() => {
        getData();
        // eslint-disable-next-line
    }, [])

    // Post Method
    const postData = (values) => {
        const formData = new FormData();
        formData.append("productName", values.productName);
        formData.append("sku", values.sku);
        formData.append("category", values.category);
        formData.append("supplier", values.supplier);
        formData.append("stock", Number(values.stock));
        formData.append("costPrice", Number(values.costPrice));
        formData.append("sellingPrice", Number(values.sellingPrice));
        if (values.productImage instanceof File) {
            formData.append("productImage", values.productImage);
        }

        axios.post("https://generateapi.techsnack.online/api/product", formData, {
            headers: { Authorization: token }
        })
        .then((res) => {
            console.log("POST response: ", res.data);
            if(res.status === 200 || res.status === 204){
                dispatch(addProduct(res.data.Data));
                ShowSnackbar("Product Added Successfully !", "success");
                handleRefresh();
            }
        })
        .catch((err) => {
            console.error("POST error: ", err);
        })
    }

    // Delete Method
    const deleteData = () => {
        axios.delete(`https://generateapi.techsnack.online/api/product/${deleteId}`, {
            headers: { Authorization: token }
        })
        .then((res) => {
            console.log("DELETE response: ", res.status);
            if(res.status === 200 || res.status === 204){
                dispatch(deleteProduct(deleteId));
                dispatch(resetDeleteState());
                ShowSnackbar("Product Deleted Successfully !", "error");
            }
        })
        .catch((err) => {
            console.log("DELETE error: ", err);
        })
    }

    // Patch Method
    const patchData = (id, values) => {
        const formData = new FormData();
        formData.append("productName", values.productName);
        formData.append("sku", values.sku);
        formData.append("category", values.category);
        formData.append("supplier", values.supplier);
        formData.append("stock", Number(values.stock));
        formData.append("costPrice", Number(values.costPrice));
        formData.append("sellingPrice", Number(values.sellingPrice));
        if (values.productImage instanceof File) {
            formData.append("productImage", values.productImage);
        }

        axios.patch(`https://generateapi.techsnack.online/api/product/${id}`, formData, {
            headers: { Authorization: token }
        })
        .then((res) => {
            console.log("PATCH response: ", res.data);
            if(res.status === 200 || res.status === 204){
                dispatch(updateProduct(res.data.Data));
                ShowSnackbar("Product Updated Successfully !", "success");
                handleRefresh();
            }
        })
        .catch((err) => {
            console.error("PATCH response: ", err);
        })
    }

    const handleSubmit = (values, {resetForm, setFieldError}) => {
        const newProduct = values.sku?.toLowerCase();

        const isDuplicate = (products || []).some((p) => p.sku?.toLowerCase() === newProduct);

        if(isDuplicate && editId === null){
            setFieldError("sku", "Product with same SKU (Stock Keeping Unit) is already exists.");
            return;
        }

        if(editId !== null){
            patchData(editId, values);
        } else {
            postData(values);
        }
        resetForm();
        dispatch(resetFormValues());
        dispatch(resetUIState());
        dispatch(resetPreview());
    }

    // Referesh Data
    const handleRefresh = () => {
        dispatch(setLoading(true));
        getData().then(() => {
            ShowSnackbar("Data Refreshed !", "info");
        }).finally(() => {
            dispatch(setLoading(false));
        })
    }

    const handleCancel = (resetForm) => {
        resetForm();
        dispatch(resetFormValues());
        dispatch(resetUIState());
        dispatch(resetPreview());
    };

    const handleEdit = (item) => {
        dispatch(setOpenForm(true));
        dispatch(setEditId(item._id));
        dispatch(setFormValues({
            productName: item.productName, sku: item.sku, category: item.category, supplier: item.supplier,
            stock: Number(item.stock), costPrice: Number(item.costPrice), sellingPrice: Number(item.sellingPrice),
            productImage: dispatch(setPreview(item.productImage))
        }));
    }

    const handleDelete = (item) => {
        dispatch(setDeleteOpen(true));
        dispatch(setDeleteId(item._id));
    }

    /* ---------------- Search ---------------- */
    const filteredProduct = products.filter(
        p => (p.productName ?? '').toLowerCase().includes((searchItem ?? '').toLowerCase())
    );

    return (
        <>
            <Box component={Paper} sx={{p:3, borderRadius: 2 }}>
                {/* Heading & Add Product Button */}
                <Box sx={{display: "flex", flexDirection: {xs: "column", sm: "row"}, justifyContent: "space-between", 
                        alignItems: {xs: "flex-start", sm: "center"}
                    }}
                >
                    <Box>
                        <h1>Products ({products.length})</h1>
                        <Typography variant='span' sx={{color: "#888888", fontSize: "15px"}}>
                            List of all products in your inventory
                        </Typography>
                    </Box>
                    
                    <Button onClick={() => dispatch(setOpenForm(true))} 
                        sx={{background: "linear-gradient(135deg, #2563eb, #1e40af)", color: "#fff", 
                            p: "8px 14px", borderRadius: 2, mt: {xs: 2, sm: 0}, whiteSpace: "none", 
                            textTransform: "none"
                        }}
                        startIcon={<IoMdAdd />}
                    >
                        Add Product
                    </Button>
                </Box>

                {/* Product Form */}
                <Dialog open={openForm} sx={{ zIndex: 2000 }} maxWidth="md" fullWidth disableRestoreFocus
                    slotProps={{
                        backdrop: { sx: { backgroundColor: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" } }
                    }}
                >
                    <DialogTitle sx={{ fontWeight: 700 }}>
                        {editId !== null ? "Edit Product" : "Add New Product"}
                    </DialogTitle>

                    <Divider />
                
                    <DialogContent sx={{ mt: 1 }}>
                        <Formik initialValues={formValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                            enableReinitialize
                        >
                            {({errors, touched, setFieldValue, isValid, dirty, resetForm}) => (
                                <Form>
                                    {/* Product & SKU */}
                                    <Box sx={{ display: "flex", flexDirection: {xs: "column", sm: "row"}, 
                                            gap: 3, mb: 3 
                                        }}
                                    >
                                        <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                            <label htmlFor="productName">Product Name</label>
                                            <Field name="productName" id="productName" placeholder="Enter Product Name" />
                                            {errors.productName && touched.productName && <div style={{color: "#ff0000"}}>{errors.productName}</div>}
                                        </Box>

                                        <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                            <label htmlFor="sku">SKU</label>
                                            <Field name="sku" id="sku" placeholder="Enter SKU" />
                                            {errors.sku && touched.sku && <div style={{color: "#ff0000"}}>{errors.sku}</div>}
                                        </Box>
                                    </Box>

                                    {/* Category & Supplier */}
                                    <Box sx={{ display: "flex", flexDirection: {xs: "column", sm: "row"}, 
                                            gap: 3, mb: 3 
                                        }}
                                    >
                                        <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                            <label htmlFor="category">Category</label>
                                            <Field name= "category" id= "category" as="select">
                                                <option value="" hidden>Select Category</option>
                                                {(categories || []).filter((cat) => cat.status === "Active")
                                                .map((cat) => (
                                                    <option key={cat._id} value={cat.categoryName}>
                                                        {cat.categoryName}
                                                    </option>
                                                ))}
                                            </Field>
                                            {errors.category && touched.category && <div style={{color: "#ff0000"}}>{errors.category}</div>}
                                        </Box>

                                        <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                            <label htmlFor="supplier">Supplier</label>
                                            <Field name="supplier" id="supplier" as="select"> 
                                                <option value="" hidden>Select Supplier</option>
                                                {suppliers.map((sup) => <option key={sup._id} value={sup.supplierName}>{sup.supplierName}</option>)}
                                            </Field>
                                            {errors.supplier && touched.supplier && <div style={{color: "#ff0000"}}>{errors.supplier}</div>}
                                        </Box>
                                    </Box>

                                    {/* Stock & costPrice & sellingPrice */}
                                    <Box sx={{ display: "flex", flexDirection: {xs: "column", sm: "row"}, 
                                            gap: 3, mb: 3, flexWrap: "wrap" 
                                        }}
                                    >
                                        <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                            <label htmlFor="stock">Stock</label>
                                            <Field name="stock" id= "stock" type="number" placeholder="Enter Stock" 
                                                onKeyDown={(e) => {if (["e", "+", "-"].includes(e.key)) e.preventDefault();}}
                                            />
                                            {errors.stock && touched.stock && <div style={{color: "#ff0000"}}>{errors.stock}</div>}
                                        </Box>

                                        <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                            <label htmlFor="costPrice">Cost Price</label>
                                            <Field name="costPrice" id="costPrice" type="number" placeholder="Enter Cost Price" 
                                                onKeyDown={(e) => {if (["e", "+", "-"].includes(e.key)) e.preventDefault();}}
                                            />
                                            {errors.costPrice && touched.costPrice && <div style={{color: "#ff0000"}}>{errors.costPrice}</div>}
                                        </Box>

                                        <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                            <label htmlFor="sellingPrice">Selling Price</label>
                                            <Field name="sellingPrice" id="sellingPrice" type="number" placeholder="Enter Selling Price" 
                                                onKeyDown={(e) => {if (["e", "+", "-"].includes(e.key)) e.preventDefault();}}
                                            />
                                            {errors.sellingPrice && touched.sellingPrice && <div style={{color: "#ff0000"}}>{errors.sellingPrice}</div>}
                                        </Box>
                                    </Box>

                                    {/* Image Upload with Preview */}
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}>
                                        <label htmlFor="productImage" style={{fontWeight: 600}}>Product Image</label>

                                        <input id='productImage' type="file"
                                            onChange={(e) => {
                                                const file = e.currentTarget.files[0];
                                                if (file) {
                                                    setFieldValue("productImage", file); // store actual file
                                                    dispatch(setPreview(URL.createObjectURL(file)));
                                                }
                                            }}
                                        />

                                        {/* Live Preview */}
                                        {preview && (
                                            <Box sx={{ mt: 1 }}>
                                                <img src={preview}
                                                    alt="Preview"
                                                    style={{ width: 120, height: 120, objectFit: "contain",
                                                        borderRadius: 8, border: "1px solid #ddd",
                                                        
                                                    }}
                                                />
                                            </Box>
                                        )}

                                        {errors.productImage && touched.productImage && (
                                            <div style={{ color: "#ff0000" }}>{errors.productImage}</div>
                                        )}
                                    </Box>

                                    {/* Cancle & Submit Button */}
                                    <DialogActions>
                                        <Button onClick={() => handleCancel(resetForm)} sx={{ color: "#1e293b" }}>
                                            Cancel
                                        </Button>
                                        
                                        <Button type="submit" variant="contained"                
                                            sx={{ background: "#1e40af" }}
                                            disabled={!isValid || !dirty}
                                        >
                                            {editId !== null ? "Update" : "Submit"}
                                        </Button>
                                    </DialogActions>
                                </Form>
                            )}
                        </Formik>
                    </DialogContent>
                </Dialog>

                {/* View Button, Search & Refresh Button */}
                <Box sx={{display: "flex", flexDirection: {xs: "column", sm: "row"}, justifyContent: "center", 
                        alignItems: {xs: "stretch", sm: "center"}, gap: {xs: 1, sm: 0}, my: 2
                    }}
                >
                    <Box sx={{ mr: {xs: 0, sm: 2} }}>
                        <Tooltip title="View Products" component={Paper} placement="top"
                            slotProps={{
                                tooltip: {
                                    sx: { background: "#065fed", color: "#fff", letterSpacing: 2, 
                                        fontWeight: 600
                                    }
                                }
                            }}
                        >
                            <IconButton component={NavLink} to="/admin/viewProducts" 
                                sx={{background: "#dbeafe", color: "#1d4ed8", borderRadius: 2, 
                                    transition: "0.3s ease-in-out", 
                                    '&:hover': {background: "#1d4ed8", color: "#dbeafe"}
                                }}
                            >
                                <MdOutlineViewInAr size={20} />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    {/* Search Field */}
                    <Box sx={{ position: 'relative', border: 1, borderRadius: 2, width: { xs: "100%", sm: "60%", md: "50%" }, 
                            py: 0.5, my: 2
                        }}
                    >
                        <InputBase name="search" placeholder="Search Product" value={searchItem ?? ""}
                            onChange={(e) => dispatch(setSearchItem(e.target.value))}
                            sx={{ paddingLeft: '40px', width: '100%', boxSizing: "border-box" }}
                        />
                        <SearchIcon sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)'}} />
                    </Box>

                    
                    {/* Refresh Button */}
                    <Box sx={{ml: {xs: 0, sm: 2}}}>
                        <Tooltip title="Refresh List" placement="right"
                            slotProps={{
                                tooltip: {
                                    sx: { background: "#065fed", color: "#fff", letterSpacing: 2, 
                                        fontWeight: 600
                                    }
                                }
                            }}
                        >
                            <IconButton sx={{background: "#dbeafe", color: "#1d4ed8", borderRadius: 2, 
                                    transition: "0.3s ease-in-out", 
                                    '&:hover': {background: "#1d4ed8", color: "#dbeafe"}
                                }}
                                onClick={handleRefresh}
                                disabled={loading}
                            >
                                {loading ? (
                                    <CircularProgress size={20} />
                                ) : (
                                    <IoMdRefresh size={20} />
                                )}
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
    
                {/* Product Table */}
                {!isMobile ? (
                    <TableContainer component={Paper} elevation={0} 
                        sx={{ WebkitOverflowScrolling: 'touch', 
                            '&::-webkit-scrollbar': { width: "5px", height: '5px' },
                            '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1' },
                            '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: 4,
                                '&:hover': { backgroundColor: '#555' },
                            }, maxHeight: 500
                        }}
                    >
                        <Table sx={{ borderCollapse: "separate", borderSpacing: 0 }}>
                            <TableHead sx={{ background: "linear-gradient(135deg, #2563eb, #1e40af)", 
                                    "& .MuiTableCell-head": { color: "#ffffff", fontWeight: 600, fontSize: "14px",
                                    borderBottom: "none" }, whiteSpace: "nowrap"
                                }}
                            >
                                <TableRow>
                                    {["#", "Product", "SKU", "Category", "Supplier", "Stock", "Cost", "Price", "Actions"]
                                        .map((h) => (
                                            <TableCell key={h} sx={{ color: "#fff", textAlign: "center" }}>
                                                {h}
                                            </TableCell>
                                        ))}
                                </TableRow>
                            </TableHead>

                            <TableBody sx={{ "& .MuiTableCell-root": { fontSize: "16px", whiteSpace: "nowrap",
                                    borderRight: "1px solid rgba(255, 255, 255, 0.1)", py: 1.5                      
                                }
                            }}>
                                {filteredProduct.length > 0 ? (
                                    filteredProduct.map((item, index) => (
                                        <TableRow key={item._id ?? index}
                                            sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                                                "&:hover": { backgroundColor: "#e9f5fd" }, 
                                                transition: "all 0.3s ease"
                                            }}
                                        >
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell style={{display: "flex", alignItems: "center", gap: 10}}>
                                                {item.productImage && (
                                                    <img src={item.productImage} alt={item.productName}
                                                        style={{ width: 50, height: 50, objectFit: "contain",
                                                            borderRadius: 6, flexShrink: 0
                                                        }}
                                                    />
                                                )}

                                                <Tooltip title={item.productName}>
                                                    <Typography component={"span"}> 
                                                        {item.productName} 
                                                    </Typography>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>{item.sku}</TableCell>
                                            <TableCell>{item.category}</TableCell>
                                            <TableCell>{item.supplier}</TableCell>
                                            <TableCell style={{textAlign: "center"}}>{item.stock}</TableCell>
                                            <TableCell style={{textAlign: "center"}}>{item.costPrice}</TableCell>
                                            <TableCell style={{textAlign: "center"}}>{item.sellingPrice}</TableCell>
                                            <TableCell>
                                                <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", gap: 1}}>
                                                    {/* Delete Button */}
                                                    <Tooltip title="Delete" component={Paper}
                                                        slotProps={{
                                                            tooltip: {
                                                                sx:{ fontSize: "12px", px: 2, color:"#ef4444", background: "#ffddddff",
                                                                    letterSpacing: 1, fontWeight: 600
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <IconButton
                                                            sx={{
                                                                background:"#fff", color: "#ef4444", transition: "0.3s ease-in-out",
                                                                "&:hover": { background: "#dc2626", color:"#fff" }
                                                            }}
                                                            onClick={() => handleDelete(item)}
                                                        >
                                                            <RiDeleteBin6Line />
                                                        </IconButton>
                                                    </Tooltip>

                                                    {/* Delete Button Dialog */}
                                                    <Dialog open={deleteOpen} fullWidth onClose={() => dispatch(resetDeleteState())} 
                                                        disableRestoreFocus
                                                        slotProps={{
                                                            backdrop: {
                                                                sx: { backgroundColor: "rgba(0,0,0,0.35)",
                                                                    backdropFilter: "blur(4px)"
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <DialogTitle id="alert-dialog-title"> Confirm Delete By Clicking Delete! </DialogTitle>
                                                        
                                                        <DialogActions>
                                                            <Button onClick={() => dispatch(resetDeleteState())} 
                                                                variant="contained" 
                                                                sx={{color: "#1e293b", background: "#fff", 
                                                                    '&:hover': { boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.5)" }
                                                                }}
                                                            >
                                                                Cancle
                                                            </Button>

                                                            <Button variant="contained" className="agree-button" 
                                                                onClick={deleteData}
                                                                sx={{background: "#ef4444", color: "#fff", transition: "0.2s ease-in-out",
                                                                    '&:hover': {background: "#fff", color: "#ff0000", 
                                                                        boxShadow: "0 0 2px rgba(255, 0, 0, 1)"
                                                                    }
                                                                }}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </DialogActions>    
                                                    </Dialog>

                                                    {/* Edit Button */}
                                                    <Tooltip title="Edit" component={Paper}
                                                        slotProps={{
                                                            tooltip: {
                                                                sx:{ fontSize: "12px", px: 2, color:"#2563eb", background: "#dee9ffff",
                                                                    letterSpacing: 1, fontWeight: 600
                                                                }
                                                            }
                                                        }}
                                                    >
                                                    <IconButton
                                                            sx={{
                                                                background: "#fff", color:"#2563eb", transition: "0.2s",
                                                                "&:hover": { background: "#2563eb", color:"#fff" }
                                                            }}
                                                            onClick={() => handleEdit(item)}
                                                        >
                                                            <FaEdit />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    )
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={9}>
                                            <Box sx={{ width: "100%", display: "flex", flexDirection: "column",
                                                    alignItems: "center", justifyContent: "center", py: 10, textAlign: "center",
                                                    color: "#64748B"
                                                }} 
                                            >
                                                {/* Icon */}
                                                <Inventory2OutlinedIcon sx={{ fontSize: 100, color: "#cbd5e1", mb: 2 }} />

                                                {/* Title */}
                                                <Typography sx={{ fontSize: "22px", fontWeight: 600, color: "#1e293b" }} >
                                                    No Products Found
                                                </Typography>

                                                {/* Subtitle */}
                                                <Typography sx={{ mt: 1, fontSize: 14 }}>
                                                    there aren’t any products added yet.
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2}}>
                        {filteredProduct.map((item, index) => (
                            <Card key={item._id ?? index}
                                sx={{ borderRadius: 3, boxShadow: 2, display: "flex", flexDirection: "column" }}
                            >
                                {/* CONTENT */}
                                <CardContent sx={{ flexGrow: 1 }}>
                                    {item.productImage && (
                                        <Box sx={{ textAlign: "center", mb: 1 }}>
                                            <img src={item.productImage} alt={item.productName}
                                                style={{ width: "100%", maxHeight: 150, objectFit: "contain",
                                                    borderRadius: 10, 
                                                }}
                                            />
                                        </Box>
                                    )}

                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                        <Typography fontWeight={600}> {item.productName} </Typography>

                                        <Typography color="text.secondary"> #{index + 1} </Typography>
                                    </Box>

                                    <Divider sx={{ my: 1 }} />

                                    <Typography variant="body2"><b>SKU:</b> {item.sku}</Typography>
                                    <Typography variant="body2"><b>Category:</b> {item.category}</Typography>
                                    <Typography variant="body2"><b>Supplier:</b> {item.supplier}</Typography>
                                    <Typography variant="body2"><b>Stock:</b> {item.stock}</Typography>
                                    <Typography variant="body2"><b>Cost Price:</b> ₹{item.costPrice}</Typography>

                                    <Box sx={{ mt: 1 }}>
                                        <Typography fontWeight={600} color="success.main">
                                            <b>Selling Price:</b> ₹{item.sellingPrice}
                                        </Typography>
                                    </Box>
                                </CardContent>

                                {/* ACTIONS — ALWAYS AT BOTTOM */}
                                <Box sx={{ display: "flex", justifyContent: "center", gap: 1, p: 2, mt: "auto" }}>
                                    <Button
                                        sx={{ background: "#fff", color: "#ef4444", border: 1, whiteSpace: "nowrap" }}
                                        onClick={() => dispatch(setDeleteOpen(true))}
                                    >
                                        <RiDeleteBin6Line />&nbsp; Delete
                                    </Button>

                                    <Button
                                        sx={{ background: "#fff", color: "#2563eb", border: 1, whiteSpace: "nowrap" }}
                                        onClick={() => handleEdit(item)}
                                    >
                                        <FaEdit />&nbsp; Edit
                                    </Button>
                                </Box>
                            </Card>
                        ))}
                    </Box>
                )}
            </Box>
        </>
    )
}

export default AddProduct