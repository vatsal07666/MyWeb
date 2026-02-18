import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, InputBase, Paper, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, useMediaQuery, 
    useTheme
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import { useEffect } from "react";
import { IoMdAdd } from "react-icons/io";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdRefresh } from "react-icons/io";
import { CircularProgress } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { FaEdit } from "react-icons/fa";
import { useSnackbar } from "../../Context/SnackbarContext";
import { useDispatch, useSelector } from "react-redux";
import { setCategory, addCategory, deleteCategory, updateCategory, setEditId, setFormValues, setLoading, 
    setOpenForm, setSearchItem, resetFormValues, resetUIState, resetDeleteState, setDeleteOpen, setDeleteId, 
} from "./CategorySlice";
import { NavLink } from "react-router-dom/cjs/react-router-dom";
import { MdOutlineViewInAr } from "react-icons/md";

const AddCategory = () => {
    const { list: categories = [], formValues, editId, openForm, deleteOpen, deleteId, searchItem, 
        loading } = useSelector((state) => state.categoryStore);
    const dispatch = useDispatch();
    const { ShowSnackbar } = useSnackbar();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const validationSchema = Yup.object({
        categoryName: Yup.string().required("Category Name is Required*"),
        status: Yup.string().required("Status is Required*"),
        description: Yup.string().required("description is required*"),
    })

    const status = ["Active", "Inactive"];

    const token = "y5japrtJDM9NkJjU";

    // Get Method
    const getData = () => {
        return axios.get("https://generateapi.techsnack.online/api/category", {
            headers: { Authorization: token }
        })
        .then((res) => {
            console.log("GET response: ", res.data);
            dispatch(setCategory(res.data.Data));
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
        let val = { categoryName: values.categoryName, description: values.description, status: values.status }

        axios.post("https://generateapi.techsnack.online/api/category", val, {
            headers: { Authorization: token, "Content-Type": "application/json" }
        })
        .then((res) => {
            console.log("POST response: ", res.data);
            if(res.status === 200 || res.status === 204){
                dispatch(addCategory(res.data.Data));
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
        axios.delete(`https://generateapi.techsnack.online/api/category/${deleteId}`, {
            headers: { Authorization: token }
        })
        .then((res) => {
            console.log("DELETE response: ", res.status);
            if(res.status === 200 || res.status === 204){
                dispatch(deleteCategory(deleteId));
                dispatch(resetDeleteState());
                ShowSnackbar("Category Deleted Successfully !", "error");
            }
        })
        .catch((err) => {
            console.error("DELETE error: ", err);
        })
    }

    // Patch Method
    const patchData = (id, values) => {
        axios.patch(`https://generateapi.techsnack.online/api/category/${id}`, values, {
            headers: { Authorization: token }
        })
        .then((res) => {
            console.log("PATCH response: ", res.data);
            if(res.status === 200 || res.status === 204){
                dispatch(updateCategory(res.data.Data));
                ShowSnackbar("Product Updated Successfully !", "success");
                handleRefresh();
            }
        })
        .catch((err) => {
            console.error("PATCH error: ", err);
        })
    }

    //  Submit Action
    const handleSubmit = (values, { resetForm, setFieldError }) => {
        const newCategory = values.categoryName?.toLowerCase();

        const isDuplicate = (categories || []).some((cat) => cat.categoryName?.toLowerCase() === newCategory);

        if(isDuplicate && editId === null){
            setFieldError("categoryName", "Category already exists");
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

    // Edit Action
    const handleEdit = (item) => {
        dispatch(setEditId(item._id));
        dispatch(setFormValues({ 
            categoryName: item.categoryName, description: item.description, status: item.status 
        }));
        dispatch(setOpenForm(true));
    }

    const handleCancel = (resetForm) => {
        resetForm();
        dispatch(resetFormValues());
        dispatch(resetUIState());
    };

    // Referesh Data
    const handleRefresh = () => {
        setLoading(true);
        getData().then(() => {
            ShowSnackbar("Data Refreshed !", "info");
        }).finally(() => {
            dispatch(setLoading(false));
        })
    }

    const handleDelete = (item) => {
        dispatch(setDeleteOpen(true));
        dispatch(setDeleteId(item._id));
    }

    /* ---------------- Search ---------------- */
    const filteredCategory = categories.filter(
        c => (c.categoryName ?? '').toLowerCase().includes((searchItem ?? '').toLowerCase())
    );

    return(
        <Box component={Paper} sx={{p:3, borderRadius: 2}}>
            {/* Heading & Add Category Button */}
            <Box sx={{display: "flex", flexDirection: {xs: "column", sm: "row"}, justifyContent: "space-between", 
                    alignItems: {xs: "flex-start", sm: "center"}
                }}
            >
                <Box>
                    <h1>Categories ({categories.length})</h1>
                    <Typography variant='span' sx={{color: "#888888", fontSize: "15px"}}>
                        Manage product categories and their descriptions
                    </Typography>
                </Box>

                <Button onClick={() => dispatch(setOpenForm(true))} 
                    sx={{background: "linear-gradient(135deg, #2563eb, #1e40af)", color: "#fff", 
                        p: "8px 14px", borderRadius: 2, mt: {xs: 2, sm: 0}, whiteSpace: "nowrap", 
                        textTransform: "none"
                    }}
                    startIcon={<IoMdAdd />}
                >
                    Add Category
                </Button>
            </Box>

            {/* Category Form */}
            <Dialog open={openForm} sx={{ zIndex: 2000 }} maxWidth="md" fullWidth disableRestoreFocus
                slotProps={{
                    backdrop: { sx: { backgroundColor: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" } }
                }}
            >
                <DialogTitle sx={{ fontWeight: 700 }} >
                    {editId !== null ? "Edit Category" : "Add New Category"}
                </DialogTitle>

                <Divider />

                <DialogContent sx={{ mt: 2 }}>
                    <Formik initialValues={formValues} 
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({errors, touched, isValid, dirty, resetForm}) => (
                            <Form>
                                {/* Category Name & Status */}
                                <Box sx={{display: "flex", flexDirection: {xs: "column", sm: "row"}, gap: 3, mb: 3}}>
                                    <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                        <label htmlFor="categoryName">Category Name</label>
                                        <Field name= "categoryName" id= "categoryName" placeholder="Enter Category" />
                                        {errors.categoryName && touched.categoryName && <div style={{color: "#ff0000"}}>{errors.categoryName}</div>}
                                    </Box>

                                    <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}}>
                                        <label htmlFor="status">Status</label>
                                        <Field name="status" id="status" as="select"  >
                                            <option value="" hidden>Select Status</option>
                                            {status.map((stat) => <option key={stat} value={stat}>{stat}</option>)}
                                        </Field>
                                        {errors.status && touched.status && <div style={{color: "#ff0000"}}>{errors.status}</div>}
                                    </Box>
                                </Box>

                                {/* Description */}
                                <Box sx={{mb: 1}}>
                                    <Box sx={{display: "flex", flexDirection: "column", gap: 1, flex: 1}} >
                                        <label htmlFor="description">Description</label>
                                        <Field name="description" id="description" as="textarea" placeholder="Write a Description of Category" />
                                        {errors.description && touched.description && <div style={{color: "#ff0000"}}>{errors.description}</div>}
                                    </Box>
                                </Box>

                                {/* Cancle & Submit Button */}
                                <DialogActions>
                                    <Button onClick={() => handleCancel(resetForm)} sx={{ color: "#1e293b" }}>
                                        Cancle
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
                <Box sx={{mr: {xs: 0, sm: 2}}}>
                    <Tooltip title="View Categories" placement="top"
                        slotProps={{
                            tooltip: {
                                sx: { background: "#065fed", color: "#fff", letterSpacing: 2, 
                                        fontWeight: 600
                                }
                            }
                        }}
                    >
                        <IconButton component={NavLink} to="/admin/viewCategories" 
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
                    <InputBase name="search" placeholder="Search Category" value={searchItem}
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

            {/* Category Table */}
            {!isMobile ? (
                <TableContainer component={Paper} elevation={0} 
                    sx={{ WebkitOverflowScrolling: 'touch', '&::-webkit-scrollbar': { height: '8px' },
                        '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1' },
                        '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: 4,
                            '&:hover': { backgroundColor: '#555' },
                        },
                    }}
                >
                    <Table sx={{ borderCollapse: "separate", borderSpacing: 0 }}>
                        <TableHead sx={{ background: "linear-gradient(135deg, #2563eb, #1e40af)", 
                                "& .MuiTableCell-head": { color: "#ffffff", fontWeight: 600, fontSize: "14px",
                                borderBottom: "none" }, whiteSpace: "nowrap"
                            }}
                        >
                            <TableRow>
                                {["#", "Category", "Description", "Status", "Actions"]
                                    .map((h) => (
                                        <TableCell key={h} sx={{ color: "#fff", textAlign: "center" }}>
                                            {h}
                                        </TableCell>
                                    ))}
                            </TableRow>
                        </TableHead>

                        <TableBody sx={{ "& .MuiTableCell-root": { fontSize: "16px", whiteSpace: "nowrap",
                                borderRight: "1px solid rgba(255, 255, 255, 0.1)", py: 1.5, textOverflow: "ellipsis",
                                overflow: "hidden", maxWidth: 300
                            }
                        }}>
                            {filteredCategory.length > 0 ? (
                                filteredCategory.map((item, index) => (
                                    <TableRow key={item._id ?? index}
                                        sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                                            "&:hover": { backgroundColor: "#e8f5ff" }, transition: "all 0.3s ease"
                                        }}
                                    >
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{item.categoryName}</TableCell>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell style={{textAlign: "center"}}>
                                            <span style={{ background: item.status === "Active" ? "#4caf50" : "#f44336",
                                                    padding: "4px 10px", borderRadius: "20px", fontSize: "13px", color: "#fff"
                                                }}
                                            >
                                                {item.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", gap: 1}}>
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
                                                <Dialog open={deleteOpen} onClose={() => dispatch(resetDeleteState())}
                                                    disableRestoreFocus 
                                                    slotProps={{
                                                        backdrop: {
                                                            sx: { backgroundColor: "rgba(0,0,0,0.35)",
                                                                backdropFilter: "blur(4px)"
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <DialogTitle id="alert-dialog-title"> Confirm Delete By Clicking Delete ! </DialogTitle>

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
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} style={{textAlign: "center"}}>No Category Data Found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2}}>
                    {filteredCategory.map((item, index) => (
                        <Card key={item._id ?? index}
                            sx={{ borderRadius: 3, boxShadow: 2, display: "flex", flexDirection: "column" }}
                        >
                            {/* CONTENT */}
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography fontWeight={600}> {item.categoryName} </Typography>
                                    <Typography color="text.secondary"> #{index + 1} </Typography>
                                </Box>

                                <Divider sx={{ my: 1 }} />

                                <Typography variant="body2"><b>Description:</b> {item.description}</Typography>
                                <Typography variant="body2" sx={{mt: 1}}>
                                    <b>Status:&nbsp;</b> 
                                    <span style={{ background: item.status === "Active" ? "#4caf50" : "#f44336",
                                            padding: "4px 10px", borderRadius: "20px", fontSize: "13px", color: "#fff"
                                        }}
                                    >
                                        {item.status}
                                    </span>
                                </Typography>
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
    )
}

export default AddCategory;