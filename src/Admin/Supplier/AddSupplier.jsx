import React, { useEffect } from 'react'
import * as Yup from 'yup';
import { Box, Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, 
    Divider, IconButton, InputBase, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Tooltip, Typography, useMediaQuery, useTheme
} from '@mui/material'
import { IoMdAdd, IoMdRefresh } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from '../../Context/SnackbarContext'
import { Field, Form, Formik } from 'formik'
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaEdit } from 'react-icons/fa';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import { addSupplier, deleteSupplier, resetDeleteState, resetFormValues, resetUIState, setDeleteId, 
    setDeleteOpen, setEditId, setFormValues, setLoading, setOpenForm, setSearchItem, setSupplier, 
    updateSupplier 
} from './SupplierSlice';
import { NavLink } from 'react-router-dom/cjs/react-router-dom';
import { MdOutlineViewInAr } from 'react-icons/md';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const AddSupplier = () => {
    const { list: suppliers = [], formValues, editId, openForm, deleteOpen, deleteId, searchItem, 
        loading } = useSelector((state) => state.supplierStore);
    const dispatch = useDispatch();
    const { ShowSnackbar } = useSnackbar();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const validationSchema = Yup.object({
        supplierName: Yup.string().required("Supplier Name is Required*"),
        contactPerson: Yup.string().required("Contact Person is Required*"),
        email: Yup.string().email("Invalid Email*").required("Email is Required*"),
        phone: Yup.string().typeError("Phone must be Number*")
                .matches(/^[0-9]{10}$/, "Phone Number must be exactly 10 digits*"),
        address: Yup.string().required("Address is Required*")
    })

    const token = "6jA4ILnp672uVwAw";

    // Get Method
    const getData = () => {
        return axios.get("https://generateapi.techsnack.online/api/supplier", {
            headers: { Authorization: token }
        })
        .then((res) => {
            console.log("GET response: ", res.data);
            dispatch(setSupplier(res.data.Data));
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
        const val = { supplierName: values.supplierName, contactPerson: values.contactPerson, 
            email: values.email, phone: Number(values.phone), address: values.address
        }

        axios.post("https://generateapi.techsnack.online/api/supplier", val, {
            headers: { Authorization: token, "Content-Type": "application/json" }
        })
        .then((res) => {
            console.log("POST response: ", res.data);
            if(res.status === 200 || res.status === 204){
                dispatch(addSupplier(res.data.Data));
                ShowSnackbar("Supplier Added Successfully !", "success");
                handleRefresh();
            }
        })
        .catch((err) => {
            console.error("POST error: ", err);
        })
    }

    // Delete Method
    const deleteData = () => {
        axios.delete(`https://generateapi.techsnack.online/api/supplier/${deleteId}`, {
            headers: { Authorization: token }
        })
        .then((res) => {
            console.log("DELETE response: ", res.status);
            if(res.status === 200 || res.status === 204){
                dispatch(deleteSupplier(deleteId));
                dispatch(resetDeleteState());
                ShowSnackbar("Supplier Deleted Successfully !", "error");
            }
        })
        .catch((err) => {
            console.log("DELETE error: ", err);
        })
    }

    // Patch Method
    const patchData = (id, values) => {
        axios.patch(`https://generateapi.techsnack.online/api/supplier/${id}`, values, {
            headers: { Authorization: token, "Content-Type": "application/json" }
        })
        .then((res) => {
            console.log("PATCH response: ", res.data);
            if(res.status === 200 || res.status === 204){
                dispatch(updateSupplier(res.data.Data));
                ShowSnackbar("Supplier Updated Successfully !", "success");
                handleRefresh();
            }
        })
        .catch((err) => {
            console.error("PATCH response: ", err);
        })
    }

    const handleSubmit = (values, {resetForm, setFieldError}) => {
        const newSupplier = values.supplierName?.toLowerCase();

        const isDuplicate = (suppliers || []).some((p) => p.supplierName?.toLowerCase() === newSupplier);

        if(isDuplicate && editId === null){
            setFieldError("supplierName", "Supplier with same Name is already exists.");
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
    }

    // Referesh Data
    const handleRefresh = () => {
        dispatch(setLoading(true));
        getData().then((res) => {
            if(res.status === 200 || res.status === 204){
                ShowSnackbar("Data Refreshed !", "info");
            } else {
                ShowSnackbar("No Data Found !", "error");
            }
        }).finally(() => {
            dispatch(setLoading(false));
        })
    }

    const handleCancel = (resetForm) => {
        resetForm();
        dispatch(resetFormValues());
        dispatch(resetUIState());
    };

    const handleEdit = (item) => {
        dispatch(setOpenForm(true));
        dispatch(setEditId(item._id));
        dispatch(setFormValues({
            supplierName: item.supplierName, contactPerson: item.contactPerson, email: item.email, 
            phone: Number(item.phone), address: item.address
        }));
    }

    const handleDelete = (item) => {
        dispatch(setDeleteOpen(true));
        dispatch(setDeleteId(item._id));
    }

    /* ---------------- Search ---------------- */
    const filteredSupplier = suppliers.filter(
        s => (s.supplierName ?? '').toLowerCase().includes((searchItem ?? '').toLowerCase())
    );

    return (
        <>
            <Box component={Paper} sx={{p:3, borderRadius: 2 }}>
                {/* Heading, Refresh Button & Add Product Button */}
                <Box sx={{display: "flex", flexDirection: {xs: "column", sm: "row"}, justifyContent: "space-between", 
                        alignItems: {xs: "flex-start", sm: "center"}
                    }}
                >
                    <Box>
                        <h1>Suppliers ({suppliers.length})</h1>
                        <Typography variant='span' sx={{color: "#888888", fontSize: "15px"}}>
                            Manage your supplier relationships and contact information
                        </Typography>
                    </Box>
                    
                    <Button onClick={() => dispatch(setOpenForm(true))} 
                        sx={{background: "linear-gradient(135deg, #2563eb, #1e40af)", color: "#fff", 
                            p: "8px 14px", borderRadius: 2, mt: {xs: 2, sm: 0}, whiteSpace: "nowrap", 
                            textTransform: "none"
                        }}
                        startIcon={<IoMdAdd />}
                    >
                        Add Supplier
                    </Button>
                </Box>

                {/* Supplier Form */}
                <Dialog open={openForm} sx={{ zIndex: 2000 }} maxWidth="md" fullWidth disableRestoreFocus
                    slotProps={{
                        backdrop: { sx: { backgroundColor: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" } }
                    }}
                >
                    <DialogTitle sx={{ fontWeight: 700 }}>
                        {editId !== null ? "Edit Supplier" : "Add New Supplier"}
                    </DialogTitle>

                    <Divider />
                
                    <DialogContent sx={{ mt: 1 }}>
                        <Formik initialValues={formValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                            enableReinitialize
                        >
                            {({errors, touched, isValid, dirty, resetForm}) => (
                                <Form>
                                    {/* Supplier Name & Contact Person */}
                                    <Box sx={{ display: "flex", flexDirection: {xs: "column", sm: "row"}, gap: 3, mb: 3 }}>
                                        <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                            <label htmlFor="supplierName">Supplier Name</label>
                                            <Field name="supplierName" id="supplierName" placeholder="Enter Supplier Name" />
                                            {errors.supplierName && touched.supplierName && <div style={{color: "#ff0000"}}>{errors.supplierName}</div>}
                                        </Box>

                                        <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                            <label htmlFor="contactPerson">Contact Person</label>
                                            <Field name="contactPerson" id="contactPerson" placeholder="Enter Contact Person" />
                                            {errors.contactPerson && touched.contactPerson && <div style={{color: "#ff0000"}}>{errors.contactPerson}</div>}
                                        </Box>
                                    </Box>

                                    {/* Email & Phone Number & Address */}
                                    <Box sx={{ display: "flex", flexDirection: {xs: "column", sm: "row"}, gap: 3, mb: 1 }}>
                                        <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                            <label htmlFor="email">Email</label>
                                            <Field name="email" id= "email" type="email" placeholder="Enter Email" />
                                            {errors.email && touched.email && <div style={{color: "#ff0000"}}>{errors.email}</div>}
                                        </Box>

                                        <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                            <label htmlFor="phone">Phone Number</label>
                                            <Field name="phone" id="phone" type="number" placeholder="Enter Phone Number" 
                                                onKeyDown={(e) => {if (["e", "+", "-"].includes(e.key)) e.preventDefault();}}
                                            />
                                            {errors.phone && touched.phone && <div style={{color: "#ff0000"}}>{errors.phone}</div>}
                                        </Box>
                                    </Box>

                                    {/* Address */}
                                    <Box sx={{mt: 3}}>
                                        <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}} >
                                            <label htmlFor="address">Address</label>
                                            <Field name="address" id="address" as="textarea" placeholder="Write a Address of Supplier" />
                                            {errors.address && touched.address && <div style={{color: "#ff0000"}}>{errors.address}</div>}
                                        </Box>
                                    </Box>

                                    {/* Cancle & Submit Button */}
                                    <DialogActions>
                                        <Button onClick={() => handleCancel(resetForm)} sx={{ color: "#1e293b" }}>
                                            Cancel
                                        </Button>
                                        
                                        <Button type="submit" variant="contained"                
                                            sx={{ background: "#1e293b", "&:hover": { background: "#0f172a" } }}
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
                    <Box sx={{mr: {xs: 0, sm: 2}}}>
                        <Tooltip title="View Suppliers" component={Paper} placement="top"
                            slotProps={{
                                tooltip: {
                                    sx: { background: "#065fed", color: "#fff", letterSpacing: 2, 
                                        fontWeight: 600
                                    }
                                }
                            }}
                        >
                            <IconButton component={NavLink} to="/admin/viewSuppliers" 
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
                        <InputBase name="search" placeholder="Search Supplier" value={searchItem ?? ""}
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

                {/* Supplier Table */}
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
                                    {["#", "Supplier Name", "Contact Person", "Email", "Phone", "Address", "Actions"]
                                        .map((h) => (
                                            <TableCell key={h} sx={{ color: "#fff", textAlign: "center" }}>
                                                {h}
                                            </TableCell>
                                        ))}
                                </TableRow>
                            </TableHead>

                            <TableBody sx={{ "& .MuiTableCell-root": { fontSize: "16px",
                                    borderRight: "1px solid rgba(255, 255, 255, 0.1)", py: 1.5                      
                                }
                            }}>
                                {filteredSupplier.length > 0 ? (
                                    filteredSupplier.map((item, index) => (
                                        <TableRow key={item._id ?? index}
                                            sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                                                "&:hover": { backgroundColor: "#e9f5fd" }, transition: "all 0.3s ease",
                                                "& .MuiTableCell-root": { maxWidth: 250, whiteSpace: "nowrap",
                                                    textOverflow: "ellipsis", overflow: "hidden"
                                                }
                                            }}
                                        >
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item.supplierName}</TableCell>
                                            <TableCell>{item.contactPerson}</TableCell>
                                            <TableCell>{item.email}</TableCell>
                                            <TableCell>{item.phone}</TableCell>
                                            <TableCell>{item.address}</TableCell>
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
                                        <TableCell colSpan={7}>
                                            <Box sx={{ width: "100%", display: "flex", flexDirection: "column",
                                                    alignItems: "center", justifyContent: "center", py: 10, textAlign: "center",
                                                    color: "#64748B"
                                                }} 
                                            >
                                                {/* Icon */}
                                                <LocalShippingIcon sx={{ fontSize: 100, color: "#cbd5e1", mb: 2 }} />

                                                {/* Title */}
                                                <Typography sx={{ fontSize: "22px", fontWeight: 600, color: "#1e293b" }} >
                                                    No Suppliers Found
                                                </Typography>

                                                {/* Subtitle */}
                                                <Typography sx={{ mt: 1, fontSize: 14 }}>
                                                    there aren’t any Supplier added yet.
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
                        {filteredSupplier.map((item, index) => (
                            <Card key={item._id ?? index}
                                sx={{ borderRadius: 3, boxShadow: 2, display: "flex", flexDirection: "column" }}
                            >
                                {/* CONTENT */}
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                        <Typography fontWeight={600}> {item.supplierName} </Typography>

                                        <Typography color="text.secondary"> #{index + 1} </Typography>
                                    </Box>

                                    <Divider sx={{ my: 1 }} />

                                    <Typography variant="body2"><b>Contact Person:</b> {item.contactPerson}</Typography>
                                    <Typography variant="body2"><b>email:</b> {item.email}</Typography>
                                    <Typography variant="body2"><b>phone:</b> {item.phone}</Typography>
                                    <Typography variant="body2"><b>address:</b> {item.address}</Typography>
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

export default AddSupplier
