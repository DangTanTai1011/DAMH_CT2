import React, { useEffect, useState } from "react";
import axios from "axios";
import { updateOrderStatus, deleteOrder } from "../../../services/orderService";
import "../Order/OrderManagement.css";

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/orders/all", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setOrders(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy đơn hàng", error);
                setMessage("Lỗi khi lấy đơn hàng");
            }
        };
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, status) => {
        try {
            const response = await updateOrderStatus(orderId, status);
            setMessage(response.message);
            setOrders(orders.map(order => (order._id === orderId ? { ...order, status } : order)));
        } catch (error) {
            setMessage("Lỗi khi cập nhật trạng thái đơn hàng");
        }
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            const response = await deleteOrder(orderId);
            setMessage(response.message);
            setOrders(orders.filter(order => order._id !== orderId));
        } catch (error) {
            setMessage("Lỗi khi xóa đơn hàng");
        }
    };

    return (
        <div className="order-container">
            <h2>Quản lý đơn hàng</h2>
            {message && <p className="order-message">{message}</p>}
            <table className="order-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Người dùng</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Cập nhật trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.userId.username}</td>
                            <td>{order.totalPrice} VND</td>
                            <td>{order.status}</td>
                            <td>
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                >
                                    <option value="Chờ xác nhận">Chờ xác nhận</option>
                                    <option value="Đang giao">Đang giao</option>
                                    <option value="Hoàn thành">Hoàn thành</option>
                                    <option value="Đã hủy">Đã hủy</option>
                                </select>
                            </td>
                            <td>
                                <button onClick={() => handleDeleteOrder(order._id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderManagement;
