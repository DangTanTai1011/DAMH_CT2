import React, { useEffect, useState } from "react";
import { getOrderDetails, deleteOrderDetail, updateOrderDetail } from "../../../services/orderDetailService";
import "../OrderDetail/OrderDetailManagement.css";
const OrderDetailManagement = () => {
    const [orderDetails, setOrderDetails] = useState([]);
    const [message, setMessage] = useState("");
    const [editingOrderDetail, setEditingOrderDetail] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await getOrderDetails();
                if (Array.isArray(response) && response.length > 0) {
                    setOrderDetails(response);
                } else {
                    setMessage("Không có dữ liệu chi tiết đơn hàng");
                }
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết đơn hàng", error);
                setMessage("Lỗi khi lấy chi tiết đơn hàng");
            }
        };
        fetchOrderDetails();
    }, []);

    const handleDeleteOrderDetail = async (orderDetailId) => {
        try {
            const response = await deleteOrderDetail(orderDetailId);
            setMessage(response.message);
            setOrderDetails(orderDetails.filter(detail => detail._id !== orderDetailId));
        } catch (error) {
            setMessage("Lỗi khi xóa chi tiết đơn hàng");
        }
    };

    const handleUpdateOrderDetail = async (orderDetailId, updatedData) => {
        if (!orderDetailId) {
            setMessage("Không có ID chi tiết đơn hàng để cập nhật");
            return;
        }
        try {
            const response = await updateOrderDetail(orderDetailId, updatedData);
            setMessage("Cập nhật thông tin đơn hàng thành công");
            setOrderDetails(orderDetails.map(detail => detail._id === orderDetailId ? response.data : detail));
            setEditingOrderDetail(null);
        } catch (error) {
            setMessage("Lỗi khi cập nhật chi tiết đơn hàng");
        }
    };

    return (
        <div className="order-detail-container">
            <h2>Quản lý chi tiết đơn hàng</h2>
            {message && <p>{message}</p>}
            <table className="order-detail-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Số điện thoại</th>
                        <th>Địa chỉ</th>
                        <th>Ghi chú</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {orderDetails.length > 0 ? (
                        orderDetails.map((detail) => (
                            <tr key={detail?._id}>
                                <td>{detail?._id}</td>
                                <td>{detail?.fullName}</td>
                                <td>{detail?.phone}</td>
                                <td>{detail?.address}</td>
                                <td>{detail?.note}</td>
                                <td>
                                    <button onClick={() => setEditingOrderDetail(detail)}>Sửa</button>
                                    <button onClick={() => handleDeleteOrderDetail(detail._id)}>Xóa</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">Không có dữ liệu để hiển thị</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {editingOrderDetail && (
                <div>
                    <h3>Sửa thông tin chi tiết đơn hàng</h3>
                    <input 
                        type="text" 
                        placeholder="Tên" 
                        value={editingOrderDetail.fullName} 
                        onChange={(e) => setEditingOrderDetail({ ...editingOrderDetail, fullName: e.target.value })} 
                    />
                    <input 
                        type="text" 
                        placeholder="Số điện thoại" 
                        value={editingOrderDetail.phone} 
                        onChange={(e) => setEditingOrderDetail({ ...editingOrderDetail, phone: e.target.value })} 
                    />
                    <input 
                        type="text" 
                        placeholder="Địa chỉ" 
                        value={editingOrderDetail.address} 
                        onChange={(e) => setEditingOrderDetail({ ...editingOrderDetail, address: e.target.value })}
                    />
                    <textarea 
                        placeholder="Ghi chú" 
                        value={editingOrderDetail.note} 
                        onChange={(e) => setEditingOrderDetail({ ...editingOrderDetail, note: e.target.value })}
                    ></textarea>
                    <button 
                        onClick={() => handleUpdateOrderDetail(editingOrderDetail._id, editingOrderDetail)}
                    >
                        Lưu thay đổi
                    </button>
                    <button onClick={() => setEditingOrderDetail(null)}>Hủy</button>
                </div>
            )}
        </div>
    );
};

export default OrderDetailManagement;
