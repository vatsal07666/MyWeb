import { Field, Form, Formik } from "formik";
import { Link } from "react-router-dom";
import { Box, Button, IconButton, Paper, Typography } from "@mui/material";
import axios from "axios";
import * as Yup from 'yup';
import { useSnackbar } from "../Context/SnackbarContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { DataContext } from "../Context/ContextProvider";
import { useContext, useRef } from "react";

const LoginPage = () => {
    const {showPassword, setShowPassword} = useContext(DataContext);
    const { ShowSnackbar } = useSnackbar();
    const history = useHistory();  
    const formikRef = useRef();  

    const initialValues = { email: '', password: '' };

    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid Email*").required("Enter Email*"),
        password: Yup.string().required("Password is required*").min(8,"Password must be at least 8 characters")
                .matches(/[A-Z]/, "Password must contain at least one uppercase character")
                .matches(/[a-z]/, "Password must contain at least one lowercase character")
                .matches(/\d/, "Password must contain at least one number")
                .matches(/[!@#$%^&*()]/, "Password must contain at least one special character")
    })

    const token = "maySLQ51e12jy2Q3";

    const getData = (values, resetForm) => {
        const initializeUser = () => {
            const localUsers = JSON.parse(localStorage.getItem("users")) || [];

            const adminExists = localUsers.some((u) => u.email === "admin@example.com");
            if (!adminExists) {
                localUsers.push({
                    username: "admin",
                    password: "Admin@666",
                    email: "admin@example.com",
                    role: "admin",
                });
            }
            
            const demoExists = localUsers.some((u) => u.email === "demo@example.com");
            if (!demoExists) {
                localUsers.push({
                    username: "DemoUser000",
                    password: "DEmo@#666",
                    email: "demo@example.com",
                    role: "user",
                });
            }
            
            localStorage.setItem("users", JSON.stringify(localUsers));
        };

        initializeUser();
        
        axios.get("https://generateapi.techsnack.online/api/login", {
            headers: {Authorization: token, "Content-Type": "application/json" }
        })
        .then((res) => {
            if(res.status === 200 || res.status === 201){
                // Get registered users from localStorage
                const users = res.data?.Data;
                const localUsers = JSON.parse(localStorage.getItem("users")) || [];
                const allUsers = [...localUsers, ...users]
                const user = allUsers.find(
                    (u) => u.email === values.email && u.password === values.password
                );
                
                if (user) {
                    // Successful login
                    localStorage.setItem("authToken", "demo-token"); // fake token
                    localStorage.setItem("role", user.role || "user");
                    ShowSnackbar("Login Successful !", "success");
                    resetForm();

                    // Redirect based on role
                    if (user.role === "admin") history.push("/admin");
                    else history.push("/");
                } else {
                    ShowSnackbar("Email or Password not Exists !", "info");
                }
            }
        })
        .catch((err) => {
            console.error("GET error: ", err);
            ShowSnackbar("Login Failed !", "error");
        })
    }

    const handleSubmit = (values, { resetForm }) => {
        getData(values, resetForm);
    }

    const fillForm = (email, password) => {
        if (!formikRef.current) return;

        formikRef.current.setFieldValue("email", email);
        formikRef.current.setFieldValue("password", password);
    };

    return(
        <Box className="login-container" sx={{ px: {xs: 4.5, md: 0} }}>
            <Paper elevation={10} sx={{ width: "100%", maxWidth: 300, borderRadius: 4, 
                    background: "rgba(255, 255, 255, 0.9)", border: "1px solid #e7ded9", 
                    padding: {xs: "10px", sm: "20px"}, boxShadow: "0 10px 30px rgba(78,52,46,0.08)"
                }}
            >
                <Typography variant="h5" align="center" fontWeight={700}>
                    Login
                </Typography>
            
                <Formik innerRef={formikRef}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched }) => (
                        <Form className="login-box">
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
                                className="login-button"
                            >
                                Log In
                            </Button>

                            <Box sx={{ mt: 3, display:"flex", justifyContent: "center", alignItems: "center", 
                                    gap: 1, flexWrap: "wrap"
                                }}
                            >
                                <Typography variant="body2">
                                    Don&apos;t have an account?
                                </Typography>
                                <Link to="/register" className="router-link"> Register </Link>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Paper>

            <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
                <Button variant="contained" onClick={() => fillForm("demo@example.com", "DEmo@#666")} 
                    sx={{ mt: 3, textTransform: "none", background: "#ffffff", color: "#000", 
                        borderRadius: 4 
                    }}
                >
                    User Account :- email: demo@example.com, Password: DEmo@#666
                </Button>

                <Button variant="contained" onClick={() => fillForm("admin@example.com", "Admin@666")} 
                    sx={{ mt: 3, textTransform: "none", background: "#ffffff", color: "#000", 
                        borderRadius: 4 
                    }}
                >
                    Admin Account :- email: admin@example.com, Password: Admin@666
                </Button>
            </Box>
        </Box>
    )
}

export default LoginPage

