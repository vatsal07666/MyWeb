import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
// Login & Register
import LoginPage from "./Login_&_Register/LoginPage";
import RegisterPage from "./Login_&_Register/RegisterPage";

// Admin imports
import Index from './Admin/IndexFile/Index';
import Dashboard from './Admin/Dashboard/Dashboard';

import AddProduct from './Admin/Product/AddProduct';
import ViewProduct from "./Admin/Product/ViewProduct";

import AddCategory from './Admin/Category/AddCategory';
import ViewCategory from "./Admin/Category/ViewCategory";

import AddSupplier from "./Admin/Supplier/AddSupplier";
import ViewSupplier from "./Admin/Supplier/ViewSupplier";

import AddSales from "./Admin/Sales/AddSales";

// User imports
import Layout from './User/Layout/Layout';
import HomePage from './User/HomePage/HomePage'; 
import ProductPage from "./User/Product/ProductPage";
import CategoryPage from './User/Category/CategoryPage';
import ProductsByCategory from './User/Product/ProductsByCategory';
import AddToCart from "./User/Cart/AddToCart";

// PrivateRoute
import PrivateRoute from "./Login_&_Register/PrivateRoute";

const App = () => {
    return (
        <Router>
            <Switch>
                {/* Public Routes */}
                <Route exact path="/log-in" component={LoginPage} />
                <Route exact path="/register" component={RegisterPage} />

                {/* Admin Routes */}
                <Route path="/admin">
                    <Index>
                        <Switch>
                            <PrivateRoute exact path="/admin" component={Dashboard} role="admin" />

                            <PrivateRoute exact path="/admin/product" component={AddProduct} role="admin" />
                            <PrivateRoute exact path="/admin/viewProducts" component={ViewProduct} role="admin" />

                            <PrivateRoute exact path="/admin/category" component={AddCategory} role="admin" />
                            <PrivateRoute exact path="/admin/viewCategories" component={ViewCategory} role="admin" />

                            <PrivateRoute exact path="/admin/supplier" component={AddSupplier} role="admin" />
                            <PrivateRoute exact path="/admin/viewSuppliers" component={ViewSupplier} role="admin" />
                            
                            <PrivateRoute exact path="/admin/sales" component={AddSales} role="admin" />
                            <Redirect to="/admin" />
                        </Switch>
                    </Index>
                </Route>

                {/* User Routes */}
                <Route path="/">
                    <Layout>
                        <Switch>
                            <PrivateRoute exact path="/" component={HomePage} role="user" />
                            <PrivateRoute exact path="/user/product" component={ProductPage} role="user" />
                            <PrivateRoute exact path="/user/category" component={CategoryPage} role="user" />
                            <PrivateRoute exact path="/user/products/:categoryId" component={ProductsByCategory} role="user" />
                            <PrivateRoute exact path="/user/cart" component={AddToCart} role="user" />
                            <Redirect to="/" />
                        </Switch>
                    </Layout>
                </Route>

                {/* Redirect if role not matched */}
                <Route path="*">
                    <Redirect to="/log-in" />
                </Route>
            </Switch>
        </Router>
    );
};

export default App;
