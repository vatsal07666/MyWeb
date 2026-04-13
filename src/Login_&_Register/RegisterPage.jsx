import { Button, IconButton, Paper, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import { useSnackbar } from "../Context/SnackbarContext";
import { useHistory } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { DataContext } from "../Context/ContextProvider";
import { useContext } from "react";

const RegisterPage = () => {
    const {showPassword, setShowPassword} = useContext(DataContext);
    const history = useHistory();
    const { ShowSnackbar } = useSnackbar();

    const initialValues = { username: '', email: '', password: '' };

    const validationSchema = Yup.object({
        username: Yup.string().required("Enter Username*"),
        email: Yup.string().email("Invalid Email*").required("Enter Email*"),
        password: Yup.string().required("Password is required*").min(8,"Password must be at least 8 characters")
                .matches(/[A-Z]/, "Password must contain at least one uppercase character")
                .matches(/[a-z]/, "Password must contain at least one lowercase character")
                .matches(/\d/, "Password must contain at least one number")
                .matches(/[!@#$%^&*()]/, "Password must contain at least one special character")
    })

    const token = "maySLQ51e12jy2Q3";

    const postData = (values, resetForm) => {
        const data = {username: values.username, email: values.email, password: values.password}

        // Get existing users from localStorage
        const users = JSON.parse(localStorage.getItem("users")) || [];
        
        // Check if username already exists
        const userExists = users.some((u) => u.email === values.email);

        if (userExists) {
            ShowSnackbar("Email already exists!", "error");
            return;
        }

        axios.post("https://generateapi.techsnack.online/api/login", data, {
            headers: { Authorization: token, "Content-Type": "application/json" }
        })
        .then((res) => {
            if(res.status === 200 || res.status === 204){
                console.log("/* Register Data */");
                console.log("POST response: ", res.data);
                
                // Add new user
                users.push({ ...values, role: "user" });
                localStorage.setItem("users", JSON.stringify(users));

                resetForm();
                history.push("/log-in");
                ShowSnackbar("Account Created Successfully !", "success");
            }
        })
        .catch((err) => {
            console.error("POST error: ", err);
            ShowSnackbar("Registration failed !", "error");
        })
    }

    const handleSubmit = (values, { resetForm }) => {
        postData(values, resetForm);
    }

    return(
        <Box className="register-container" sx={{ px: {xs: 4.5, md: 0} }}>
            <Paper elevation={10} sx={{ width: "100%", maxWidth: 300, p: { xs: 2.5, md: 4 }, borderRadius: 3, 
                background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(10px)", padding: "40px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}>
                <Typography variant="h5" align="center" fontWeight={700}>
                    Register
                </Typography>

                <Formik initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched }) => (
                        <>
                            <Form className="register-box">
                                <label htmlFor="username">Username</label>
                                <Field name="username" id="username" placeholder="Enter Username" />
                                {errors.username && touched.username && <div style={{color: "#ff0000", marginTop: "5px"}}>{errors.username}</div>}
                                <br /><br />

                                <label htmlFor="auth-email">Email</label>
                                <Field name="email" id="auth-email" type="email" placeholder="Enter Email" />
                                {errors.email && touched.email && <div style={{color: "#ff0000", marginTop: "5px"}}>{errors.email}</div>}
                                <br /><br />

                                <Box sx={{ position: "relative", borderRadius: 5 }}>
                                    <label htmlFor="password">Password </label>
                                    <Field name="password" id="password" type={showPassword ? "text" : "password"}
                                        placeholder="Enter Password"
                                    />
    
                                    <IconButton className="show-hide-button" type="button" 
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                                    </IconButton>
                                </Box>
                                {errors.password && touched.password && <div style={{color: "#ff0000", marginTop: "5px"}}>{errors.password}</div>}
                                <br />

                                <Button type="submit" fullWidth size="large" variant="contained" 
                                    className="register-button"
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

