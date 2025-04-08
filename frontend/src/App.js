import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Home from "./components/pages/home/Home";
import Dashboard from "./components/pages/admin/Dashboard";
import BrandPage from "./components/pages/admin/Brand/BrandPage";
import CategoryPage from "./components/pages/admin/Category/CategoryPage";
import ProductPage from "./components/pages/admin/Product/ProductPage";
import ProductDetail from "./components/pages/home/ProductDetail";
import ReviewPage from "./components/pages/admin/Review/ReviewPage";
import CartPage from "./components/pages/Cart/CartPage";
import OrderManagement from "./components/pages/admin/Order/OrderManagement";  
import OrderHistory from "./components/pages/home/OrderHistory";  
import SearchResults from "./components/pages/home/SearchResults";
import UserPage from "./components/pages/admin/User/UserPage";
import OrderDetailManagement from "./components/pages/admin/OrderDetail/OrderDetailManagement"; 

import Footer from "./components/Footer"; 

const Navbar = ({ role, setRole }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        setUsername(storedUsername || "");
    }, [role]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        setRole("");
        navigate("/login");
    };

    return (
        <nav style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "#ddd", alignItems: "center" }}>
            <div>
                <button onClick={() => navigate("/")}>🏠 Home</button>
                {role === "admin" && <button onClick={() => navigate("/admin")}>🔧 Admin</button>}
                {role === "user" && <button onClick={() => navigate("/order-history")}>📝 Lịch sử đơn hàng</button>}
            </div>
            <div>
                <button onClick={() => navigate("/cart")}>🛒 Giỏ hàng</button>
                {role ? (
                    <>
                        <span style={{ margin: "0 10px", fontWeight: "bold" }}>👤 {username}</span>
                        <button onClick={handleLogout}>🚪 Đăng Xuất</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => navigate("/login")}>🔑 Đăng Nhập</button>
                        <button onClick={() => navigate("/register")}>📝 Đăng Ký</button>
                    </>
                )}
            </div>
        </nav>
    );
};

const App = () => {
    const [role, setRole] = useState(localStorage.getItem("role") || "");
    const [cartItems, setCartItems] = useState(() => {
        return JSON.parse(localStorage.getItem("cart")) || [];
    });

    useEffect(() => {
        const handleStorageChange = () => setRole(localStorage.getItem("role") || "");
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem("cart");
    };

    return (
        <Router>
            <Navbar role={role} setRole={setRole} />
            <div style={{ minHeight: "100vh", paddingBottom: "50px" }}> 
                <Routes>
                    <Route path="/login" element={<Login setRole={setRole} />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/" element={<Home />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<CartPage cartItems={cartItems} clearCart={clearCart} />} />
                    <Route path="/order-history" element={<OrderHistory />} />
                    <Route path="/search" element={<SearchResults />} />
                    
                    {role === "admin" ? (
                        <Route path="/admin" element={<Dashboard />}>
                            <Route path="brands" element={<BrandPage />} />
                            <Route path="categories" element={<CategoryPage />} />
                            <Route path="products" element={<ProductPage />} />
                            <Route path="reviews" element={<ReviewPage />} />
                            <Route path="orders" element={<OrderManagement />} />
                            <Route path="users" element={<UserPage />} />
                            <Route path="orderdetails" element={<OrderDetailManagement />} />
                       
                        </Route>
                    ) : (
                        <Route path="/admin/*" element={<Navigate to="/" />} />
                    )}

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
            <Footer />
        </Router>
    );
};

export default App;
