import React, { useEffect, useState } from "react";
import { getUserOrders } from "../../services/orderService";
import "./css/OrderHistory.css"; 

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getUserOrders();
                setOrders(response);
            } catch (error) {
                console.error("Lỗi khi lấy lịch sử đơn hàng", error);
                setMessage("Lỗi khi lấy lịch sử đơn hàng");
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="order-history-container">
            <h2>Lịch sử đơn hàng của bạn</h2>
            {message && <p className="message">{message}</p>}
            {orders.length === 0 ? (
                <p>Không có đơn hàng nào.</p>
            ) : (
                <table className="order-history-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ngày tạo</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{new Date(order.createdAt).toLocaleString()}</td>
                                <td>{order.totalPrice.toLocaleString()} VND</td>
                                <td className={`order-status ${order.status.toLowerCase()}`}>
                                    {order.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default OrderHistory;
