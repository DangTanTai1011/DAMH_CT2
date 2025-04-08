import React from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import "./css/Dashboard.css"; 

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div className="admin-dashboard d-flex">
      <aside className="sidebar">
        <h2 className="sidebar-title">Quản Trị Admin</h2>
        <ul className="sidebar-menu">
          <li><Link to="/admin/brands">📦 Thương Hiệu</Link></li>
          <li><Link to="/admin/categories">📂 Loại Giày</Link></li>
          <li><Link to="/admin/products">🛒 Danh Sách Sản Phẩm</Link></li>
          <li><Link to="/admin/reviews">⭐ Danh Sách Đánh Giá</Link></li>
          <li><Link to="/admin/orders">📑 Danh Sách Đặt Hàng</Link></li>
          <li><Link to="/admin/users">👤 Quản Lý Tài Khoản</Link></li> 
          <li><Link to="/admin/orderdetails">📋 Quản Lý Chi Tiết Đơn Hàng</Link></li> 
        </ul>
        <button className="logout-btn" onClick={handleLogout}>🚪 Đăng Xuất</button>
      </aside>

      <main className="dashboard-content">
        <Outlet /> 
      </main>
    </div>
  );
};

export default Dashboard;
