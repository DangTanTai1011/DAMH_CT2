import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Home from "./components/pages/home/Home";
import ProductDetail from "./components/pages/home/ProductDetail";
import CartPage from "./components/pages/Cart/CartPage";
import OrderHistory from "./components/pages/home/OrderHistory";
import SearchResults from "./components/pages/home/SearchResults";

import Dashboard from "./components/pages/admin/Dashboard";
import BrandPage from "./components/pages/admin/Brand/BrandPage";
import CategoryPage from "./components/pages/admin/Category/CategoryPage";
import ProductPage from "./components/pages/admin/Product/ProductPage";
import ReviewPage from "./components/pages/admin/Review/ReviewPage";
import OrderPage from "./components/pages/admin/Order/OrderPage";
import UserPage from "./components/pages/admin/User/UserPage";
import OrderDetailManagement from "./components/pages/admin/OrderDetail/OrderDetailManagement";

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
        {role === "user" && <button onClick={() => navigate("/order-history")}>📝 Order History</button>}
      </div>
      <div>
        <button onClick={() => navigate("/cart")}>🛒 Cart</button>
        {role ? (
          <>
            <span style={{ margin: "0 10px", fontWeight: "bold" }}>👤 {username}</span>
            <button onClick={handleLogout}>🚪 Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")}>🔑 Login</button>
            <button onClick={() => navigate("/register")}>📝 Register</button>
          </>
        )}
      </div>
    </nav>
  );
};

const AppRoutes = ({ role }) => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/order-history" element={<OrderHistory />} />
      <Route path="/search-results" element={<SearchResults />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {role === "admin" ? (
        <Route path="/admin" element={<Dashboard />}>
          <Route path="brands" element={<BrandPage />} />
          <Route path="categories" element={<CategoryPage />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="reviews" element={<ReviewPage />} />
          <Route path="orders" element={<OrderPage />} />
          <Route path="users" element={<UserPage />} />
          <Route path="orderdetails" element={<OrderDetailManagement />} /> 
        </Route>
      ) : (
        <Route path="/admin/*" element={<Navigate to="/" />} /> 
      )}

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => {
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  return (
    <Router>
      <Navbar role={role} setRole={setRole} />
      <div style={{ minHeight: "100vh", paddingBottom: "50px" }}> 
        <AppRoutes role={role} />
      </div>
    </Router>
  );
};

export default App;
