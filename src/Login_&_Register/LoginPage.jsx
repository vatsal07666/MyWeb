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

    const initialValues = {username: '', password: ''};

    const validationSchema = Yup.object({
        username: Yup.string().required("Username is Required*"),
        password: Yup.string().required("Password is required*").min(8,"Password must be at least 8 characters")
                .matches(/[A-Z]/, "Password must contain at least one uppercase character")
                .matches(/[a-z]/, "Password must contain at least one lowercase character")
                .matches(/\d/, "Password must contain at least one number")
                .matches(/[!@#$%^&*()]/, "Password must contain at least one special character")
    })

    const token = "vZt3CGeByg2P1RDS";

    const postItem = (values, resetForm) => {
        const initializeUser = () => {
            const users = JSON.parse(localStorage.getItem("users")) || [];

            const adminExists = users.some((u) => u.username === "admin");
            if (!adminExists) {
                users.push({
                    username: "admin",
                    password: "Admin@666",
                    email: "admin@example.com",
                    role: "admin",
                });
            }
            
            const demoExists = users.some((u) => u.username === "DemoUser000");
            if (!demoExists) {
                users.push({
                    username: "DemoUser000",
                    password: "DEmo@#666",
                    email: "demo@example.com",
                    role: "user",
                });
            }
            
            localStorage.setItem("users", JSON.stringify(users));
        };

        initializeUser();
        
        const data = {username: values.username, password: values.password}

        axios.post("https://generateapi.techsnack.online/api/login", data, {
            headers: {Authorization: token, "Content-Type": "application/json" }
        })
        .then((res) => {
            if(res.status === 200 || res.status === 201){
                // Get registered users from localStorage
                const users = JSON.parse(localStorage.getItem("users")) || [];
                const user = users.find(
                    (u) => u.username === values.username && u.password === values.password
                );
                
                if (user) {
                    console.log("/* Login Data */");
                    console.log("POST response: ", res.data);
                    
                    // Successful login
                    localStorage.setItem("authToken", "demo-token"); // fake token
                    localStorage.setItem("role", user.role || "user");
                    ShowSnackbar("Login Successful !", "success");

                    resetForm();
                    // Redirect based on role
                    if (user.role === "admin") history.push("/admin");
                    else history.push("/");
                } else {
                    ShowSnackbar("Username or Password not Exists !", "info");
                }
            }
        })
        .catch((err) => {
            console.error("POST error: ", err);
            ShowSnackbar("Login Failed !", "error");
        })
    }

    const handleSubmit = (values, { resetForm }) => {
        postItem(values, resetForm);
    }

    const fillForm = (username, password) => formikRef.current.setValues({ username, password });

    return(
        <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
                flexDirection: "column", background: "radial-gradient(circle at top left, #1e3a8a, #0f172a)", 
                px: { xs: 2, sm: 0 }
            }}
        >
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
                    {({errors, touched}) => (
                        <Form className="login-box">
                            <label htmlFor="username">Username </label>
                            <Field name="username" id="login-username" placeholder="Enter Username" />
                            {errors.username && touched.username && <div style={{color: "#ff0000", marginTop: "5px"}}>{errors.username}</div>}
                            <br /><br />

                            <Box sx={{ position: "relative", borderRadius: 5 }}>
                                <label htmlFor="password">Password </label>
                                <Field name="password" id="login-password" type={showPassword ? "text" : "password"}
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

                            <Button type="submit" fullWidth size="large" variant="contained" className="login-button"
                                sx={{ mt: 3, borderRadius: "12px",  background: "linear-gradient(135deg, #2563eb, #1e40af)",
                                    p: "14px", fontWeight: 600, transition: "0.3s ease-in-out", 
                                    "&:hover": { transform: "translateY(-2px)", boxShadow: "0 10px 20px rgba(37, 99, 235, 0.3)" }
                                }}
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
                <Button variant="contained" onClick={() => fillForm("DemoUser000", "DEmo@#666")} 
                    sx={{ mt: 3, textTransform: "none", background: "#ffffff", color: "#000", 
                        borderRadius: 4 
                    }}
                >
                    User Account :- Username: DemoUser000, Password: DEmo@#666
                </Button>

                <Button variant="contained" onClick={() => fillForm("admin", "Admin@666")} 
                    sx={{ mt: 3, textTransform: "none", background: "#ffffff", color: "#000", 
                        borderRadius: 4 
                    }}
                >
                    Admin Account :- Username: admin, Password: Admin@666
                </Button>
            </Box>
        </Box>
    )
}

export default LoginPage