import React, { useEffect, useRef } from "react";
import { addItemDraft, addSales, deleteSales, removeItemDraft, resetDeleteState, resetFormValues, 
    resetItemDraft, 
    resetUIState, setDeleteId, setDeleteOpen, setEditId, setFormValues, setInvoiceData, setInvoiceOpen, setLoading, setOpenForm, setSales, 
    setSearchItem, updateSales 
} from "./SalesSlice";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, 
    Divider, IconButton, InputBase, Paper, Table, TableBody, TableCell, TableContainer, TableHead, 
    TableRow, Tooltip, Typography, 
    useMediaQuery, 
    useTheme
} from "@mui/material";
import { IoMdAdd, IoMdRefresh } from "react-icons/io";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useSnackbar } from "../../Context/SnackbarContext";
import { RiDeleteBin6Line } from "react-icons/ri";
import { NavLink } from "react-router-dom/cjs/react-router-dom";
import { MdOutlineViewInAr } from "react-icons/md";
import SearchIcon from '@mui/icons-material/Search';
import { FaEdit, FaEye } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PaymentsIcon from '@mui/icons-material/Payments';

const AddSales = () => {
    const { list: sales = [], formValues, openForm, itemDraft, editId, searchItem, loading, 
        deleteId, deleteOpen, invoiceData, invoiceOpen } = useSelector((state) => state.salesStore);
    const dispatch = useDispatch();
    const { ShowSnackbar } = useSnackbar();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const methods = [ "Cash", "Card", "Online"];
    const status = [ "Paid", "Pending" ];

    const validationSchema = Yup.object({
        customer: Yup.string().required("Customer Name is Required*"),
        mobile: Yup.string().typeError("Phone must be Number*")
                .matches(/^[0-9]{10}$/, "Phone Number must be exactly 10 digits*"),
        paymentMethod: Yup.string().required("Payment Method is required*"),
        paymentStatus: Yup.string().required("Payment Status is required*"),
        date: Yup.date().required("Date is required*").max(new Date(), "Date cannot be in the future*"),
    });

    const token = "lwfog6Wx9g3tZrPp";

    const getData = () => {
        return axios.get("https://generateapi.techsnack.online/api/sales", {
            headers: { Authorization: token },
        })
        .then((res) => {
            console.log("GET response: ", res.data);
            dispatch(setSales(res.data.Data));
        })
        .catch((err) => {
            console.error("GET error: ", err);
        });
    };

    useEffect(() => {
        getData();
        // eslint-disable-next-line
    }, []);
    
    // Post Method
    const postData = (values) => {
        const formData = new FormData();
        formData.append("customer", values.customer);
        formData.append("mobile", values.mobile);
        formData.append("items", JSON.stringify(itemDraft));
        formData.append("paymentMethod", values.paymentMethod);
        formData.append("paymentStatus", values.paymentStatus);
        formData.append("date", values.date);

        axios.post("https://generateapi.techsnack.online/api/sales", formData, {
            headers: { Authorization: token }
        })
        .then((res) => {
            console.log("POST response: ", res.data);
            if(res.status === 200 || res.status === 204){
                dispatch(addSales(res.data.Data));
                ShowSnackbar("Product Added Successfully !", "success");
                dispatch(resetItemDraft());
                handleRefresh();
            }
        })
        .catch((err) => {
            console.error("POST error: ", err);
        })
    }

    // Delete Method
    const deleteData = () => {
        axios.delete(`https://generateapi.techsnack.online/api/sales/${deleteId}`, {
            headers: { Authorization: token }
        })
        .then((res) => {
            console.log("DELETE response: ", res.status);
            if(res.status === 200 || res.status === 204){
                dispatch(deleteSales(deleteId));
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
        formData.append("customer", values.customer);
        formData.append("mobile", values.mobile);
        formData.append("items", JSON.stringify(itemDraft));
        formData.append("paymentMethod", values.paymentMethod);
        formData.append("paymentStatus", values.paymentStatus);
        formData.append("date", values.date);

        axios.patch(`https://generateapi.techsnack.online/api/sales/${id}`, formData, {
            headers: { Authorization: token }
        })
        .then((res) => {
            console.log("PATCH response: ", res.data);
            if(res.status === 200 || res.status === 204){
                dispatch(updateSales(res.data.Data));
                ShowSnackbar("Product Updated Successfully !", "success");
                handleRefresh();
            }
        })
        .catch((err) => {
            console.error("PATCH response: ", err);
        })
    }

    const handleSubmit = (values, { resetForm }) => {
        if (!itemDraft.length) {
            alert("Add at least one item");
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
        dispatch(setEditId(null));
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
    };

    // Add new item inside formValues.items[]
    const handleAddItem = (values, { setFieldValue }) => {
        if (!values.product || !values.quantity || !values.unitprice) {
            alert("Enter all item fields");
            return;
        }

        dispatch(addItemDraft({ 
            product: values.product, 
            quantity: Number(values.quantity), 
            unitprice: Number(values.unitprice),
            total: Number(values.quantity) * Number(values.unitprice) 
        }));
        setFieldValue("product", "");
        setFieldValue("quantity", "");
        setFieldValue("unitprice", "");
    };

    // Delete Items
    const handleDeleteItem = (index) => {
        dispatch(removeItemDraft(index));
    };
    
    const itemsSubtotal = itemDraft.reduce(
        (sum, items) => sum + Number(items.quantity) * Number(items.unitprice),
        0
    );

    const handleDelete = (item) => {
        dispatch(setDeleteOpen(true));
        dispatch(setDeleteId(item._id));
    }

    const handleEdit = (item) => {
        dispatch(setOpenForm(true));
        dispatch(setEditId(item._id));
        dispatch(setFormValues({...item, date: item.date.split("T")[0]}));
        
        // Pre-fill itemDraft for editing
        dispatch(resetItemDraft());

        const safeItems = Array.isArray(item.items)
            ? item.items
            : JSON.parse(item.items || "[]"); // converts into array if string

        safeItems.forEach(it => dispatch(addItemDraft(it)));
    }

    /* ---------------- Search ---------------- */
    const filteredSales = sales.filter(
        s => (s.customer ?? '').toLowerCase().includes((searchItem ?? '').toLowerCase())
    );

    // Invoice
    const generateInvoiceFromId = (id) => {
        if (!id) return "";
        return "INV-" + id.slice(-6).toUpperCase();
    };

    const handleInvoiceOpen = (data) => {
        dispatch(setInvoiceOpen(true));
        dispatch(setInvoiceData({ ...data}));
    };

    const invoiceRef = useRef();

    const handleDownloadPDF = () => {
        if (!invoiceRef.current) return;

        html2canvas(invoiceRef.current, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "pt", "a4"); // portrait, points, A4
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${generateInvoiceFromId(invoiceData._id)}.pdf`);
        });
    };

    return (
        <>
            <Box component={Paper} sx={{p:3, borderRadius: 2 }}>
                {/* Heading & Add Product Button */}
                <Box sx={{display: "flex", flexDirection: {xs: "column", sm: "row"}, justifyContent: "space-between", 
                        alignItems: {xs: "flex-start", sm: "center"}
                    }}
                >
                    <Box>
                        <h1>Sales ({sales.length})</h1>
                        <Typography variant='span' sx={{color: "#888888", fontSize: "15px"}}>
                            List of all sales in your inventory
                        </Typography>
                    </Box>
                    
                    <Button onClick={() => { dispatch(setOpenForm(true)); dispatch(setEditId(null)); }} 
                        sx={{background: "linear-gradient(135deg, #2563eb, #1e40af)", color: "#fff", 
                            p: "8px 14px", borderRadius: 2, mt: {xs: 2, sm: 0}, whiteSpace: "none", 
                            textTransform: "none"
                        }}
                        startIcon={<IoMdAdd />}
                    >
                        Add Sales
                    </Button>
                </Box>

                {/* Product Form */}
                <Dialog open={openForm} sx={{ zIndex: 2000 }} maxWidth="lg" fullWidth disableRestoreFocus
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
                            {({errors, touched, values, setFieldValue, isValid, dirty, resetForm}) => (
                                <Form>
                                    {/* Add Item Form */}
                                    <Box>
                                        {/* Title & Add Button */}
                                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, 
                                                alignItems: "center", gap: 1.5,
                                            }}
                                        >
                                            <Typography variant="h6" fontWeight={600}>Sales Item</Typography>

                                            {/* Add Button */}
                                            <Button
                                                variant="contained"
                                                onClick={() => handleAddItem(values, { setFieldValue })}
                                                sx={{
                                                    background: "linear-gradient(135deg, #2563eb, #1e40af)"
                                                }}
                                            >
                                                {isMobile ? "Add" : "Add Item"}
                                            </Button>
                                        </Box>

                                        {/* INPUT CARD */}
                                        <Box sx={{ py: {xs: 1.5, sm: 2}, px: { xs: 0, sm: 1 }, mb: 2, 
                                                border: "1px solid #eee", borderRadius: 2, display: "flex", 
                                                justifyContent: "space-between", alignItems: "center", 
                                                flexDirection: {xs: "column", sm: "row"}, gap: 2, 
                                                flexWrap: "wrap", textAlign: "center"
                                            }}
                                        >
                                            <Field id="product" name="product" placeholder="Product Name"
                                                value={values.product || ""}
                                            />

                                            <Field id="quantity" name="quantity" type="number" placeholder="Quantity"
                                                value={values.quantity || ""}
                                            />

                                            <Field id="unitprice" name="unitprice" type="number" placeholder="Unit Price"
                                                value={values.unitprice || ""}
                                            />

                                            {/* Total */}
                                            <Box sx={{ fontSize: "15px", fontWeight: 600, mt: 1 }}>
                                                Total: ₹ {(values.quantity || 0) * (values.unitprice || 0)}
                                            </Box>
                                        </Box>
                                            
                                        {/* ITEM LIST */}
                                        {itemDraft.map((it, idx) => (
                                            <Box key={idx} 
                                                sx={{ p: 2, mb: 1.5, border: "1px solid #eee",
                                                    borderRadius: 2
                                                }}
                                            >
                                                <Box sx={{ display: "flex", justifyContent: "space-between",
                                                        alignItems: "center", gap: 1.5, textAlign: "center",
                                                        flexDirection: { xs: "column", sm: "row" }    
                                                    }}
                                                >
                                                    <Typography>
                                                        <b>Product Name:</b> {it.product}
                                                    </Typography>

                                                    <Typography>
                                                        <b>Quantity:</b> {it.quantity}
                                                    </Typography>

                                                    <Typography>
                                                        <b>Unit Price:</b> ₹ {it.unitprice}
                                                    </Typography>

                                                    <Typography>
                                                        <b>Total Price:</b> ₹ {it.total}
                                                    </Typography>

                                                    <IconButton
                                                        color="error"
                                                        onClick={() => handleDeleteItem(idx)}
                                                    >
                                                        <RiDeleteBin6Line />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        ))}

                                        {/* SUBTOTAL */}
                                        <Box sx={{ textAlign: { xs: "center", sm: "right"}, mt: 2, fontWeight: 700 }}>
                                            Subtotal: ₹ {itemsSubtotal}
                                        </Box>
                                    </Box>

                                    <Divider sx={{ mt: 1, mb: 3 }} />

                                    {/* Customer Name & Mobile Number */}
                                    <Box sx={{ display: "flex", flexDirection: {xs: "column", sm: "row"}, 
                                            gap: 3, mb: 3
                                        }}
                                    >
                                        <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                            <label htmlFor="customer">Customer Name</label>
                                            <Field name="customer" id="customer" placeholder="Enter Customer Name" />
                                            {errors.customer && touched.customer && <div style={{color: "#ff0000"}}>{errors.customer}</div>}
                                        </Box>

                                        <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                            <label htmlFor="mobile">Mobile Number</label>
                                            <Field name="mobile" id="mobile" type="number" placeholder="Enter Mobile Number" 
                                                onKeyDown={(e) => {if (["e", "+", "-"].includes(e.key)) e.preventDefault();}}
                                            />
                                            {errors.mobile && touched.mobile && <div style={{color: "#ff0000"}}>{errors.mobile}</div>}
                                        </Box>
                                    </Box>

                                    {/* Payment Method & Status, Date */}
                                    <Box sx={{ display: "flex", flexDirection: {xs: "column", sm: "row"}, 
                                            alignItems: "center", gap: 3, flexWrap: "wrap" 
                                        }}
                                    >
                                        <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                            <label htmlFor="paymentMethod">Payment Method</label>
                                            <Field name= "paymentMethod" id= "paymentMethod" as="select">
                                                <option value="" hidden>Select Payment Method</option>
                                                {methods.map((pm) => <option key={pm} value={pm}> {pm} </option>)}
                                            </Field>
                                            <ErrorMessage name="paymentMethod" component="small" style={{ color: "#ff0000" }} />
                                        </Box>

                                        <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                            <label htmlFor="paymentStatus">Payment Status</label>
                                            <Field name="paymentStatus" id="paymentStatus" as="select"> 
                                                <option value="" hidden>Select Payment Status</option>
                                                {status.map((ps) => <option key={ps} value={ps}>{ps}</option>)}
                                            </Field>
                                            <ErrorMessage name="paymentStatus" component="small" style={{ color: "#ff0000" }} />
                                        </Box>

                                        {/* Date */}
                                        <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                            <label style={{ fontWeight: 600 }}>Date</label>
                                            <Field name="date" id="date" type="date" />
                                            <ErrorMessage name="date" component="small" style={{ color: "#ff0000" }} />
                                        </Box><br />
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
                    {/* View Button */}
                    <Box sx={{ mr: {xs: 0, sm: 2} }}>
                        <Tooltip title="View Sales" component={Paper} placement="top"
                            slotProps={{
                                tooltip: {
                                    sx: { background: "#065fed", color: "#fff", letterSpacing: 2, 
                                        fontWeight: 600
                                    }
                                }
                            }}
                        >
                            <IconButton component={NavLink} to="/admin/viewSales" 
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
                        <InputBase name="search" placeholder="Search Sales" value={searchItem ?? ""}
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

                {/* Desktop Table & Mobile Cards */}
                {!isMobile ? (
                    <TableContainer component={Paper} elevation={0} 
                        sx={{ WebkitOverflowScrolling: 'touch', 
                            '&::-webkit-scrollbar': { width: "5px", height: '5px' },
                            '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1' },
                            '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: 4,
                                '&:hover': { backgroundColor: '#555', cursor: "pointer" },
                            }, maxHeight: 500
                        }}
                    >
                        <Table>
                            <TableHead sx={{ background: "linear-gradient(135deg, #2563eb, #1e40af)", 
                                    "& .MuiTableCell-head": { color: "#ffffff", fontWeight: 600, fontSize: "14px",
                                    borderBottom: "none" }, whiteSpace: "nowrap"
                                }}
                            >
                                <TableRow>
                                    <TableCell>Invoice #</TableCell>
                                    <TableCell>Customer Name</TableCell>
                                    <TableCell>Mobile Number</TableCell>
                                    <TableCell>Items</TableCell>
                                    <TableCell>Total</TableCell>
                                    <TableCell>Payment Method</TableCell>
                                    <TableCell>Payment Status</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody sx={{ "& .MuiTableCell-root": { fontSize: "16px", whiteSpace: "nowrap",
                                    borderRight: "1px solid rgba(255, 255, 255, 0.1)", py: 1.5, textOverflow: "ellipsis",
                                    overflow: "hidden", maxWidth: 150                     
                                }
                            }}>
                                {filteredSales.length > 0 ? (
                                    filteredSales.map((item, index) => {
                                        // Parse items if it's a string
                                        const itemsList = typeof item.items === 'string' 
                                            ? JSON.parse(item.items || "[]") // converts string to array
                                            : (Array.isArray(item.items) ? item.items : []);

                                        return(
                                            <TableRow key={item._id ?? index} 
                                                sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                                                    "&:hover": { backgroundColor: "#e9f5fd" }, transition: "all 0.3s ease",
                                                }}
                                            >
                                                <TableCell>{generateInvoiceFromId(item._id)}</TableCell>
                                                <TableCell>{item.customer}</TableCell>
                                                <TableCell>{item.mobile}</TableCell>
                                                <TableCell>
                                                    <span style={{fontSize: "small", color: "#878787"}}>Items ({itemsList.length})</span><br />
                                                    {itemsList.map((i, idx2) => (
                                                        <span key={idx2}>
                                                            {i.product}&nbsp;
                                                            <Typography component={"span"} sx={{fontSize: "small"}}>(x{i.quantity})</Typography>
                                                            {idx2 < itemsList.length ? ", " : ""}
                                                        </span>
                                                    ))}
                                                </TableCell>
                                                <TableCell>
                                                    ₹ {itemsList.reduce((sum, i) => sum + i.quantity * i.unitprice, 0)}
                                                </TableCell>
                                                <TableCell>{item.paymentMethod}</TableCell>
                                                <TableCell>{item.paymentStatus}</TableCell>
                                                <TableCell>{item.date.split("T")[0]}</TableCell>
                                                <TableCell>
                                                    <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", gap: 1}}>
                                                        <Tooltip title={"Invoice"} component={Paper}
                                                             slotProps={{
                                                                tooltip: {
                                                                    sx:{ fontSize: "12px", px: 2, color: "#00ff44", background: "#00761f",
                                                                        letterSpacing: 1, fontWeight: 600
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            <IconButton 
                                                                sx={{ color:"#00761f", background: "fff", transition: "0.3s ease-in-out",
                                                                    "&:hover": { background: "#00761f", color:"#fff" }
                                                                }}
                                                                onClick={() => handleInvoiceOpen(item)}
                                                            >
                                                                <FaEye />
                                                            </IconButton>
                                                        </Tooltip>

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
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={10}>
                                            <Box sx={{ width: "100%", display: "flex", flexDirection: "column",
                                                    alignItems: "center", justifyContent: "center", py: 10, textAlign: "center",
                                                    color: "#64748B"
                                                }} 
                                            >
                                                {/* Icon */}
                                                <PaymentsIcon sx={{ fontSize: 100, color: "#cbd5e1", mb: 2 }} />

                                                {/* Title */}
                                                <Typography sx={{ fontSize: "22px", fontWeight: 600, color: "#1e293b" }} >
                                                    No Sales Found
                                                </Typography>

                                                {/* Subtitle */}
                                                <Typography sx={{ mt: 1, fontSize: 14 }}>
                                                    there aren’t any sales added yet.
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
                        {filteredSales.map((item, index) => (
                            <Card key={item._id ?? index}
                                sx={{ borderRadius: 3, boxShadow: 2, display: "flex", flexDirection: "column" }}
                            >
                                {/* CONTENT */}
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                        <Typography fontWeight={600}> {item.customer} </Typography>

                                        <Typography color="text.secondary"> #{index + 1} </Typography>
                                    </Box>

                                    <Divider sx={{ my: 1 }} />

                                    <Typography variant="body2"><b>Mobile:</b> {item.mobile}</Typography>
                                    <Typography variant="body2"><b>Payment Method:</b> {item.paymentMethod}</Typography>
                                    <Typography variant="body2"><b>Payment Status:</b> {item.paymentStatus}</Typography>
                                    <Typography variant="body2"><b>Date:</b> {item.date.split("T")[0]}</Typography>
                                </CardContent>

                                {/* ACTIONS — ALWAYS AT BOTTOM */}
                                <Box sx={{ display: "flex", justifyContent: "center", gap: 1, p: 2, mt: "auto" }}>
                                    <Button
                                        sx={{ background: "#fff", color: "#ef4444", border: 1, whiteSpace: "nowrap" }}
                                        onClick={() => handleDelete(item)}
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
            </Box>

            {/* Invoice Dialog */}
            <Dialog open={invoiceOpen} onClose={() => setInvoiceOpen(false)}  maxWidth="md" fullWidth >
                <DialogTitle>  Invoice Preview </DialogTitle>

                <DialogContent dividers sx={{ p: 4 }} ref={invoiceRef}>
                    {invoiceData && (
                        <Box>
                            <Box sx={{display:"flex", justifyContent:"space-between", gap: 3,
                                flexDirection: {xs: "column", sm: "row"}
                            }}>
                                {/* Customer Details */}
                                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", borderRadius: 3, 
                                        p: 2, gap: 1, whiteSpace: "nowrap" 
                                    }} 
                                    component={Paper}
                                >
                                    <Typography component={"span"} sx={{ fontWeight: 600, fontSize: "18px"}}> 
                                        Customer Details:- 
                                    </Typography>
                                    <Box sx={{display: "flex", flexDirection: "column"}}>
                                        <Typography component={"span"} sx={{fontWeight: 600}}> Name: </Typography>
                                        <Typography component={"span"}> {invoiceData.customer} </Typography>
                                    </Box>
                                    <Box sx={{display: "flex", flexDirection: "column"}}>
                                        <Typography component={"span"} sx={{fontWeight: 600}}> Phone Number: </Typography>
                                        <Typography component={"span"}> {invoiceData.mobile} </Typography>
                                    </Box>
                                </Box>

                                {/* Sales Details */}
                                <Box sx={{ flex: 1, borderRadius: 3, p: 2, whiteSpace: "nowrap" }} component={Paper}>
                                    <Typography component={"span"} sx={{ fontWeight: 600, fontSize: "18px"}}> 
                                        Sales Details:- 
                                    </Typography>

                                    <Box sx={{display: "flex", flexDirection: "column" }}>
                                        <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                            <Typography component={"span"} sx={{fontWeight: 600}}> Invoice: </Typography>
                                            <Typography component={"span"}> {generateInvoiceFromId(invoiceData._id)} </Typography>
                                        </Box>

                                        <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                            <Typography component={"span"} sx={{fontWeight: 600}}> Payment Method: </Typography>
                                            <Typography component={"span"}> {invoiceData.paymentMethod} </Typography>
                                        </Box>

                                        <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                            <Typography component={"span"} sx={{fontWeight: 600}}> Payment Status: </Typography>
                                            <Typography component={"span"} display={"inline"}
                                                sx={{ background: invoiceData.paymentStatus === "Paid" ? "#22c55e" : "#f96216ff",
                                                    padding: "4px 10px", fontWeight: 600, borderRadius: "20px", fontSize: "13px",
                                                    color: "#fff", alignSelf: "start", letterSpacing: 1
                                                }}
                                            > 
                                                {invoiceData.paymentStatus} 
                                            </Typography>
                                        </Box>

                                        <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                            <Typography component={"span"} sx={{fontWeight: 600}}> Total Amount: </Typography>
                                            <Typography component={"span"} sx={{fontWeight: 600}}> 
                                                ₹ {
                                                    (typeof invoiceData.items === "string"
                                                        ? JSON.parse(invoiceData.items || "[]")
                                                        : invoiceData.items
                                                    ).reduce((sum, i) => sum + i.quantity * i.unitprice, 0)
                                                } 
                                            </Typography>
                                        </Box>

                                        <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                            <Typography component={"span"} sx={{fontWeight: 600}}> Date: </Typography>
                                            <Typography component={"span"}> {invoiceData.date.split("T")[0]} </Typography>
                                        </Box>
                                    </Box>
                                </Box>  
                            </Box>

                            <Box sx={{ borderRadius: 3, py: 1, px: 2, mt: 3, overflowX: "auto" }}>
                                {/* Safely parse items */}
                                {(() => {
                                    const invoiceItems =
                                        typeof invoiceData.items === "string"
                                            ? JSON.parse(invoiceData.items || "[]")
                                            : Array.isArray(invoiceData.items) ? invoiceData.items : [];

                                    return (
                                        <>
                                            <h3 style={{ marginBottom: 0 }}>
                                                Items ({invoiceItems ? invoiceItems.length : 0})
                                            </h3>
                                            <p style={{ marginTop: "5px", color: "#6b7280" }}>
                                                List of all sales items in this invoice
                                            </p>

                                            <Table sx={{mt: 1, minWidth: 650}}>
                                                <TableHead sx={{ background: "#f1f5f9" }}>
                                                    <TableRow>
                                                        <TableCell><strong>Product</strong></TableCell>
                                                        <TableCell><strong>Quantity</strong></TableCell>
                                                        <TableCell><strong>Unit Price</strong></TableCell>
                                                        <TableCell><strong>Total Price</strong></TableCell>
                                                    </TableRow>
                                                </TableHead>

                                                <TableBody>
                                                    {invoiceItems.map((it, idx) => (
                                                        <TableRow key={idx}>
                                                        <TableCell>{it.product}</TableCell>
                                                        <TableCell>{it.quantity}</TableCell>
                                                        <TableCell>₹ {it.unitprice}</TableCell>
                                                        <TableCell>
                                                            ₹ {it.quantity * it.unitprice}
                                                        </TableCell>
                                                        </TableRow>
                                                    ))}

                                                    {/* Total row */}
                                                    <TableRow>
                                                        <TableCell colSpan={3} align="right" sx={{ fontSize: "16px" }}>
                                                            <strong>Total:</strong>
                                                        </TableCell>
                                                        <TableCell sx={{ fontSize: "16px" }}>
                                                            <b>₹ {invoiceItems.reduce((sum, i) => sum + i.quantity * i.unitprice, 0)}</b>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </>
                                    );
                                })()}
                            </Box>

                            <p style={{ textAlign: "center", marginTop: "15px", color: "#555" }}>
                                Thank you for your business!
                            </p>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => dispatch(setInvoiceOpen(false))}> Close </Button>
                    <Button variant="contained" onClick={handleDownloadPDF}
                        sx={{background: "linear-gradient(135deg, #2563eb, #1e40af)",}}
                    >
                        Download PDF
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AddSales;
