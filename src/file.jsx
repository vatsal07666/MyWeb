import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemDraft,
  addSales,
  removeItemDraft,
  resetFormValues,
  resetUIState,
  setLoading,
  setOpenForm,
  setSales,
  setSearchItem,
} from "./SalesSlice";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { IoMdAdd, IoMdRefresh } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineViewInAr } from "react-icons/md";
import SearchIcon from "@mui/icons-material/Search";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useSnackbar } from "../../Context/SnackbarContext";
import { NavLink } from "react-router-dom/cjs/react-router-dom";

const AddSales = () => {
  const {
    list: sales = [],
    formValues,
    openForm,
    itemDraft,
    searchItem,
    loading,
  } = useSelector((state) => state.salesStore);
  const dispatch = useDispatch();
  const { ShowSnackbar } = useSnackbar();

  const methods = ["Cash", "Card", "Online"];
  const status = ["Paid", "Pending"];
  const token = "lwfog6Wx9g3tZrPp";

  const validationSchema = Yup.object({
    customer: Yup.string().required("Customer Name is Required*"),
    mobile: Yup.string()
      .typeError("Phone must be Number*")
      .matches(/^[0-9]{10}$/, "Phone Number must be exactly 10 digits*"),
    paymentMethod: Yup.string().required("Payment Method is required*"),
    paymentStatus: Yup.string().required("Payment Status is required*"),
    date: Yup.date()
      .required("Date is required*")
      .max(new Date(), "Date cannot be in the future*"),
  });

  // Fetch Sales Data
  const getData = () => {
    return axios
      .get("https://generateapi.techsnack.online/api/sales", {
        headers: { Authorization: token },
      })
      .then((res) => dispatch(setSales(res.data.Data)))
      .catch((err) => console.error("GET error: ", err));
  };

  useEffect(() => {
    getData();
  }, []);

  // Submit Sales
  const postData = (values) => {
    axios
      .post(
        "https://generateapi.techsnack.online/api/product",
        {
          customer: values.customer,
          mobile: values.mobile,
          items: itemDraft,
          paymentMethod: values.paymentMethod,
          paymentStatus: values.paymentStatus,
          date: values.date,
        },
        { headers: { Authorization: token } }
      )
      .then((res) => {
        if (res.status === 200 || res.status === 204) {
          dispatch(addSales(res.data.Data));
          ShowSnackbar("Product Added Successfully !", "success");
          handleRefresh();
        }
      })
      .catch((err) => console.error("POST error: ", err));
  };

  const handleSubmit = (values, { resetForm }) => {
    if (!itemDraft.length) {
      alert("Add at least one item");
      return;
    }
    postData(values);
    resetForm();
    dispatch(resetFormValues());
    dispatch(resetUIState());
  };

  const handleRefresh = () => {
    dispatch(setLoading(true));
    getData()
      .then(() => ShowSnackbar("Data Refreshed !", "info"))
      .finally(() => dispatch(setLoading(false)));
  };

  const handleCancel = (resetForm) => {
    resetForm();
    dispatch(resetFormValues());
    dispatch(resetUIState());
  };

  const handleAddItem = (values, { setFieldValue }) => {
    if (!values.product || !values.quantity || !values.unitprice) {
      alert("Enter all item fields");
      return;
    }

    dispatch(
      addItemDraft({
        product: values.product,
        quantity: Number(values.quantity),
        unitprice: Number(values.unitprice),
        total: Number(values.quantity) * Number(values.unitprice),
      })
    );

    setFieldValue("product", "");
    setFieldValue("quantity", "");
    setFieldValue("unitprice", "");
  };

  const handleDeleteItem = (index) => {
    dispatch(removeItemDraft(index));
  };

  const itemsSubtotal = itemDraft.reduce(
    (sum, i) => sum + i.quantity * i.unitprice,
    0
  );

  return (
    <Box component={Paper} sx={{ p: 3, borderRadius: 2 }}>
      {/* Heading & Add Product Button */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
        }}
      >
        <Box>
          <h1>Sales ({sales.length})</h1>
          <Typography variant="span" sx={{ color: "#888888", fontSize: "15px" }}>
            List of all sales in your inventory
          </Typography>
        </Box>

        <Button
          onClick={() => dispatch(setOpenForm(true))}
          sx={{
            background: "linear-gradient(135deg, #2563eb, #1e40af)",
            color: "#fff",
            p: "8px 14px",
            borderRadius: 2,
            mt: { xs: 2, sm: 0 },
            textTransform: "none",
          }}
          startIcon={<IoMdAdd />}
        >
          Add Sales
        </Button>
      </Box>

      {/* Sales Form Dialog */}
      <Dialog open={openForm} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add New Sales</DialogTitle>
        <Divider />
        <DialogContent sx={{ mt: 1 }}>
          <Formik
            initialValues={formValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ errors, touched, values, setFieldValue, resetForm, isValid, dirty }) => (
              <Form>
                {/* Items Section */}
                <Box component={Paper} sx={{ p: 3, mb: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <h3 style={{ margin: 0 }}>Sales Items</h3>
                    <Button
                      variant="contained"
                      onClick={() => handleAddItem(values, { setFieldValue })}
                      sx={{
                        background: "linear-gradient(135deg, #2563eb, #1e40af)",
                        color: "#fff",
                        fontSize: "14px",
                        fontWeight: 600,
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                  <Divider sx={{ my: 2 }} />

                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Unit Price</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* New Item Input Row */}
                      <TableRow>
                        <TableCell>
                          <Field name="product" placeholder="Product" />
                        </TableCell>
                        <TableCell>
                          <Field name="quantity" type="number" placeholder="Qty" />
                        </TableCell>
                        <TableCell>
                          <Field name="unitprice" type="number" placeholder="Price" />
                        </TableCell>
                        <TableCell>{(values.quantity || 0) * (values.unitprice || 0)}</TableCell>
                        <TableCell>
                          <IconButton disabled>
                            <RiDeleteBin6Line />
                          </IconButton>
                        </TableCell>
                      </TableRow>

                      {/* List Draft Items */}
                      {itemDraft.map((i, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{i.product}</TableCell>
                          <TableCell>{i.quantity}</TableCell>
                          <TableCell>{i.unitprice}</TableCell>
                          <TableCell>{i.total}</TableCell>
                          <TableCell>
                            <Tooltip title="Delete">
                              <IconButton color="error" onClick={() => handleDeleteItem(idx)}>
                                <RiDeleteBin6Line />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}

                      {/* Subtotal */}
                      <TableRow>
                        <TableCell colSpan={3} align="right">
                          <strong>Subtotal:</strong>
                        </TableCell>
                        <TableCell>
                          <b>₹ {itemsSubtotal}</b>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>

                {/* Customer Info */}
                <Box sx={{ display: "flex", gap: 3, mb: 3, flexDirection: { xs: "column", sm: "row" } }}>
                  <Box sx={{ flex: 1 }}>
                    <label>Customer Name</label>
                    <Field name="customer" placeholder="Customer Name" />
                    {errors.customer && touched.customer && (
                      <div style={{ color: "#ff0000" }}>{errors.customer}</div>
                    )}
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <label>Mobile</label>
                    <Field
                      name="mobile"
                      type="number"
                      placeholder="Mobile Number"
                      onKeyDown={(e) => ["e", "+", "-"].includes(e.key) && e.preventDefault()}
                    />
                    {errors.mobile && touched.mobile && (
                      <div style={{ color: "#ff0000" }}>{errors.mobile}</div>
                    )}
                  </Box>
                </Box>

                {/* Payment & Date */}
                <Box sx={{ display: "flex", gap: 3, mb: 3, flexDirection: { xs: "column", sm: "row" } }}>
                  <Box sx={{ flex: 1 }}>
                    <label>Payment Method</label>
                    <Field name="paymentMethod" as="select">
                      <option value="" hidden>Select Method</option>
                      {methods.map((m) => <option key={m} value={m}>{m}</option>)}
                    </Field>
                    <ErrorMessage name="paymentMethod" component="small" style={{ color: "#ff0000" }} />
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <label>Payment Status</label>
                    <Field name="paymentStatus" as="select">
                      <option value="" hidden>Select Status</option>
                      {status.map((s) => <option key={s} value={s}>{s}</option>)}
                    </Field>
                    <ErrorMessage name="paymentStatus" component="small" style={{ color: "#ff0000" }} />
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <label>Date</label>
                    <Field name="date" type="date" />
                    <ErrorMessage name="date" component="small" style={{ color: "#ff0000" }} />
                  </Box>
                </Box>

                {/* Cancel & Submit */}
                <DialogActions>
                  <Button onClick={() => handleCancel(resetForm)}>Cancel</Button>
                  <Button type="submit" variant="contained" disabled={!isValid || !dirty}>
                    Submit
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      {/* Sales Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice #</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.length ? (
              sales.map((s, idx) => (
                <TableRow key={s._id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{s.customer}</TableCell>
                  <TableCell>{s.mobile}</TableCell>
                  <TableCell>
                    {s.items.map((i, idx2) => (
                      <div key={idx2}>
                        {i.product} (Qty: {i.quantity})
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    ₹ {s.items.reduce((sum, i) => sum + i.quantity * i.unitprice, 0)}
                  </TableCell>
                  <TableCell>{s.paymentMethod}</TableCell>
                  <TableCell>{s.paymentStatus}</TableCell>
                  <TableCell>{s.date.split("T")[0]}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No Sales Data Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AddSales;


// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     list: [],
//     formValues: {
//         customer: '',
//         items: [],
//         subTotal: '',
//         paymentMethod: '',
//         paymentStatus: ''
//     },
//     editId: null,
//     openForm: false,
//     deleteOpen: false, // Delete confirmation dialog
//     deleteId: null, // delete Id
//     searchItem: '',    // search field
//     loading: false,
// }

// export const SalesSlice = createSlice({
//     name: "sales",
//     initialState,
//     reducers: {
//         setSales: (state, action) => {
//             state.list = action.payload;
//         },
//         addSales: (state, actions) => {
//             state.list.push(actions.payload);
//         },
//         deleteSales: (state, action) => {
//             state.list = state.list.filter((p) => p._id !== action.payload);
//         },
//         updateSales: (state, action) => {
//             const index = state.list.findIndex(p => p._id === action.payload._id);
//             if (index !== -1) state.list[index] = action.payload;
//         },

//         // Form State
//         setFormValues: (state, action) => {
//             state.formValues = action.payload;
//         },
//         resetFormValues: (state) => {
//             state.formValues = initialState.formValues;
//         },
//         setEditId: (state, action) => {
//             state.editId = action.payload;
//         },

//         // Item management inside formValues.items
//         addItemToForm: (state, action) => {
//             // action.payload = { product, quantity, unitprice, total }
//             state.formValues.items.push(action.payload);
//         },
//         updateItemInForm: (state, action) => {
//             // action.payload = { index, item }
//             const { index, item } = action.payload;
//             if (index >= 0 && index < state.formValues.items.length) {
//                 state.formValues.items[index] = item;
//             }
//         },
//         removeItemFromForm: (state, action) => {
//             const index = action.payload;
//             if (index >= 0 && index < state.formValues.items.length) {
//                 state.formValues.items.splice(index, 1);
//             }
//         },
//         clearFormItems: (state) => {
//             state.formValues.items = [];
//         },

//         resetUIState: (state) => {
//             state.openForm = false;
//             state.editId = null;
//             state.formValues.items = [];
//         },

//         // Dialogs
//         setOpenForm: (state, action) => {
//             state.openForm = action.payload;
//         },
//         setDeleteOpen: (state, action) => {
//             state.deleteOpen = action.payload;
//         },
//         setDeleteId: (state, action) => {
//             state.deleteId = action.payload;
//         },
//         resetDeleteState: (state) => {
//             state.deleteOpen = false;
//             state.deleteId = null;
//         },

//         // Search
//         setSearchItem: (state, action) => {
//             state.searchItem = action.payload;
//         },

//         // Loading
//         setLoading: (state, action) => {
//             state.loading = action.payload;
//         },
//     }
// })

// export const { setSales, addSales, deleteSales, updateSales, setFormValues, setEditId, setOpenForm, 
//     setDeleteOpen, setDeleteId, setSearchItem, setLoading, resetDeleteState, resetUIState, resetFormValues,
//     addItemToForm, updateItemInForm, removeItemFromForm, clearFormItems
// } = SalesSlice.actions;
// export default SalesSlice.reducer;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Grid,
//   MenuItem,
//   Select,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Typography,
//   Paper,
//   Chip,
// } from "@mui/material";

// const API = "http://localhost:5000/api/sales";

// const products = [
//   { id: 1, name: "Laptop", price: 50000 },
//   { id: 2, name: "Mouse", price: 500 },
//   { id: 3, name: "Keyboard", price: 1500 },
// ];

// const Sales = () => {
//   const [sales, setSales] = useState([]);
//   const [open, setOpen] = useState(false);

//   const [customerName, setCustomerName] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState("");
//   const [quantity, setQuantity] = useState(1);
//   const [items, setItems] = useState([]);
//   const [paymentStatus, setPaymentStatus] = useState("Paid");

//   // Fetch sales
//   useEffect(() => {
//     axios.get(API).then((res) => {
//       setSales(res.data);
//     });
//   }, []);

//   // Add item
//   const handleAddItem = () => {
//     const product = products.find((p) => p.id === selectedProduct);
//     if (!product) return;

//     const newItem = {
//       productName: product.name,
//       quantity,
//       price: product.price,
//       total: product.price * quantity,
//     };

//     setItems([...items, newItem]);
//     setSelectedProduct("");
//     setQuantity(1);
//   };

//   // Remove item
//   const handleRemoveItem = (index) => {
//     const updated = [...items];
//     updated.splice(index, 1);
//     setItems(updated);
//   };

//   const grandTotal = items.reduce((acc, item) => acc + item.total, 0);

//   // Save sale
//   const handleSaveSale = () => {
//     const newSale = {
//       invoiceNumber: `INV-${Date.now()}`,
//       customerName,
//       items,
//       subtotal: grandTotal,
//       tax: 0,
//       discount: 0,
//       grandTotal,
//       paymentMethod: "Cash",
//       paymentStatus,
//     };

//     axios.post(API, newSale).then(() => {
//       axios.get(API).then((res) => {
//         setSales(res.data);
//       });

//       setOpen(false);
//       setCustomerName("");
//       setItems([]);
//     });
//   };

//   return (
//     <Box p={3}>
//       <Typography variant="h5" mb={2}>
//         Sales Management
//       </Typography>

//       <Button variant="contained" onClick={() => setOpen(true)}>
//         Create Sale
//       </Button>

//       {/* Sales Table */}
//       <TableContainer component={Paper} sx={{ mt: 3 }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Invoice</TableCell>
//               <TableCell>Customer</TableCell>
//               <TableCell>Total</TableCell>
//               <TableCell>Status</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {sales.map((sale) => (
//               <TableRow key={sale._id}>
//                 <TableCell>{sale.invoiceNumber}</TableCell>
//                 <TableCell>{sale.customerName}</TableCell>
//                 <TableCell>₹{sale.grandTotal}</TableCell>
//                 <TableCell>
//                   <Chip
//                     label={sale.paymentStatus}
//                     color={
//                       sale.paymentStatus === "Paid"
//                         ? "success"
//                         : "warning"
//                     }
//                   />
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Dialog */}
//       <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
//         <DialogTitle>Create Sale</DialogTitle>
//         <DialogContent>

//           <TextField
//             fullWidth
//             label="Customer Name"
//             value={customerName}
//             onChange={(e) => setCustomerName(e.target.value)}
//             sx={{ mb: 2 }}
//           />

//           <Grid container spacing={2}>
//             <Grid item xs={6}>
//               <Select
//                 fullWidth
//                 value={selectedProduct}
//                 displayEmpty
//                 onChange={(e) => setSelectedProduct(e.target.value)}
//               >
//                 <MenuItem value="">Select Product</MenuItem>
//                 {products.map((product) => (
//                   <MenuItem key={product.id} value={product.id}>
//                     {product.name} - ₹{product.price}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </Grid>

//             <Grid item xs={3}>
//               <TextField
//                 type="number"
//                 fullWidth
//                 label="Quantity"
//                 value={quantity}
//                 onChange={(e) => setQuantity(Number(e.target.value))}
//               />
//             </Grid>

//             <Grid item xs={3}>
//               <Button
//                 variant="contained"
//                 fullWidth
//                 sx={{ height: "100%" }}
//                 onClick={handleAddItem}
//               >
//                 Add
//               </Button>
//             </Grid>
//           </Grid>

//           {/* Items Table */}
//           {items.length > 0 && (
//             <TableContainer component={Paper} sx={{ mt: 2 }}>
//               <Table size="small">
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Product</TableCell>
//                     <TableCell>Qty</TableCell>
//                     <TableCell>Total</TableCell>
//                     <TableCell>Action</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {items.map((item, index) => (
//                     <TableRow key={index}>
//                       <TableCell>{item.productName}</TableCell>
//                       <TableCell>{item.quantity}</TableCell>
//                       <TableCell>₹{item.total}</TableCell>
//                       <TableCell>
//                         <Button
//                           color="error"
//                           onClick={() => handleRemoveItem(index)}
//                         >
//                           Remove
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           )}

//           <Typography mt={2}>
//             Grand Total: ₹{grandTotal}
//           </Typography>

//           <Select
//             fullWidth
//             value={paymentStatus}
//             onChange={(e) => setPaymentStatus(e.target.value)}
//             sx={{ mt: 2 }}
//           >
//             <MenuItem value="Paid">Paid</MenuItem>
//             <MenuItem value="Pending">Pending</MenuItem>
//           </Select>

//         </DialogContent>

//         <DialogActions>
//           <Button onClick={() => setOpen(false)}>Cancel</Button>
//           <Button variant="contained" onClick={handleSaveSale}>
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Sales;


// import * as React from 'react';
// import { styled, useTheme } from '@mui/material/styles';
// import { Box, Button, Drawer, Tooltip } from '@mui/material';
// import MuiDrawer from '@mui/material/Drawer';
// import MuiAppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import List from '@mui/material/List';
// import CssBaseline from '@mui/material/CssBaseline';
// import Typography from '@mui/material/Typography';
// import Divider from '@mui/material/Divider';
// import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';
// import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import { Link } from "react-router-dom";
// import { useHistory, useLocation } from 'react-router-dom';
// import { FaBoxes } from "react-icons/fa";
// import { MdCategory } from "react-icons/md";
// import { TbLayoutDashboardFilled } from "react-icons/tb";
// import { useState } from 'react';
// import { useEffect } from 'react';
// import { useSnackbar } from '../../Login_&_Register/SnackbarContext';
// import { useContext } from 'react';
// import { DataContext } from '../../Context/ContextProvider';
// import useMediaQuery from "@mui/material/useMediaQuery";

// const drawerWidth = 240;

// const openedMixin = (theme) => ({
//     width: drawerWidth,
//     transition: theme.transitions.create('width', {
//         easing: theme.transitions.easing.sharp,
//         duration: theme.transitions.duration.enteringScreen,
//     }),
//     overflowX: 'hidden',
// });

// const closedMixin = (theme) => ({
//     transition: theme.transitions.create('width', {
//         easing: theme.transitions.easing.sharp,
//         duration: theme.transitions.duration.leavingScreen,
//     }),
//     overflowX: 'hidden',
//     width: `calc(${theme.spacing(7)} + 1px)`,
//     [theme.breakpoints.up('sm')]: {
//         width: `calc(${theme.spacing(8)} + 1px)`,
//     },
// });

// const DrawerHeader = styled('div')(({ theme }) => ({
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//     padding: theme.spacing(0, 1),
//     // necessary for content to be below app bar
//     ...theme.mixins.toolbar,
// }));

// const AppBar = styled(MuiAppBar, {
//         shouldForwardProp: (prop) => prop !== 'open',
//     })(({ theme, open }) => ({
//         zIndex: theme.zIndex.drawer + 1,
//         transition: theme.transitions.create(['width', 'margin'], {
//             easing: theme.transitions.easing.sharp,
//             duration: theme.transitions.duration.leavingScreen,
//         }),
//     ...(open && {
//         marginLeft: drawerWidth,
//         width: `calc(100% - ${drawerWidth}px)`,
//         transition: theme.transitions.create(['width', 'margin'], {
//             easing: theme.transitions.easing.sharp,
//             duration: theme.transitions.duration.enteringScreen,
//         }),
//     }),

// }));

// const DesktopDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open'})(
//     ({ theme, open }) => ({
//         width: drawerWidth,
//         flexShrink: 0,
//         whiteSpace: 'nowrap',
//         boxSizing: 'border-box',
//         ...(open && {
//             ...openedMixin(theme),
//             '& .MuiDrawer-paper': openedMixin(theme),
//         }),
//         ...(!open && {
//             ...closedMixin(theme),
//             '& .MuiDrawer-paper': closedMixin(theme),
//         }),
//     }),
// );

// const Items = [
//     { name: "Dashboard", icon: <TbLayoutDashboardFilled />, label: "Dashboard", to: "/admin" },
//     { name: "Product", icon: <FaBoxes />, label: "Add Product", to: "/admin/product" },
//     { name: "Category", icon: <MdCategory />, label: "Add Category", to: "/admin/category" },
// ]

// export default function Index({children}) {
//     const theme = useTheme();
//     const [open, setOpen] = useState(false);
//     const [isLoggedIn, setIsLoggedIn] = React.useState(false);
//     const { ShowSnackbar } = useSnackbar();
//     const history = useHistory();
//     const { setIsDrawerOpen } = useContext(DataContext);
//     const isMobile = useMediaQuery(theme.breakpoints.down("md"));
//     const location = useLocation();

//     const handleDrawerOpen = () => {
//         setOpen(prev => !prev);
//         setIsDrawerOpen(true);
//     };

//     const handleDrawerClose = () => {
//         setOpen(false);
//         setIsDrawerOpen(false)
//     };

//     // ROLE CHECK
//     useEffect(() => {
//         const token = localStorage.getItem("authToken");
//         const role = localStorage.getItem("role");

//         if (!token || role !== "admin") {
//             history.replace(role === "user" ? "/" : "/log-in");
//         } else {
//             setIsLoggedIn(true);
//         }
//     }, [history]);

//     useEffect(() => {
//         if (isMobile && open) {
//             setOpen(false);
//             setIsDrawerOpen(false);
//         }
//     }, [location.pathname, isMobile, open, setIsDrawerOpen]); // route change only


//     const handleLogout = () => {
//         localStorage.removeItem("authToken");
//         localStorage.removeItem("role");
//         setIsLoggedIn(false);
//         history.push("/log-in");
//         ShowSnackbar("Logged Out successful !", "success");
//     };

//     if (!isLoggedIn) return null; // Prevent rendering before role check

//     const DrawerContent = (
//         <>
//             <DrawerHeader>
//                 <IconButton onClick={handleDrawerClose}>
//                     {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
//                 </IconButton>
//             </DrawerHeader>
//             <Divider />
//             {Items.map((menu) => (
//                 <List key={menu.name}>
//                     <ListItem disablePadding sx={{ display: 'block' }}>
//                         <Tooltip title={menu.name} placement="right"
//                             slotProps={{
//                                 tooltip: { sx: {background: "#1e293b", color: "#fff", letterSpacing: 2}}
//                             }}
//                         >
//                             <ListItemButton component={Link} to={menu.to}>
//                                 <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', fontSize: "23px",
//                                         mr: open ? 3 : 'auto',
//                                     }}
//                                 >
//                                     {menu.icon}
//                                 </ListItemIcon>
//                                 <ListItemText primary={menu.name}
//                                     sx={{ opacity: open ? 1 : 0 }}
//                                 />
//                             </ListItemButton>
//                         </Tooltip>
//                     </ListItem>
//                 </List>
//             ))}
//         </>
//     )

//     return (
//         <Box sx={{ display: 'flex' }}>
//             <CssBaseline />
//             <AppBar position="fixed" open={!isMobile && open} sx={{background: "#1e293b"}}>
//                 <Toolbar>
//                     <IconButton color="inherit" aria-label="open drawer"
//                         onClick={handleDrawerOpen} edge="start"
//                         sx={{ mr: 2, display: { md: open ? "none" : "inline-flex" } }}
//                     >
//                         <MenuIcon />
//                     </IconButton>

//                     <Box sx={{width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
//                         <Typography variant="h6" noWrap component="div">
//                             Dashboard
//                         </Typography>
//                         <Button sx={{color: "#fff", border: 1, px: 2, py: 0.6, 
//                                 boxShadow: "0 0 10px rgba(255, 255, 255, 0.7)",
//                                 transition: "0.3s ease-in-out", textTransform: "none",
//                                 '&:hover': { background: "#fff", color: "#252729", border: 0, 
//                                     boxShadow: "0 0 10px rgba(255, 255, 255, 0.7)", fontWeight: 700
//                                 }, fontSize: {xs: "13px", sm: "15px"}
//                             }}
//                             onClick={() => { isLoggedIn ? handleLogout() : history.push("/log-in") }}
//                         >
//                             {isLoggedIn ? "Log out" : "Log in"}
//                         </Button>
//                     </Box>
//                 </Toolbar>
//             </AppBar>

//             {/* Desktop Drawer */}
//             {!isMobile && (
//                 <DesktopDrawer variant="permanent" open={open}>
//                     {DrawerContent}
//                 </DesktopDrawer>
//             )}

//             {/* Mobile Drawer */}
//             {isMobile && (
//                 <Drawer variant="temporary" open={open} onClose={handleDrawerClose}
//                     ModalProps={{ keepMounted: true }}
//                     sx={{ '& .MuiDrawer-paper': { width: drawerWidth, height: '100vh' } }}
//                 >
//                     {DrawerContent}
//                 </Drawer>
//             )}

//             <Box component="main" 
//                 sx={{ minHeight: "100vh", flexGrow: 1, p: { xs: 2, sm: 3 }, mt: 8, transition: 'margin 0.3s',
//                     background: "#f5f7fa"
//                 }}
//             >
//                 {children}
//             </Box>
//         </Box>
//     );
// }

// import './App.css';
// import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// import LoginPage from "./Login_&_Register/LoginPage";
// import RegisterPage from "./Login_&_Register/RegisterPage";
// import AddProduct from './Product/AddProduct';
// import Index from './IndexFile/Index';
// import Dashboard from './Dashboard/Dashboard';
// import AddCategory from './Category/Add Category';

// function App() {
//     return (
//         <>
//             <Router>
//                 <Switch>
//                     <Route exact path="/log-in" component={LoginPage} />
//                     <Route exact path="/register" component={RegisterPage} />

//                     <Route>
//                         <Index>
//                             <Switch>
//                                 <Route exact path="/" component={Dashboard} />
//                                 <Route exact path="/product" component={AddProduct} />
//                                 <Route exact path="/category" component={AddCategory} />
//                             </Switch>
//                         </Index>
//                     </Route>
//                 </Switch>
//             </Router>
//         </>
//     )
// }

// export default App;


// import React from 'react'
// import Layout from './UserPanel/Layout';
// import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// import HomePage from './UserPanel/HomePage'; 
// import ProductPage from "./UserPanel/ProductPage";
// import CategoryPage from './UserPanel/CategoryPage';
// import "./App.css";
// import ProductsByCategory from './UserPanel/ProductsByCategory';
// import LoginPage from "./Login_&_Register/LoginPage";
// import RegisterPage from "./Login_&_Register/RegisterPage";

// const App = () => {
//     return (
//         <>
//             <Router>
//                 <Switch>
//                     <Route exact path={"/log-in"} component={LoginPage} />
//                     <Route exact path={"/register"} component={RegisterPage} />
                    
//                     <Route>
//                         <Layout>
//                             <Route exact path={"/"} component={HomePage} />
//                             <Route exact path={"/product"} component={ProductPage} />
//                             <Route exact path={"/category"} component={CategoryPage} />
//                             <Route exact path={"/products/:categoryId"} component={ProductsByCategory} />
//                         </Layout>
//                     </Route>
//                 </Switch>
//             </Router>
//         </>
//     )
// }

// export default App



// import React from "react";
// import { Route, Redirect } from "react-router-dom";

// // role: "admin" or "user" or null
// // example usage: <PrivateRoute path="/admin" component={AdminDashboard} role="admin" />

// const PrivateRoute = ({ component: Component, role, ...rest }) => {
//     const userRole = localStorage.getItem("role"); // get role from localStorage
//     const token = localStorage.getItem("authToken"); // check if logged in

//     return (
//         <Route
//             {...rest}
//             render={(props) =>
//                 token && userRole ? (
//                     role ? (
//                         userRole === role ? (
//                             <Component {...props} />
//                         ) : (
//                             <Redirect to={userRole === "admin" ? "/admin" : "/"} />
//                         )
//                     ) : (
//                         <Component {...props} />
//                     )
//                 ) : (
//                     <Redirect to="/log-in" />
//                 )
//             }
//         />
//     );
// };

// export default PrivateRoute;



import { Button, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Box, useMediaQuery, useTheme } from "@mui/system";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import { useSnackbar } from "./SnackbarContext";
import { useHistory } from "react-router-dom";

const RegisterPage = () => {
    const history = useHistory();
    const { ShowSnackbar } = useSnackbar();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); 

    const initialValues = {username: '', email: '', password: ''};

    const validationSchema = Yup.object({
        username: Yup.string().required("Enter Username*"),
        email: Yup.string().email("Invalid Email*").required("Enter Email*"),
        password: Yup.string().required("Enter Password*")
    })

    const token = "5wI8xsf3DqDSmYTX";

    // const getData = () => {
    //     axios.get("https://generateapi.techsnack.online/api/register", {
    //         headers: { Authorization: token }
    //     })
    //     .then((res) => {
    //         console.log("/* Register Data */");
    //         console.log("GET response: ", res.data);
    //     })
    //     .catch((err) => {
    //         console.error("GET error: ", err);
    //     })
    // }

    const postData = (values) => {
        const data = {username: values.username, email: values.email, password: values.password}

        axios.post("https://generateapi.techsnack.online/api/register", data, {
            headers: { Authorization: token, "Content-Type": "application/json" }
        })
        .then((res) => {
            console.log("/* Register Data */");
            console.log("POST response: ", res.status);
            if(res.status === 200 || res.status === 204){
                // Auto-login after registration
                const role = values.username === "admin" ? "admin" : "user"; // demo role
                localStorage.setItem("authToken", "dummy-token"); // or real token if API provides
                localStorage.setItem("role", role);

                ShowSnackbar("Account Created Successfully!", "success");

                // Redirect based on role
                if (role === "admin") history.push("/admin");
                else history.push("/");
            }
        })
        .catch((err) => {
            console.error("POST error: ", err);
            ShowSnackbar("Registration Failed !", "error");
        })
    }

    const handleSubmit = (values, { resetForm }) => {
        postData(values);
        resetForm();
    }

    return(
        <Box className="register-container"  sx={{ px: {xs: 4.5, md: 0}}}>
            <Paper elevation={10} sx={{ width: "100%", maxWidth: 320, p: { xs: 2.5, md: 4 }, borderRadius: 3 }}>
                <Typography variant={isMobile ? "h5" : "h4"} align="center" fontWeight={700}>
                    Register
                </Typography>

                <Formik initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({errors, touched}) => (
                        <>
                            <Form className="register-box">
                                <label htmlFor="username">Username</label>
                                <Field name="username" id="username" placeholder="Enter Username" />
                                {errors.username && touched.username && <div style={{color: "#ff0000", marginTop: "5px"}}>{errors.username}</div>}
                                <br /><br />

                                <label htmlFor="email">Email</label>
                                <Field name="email" id="email" type="email" placeholder="Enter Email" />
                                {errors.email && touched.email && <div style={{color: "#ff0000", marginTop: "5px"}}>{errors.email}</div>}
                                <br /><br />

                                <label htmlFor="password">Password</label>
                                <Field name="password" id="password" type="password" placeholder="Enter Password" />
                                {errors.password && touched.password && <div style={{color: "#ff0000", marginTop: "5px"}}>{errors.password}</div>}
                                <br /><br />

                                <Button type="submit" fullWidth size="large" variant="contained" sx={{
                                        mt: 3, py: 1.3, background: "#1e293b", "&:hover": { background: "#0f172a" }
                                    }}
                                >
                                    Create Account
                                </Button>
                                
                                <Box sx={{ mt: 3, display:"flex", justifyContent: "center", 
                                        alignItems: "center", gap: 1, flexWrap: "wrap"
                                    }}
                                >
                                    <Typography variant="body2">
                                        Already have an account?
                                    </Typography>

                                    <Link to="/log-in" className="router-link"> Log In </Link>
                                </Box>
                            </Form>
                        </>
                    )}
                </Formik>
            </Paper>
        </Box>
    )
}   

export default RegisterPage;