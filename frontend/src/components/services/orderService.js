import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";

export const createOrder = async (orderData) => {
    const token = localStorage.getItem("token");
    if (!token) return console.error("❌ Không có token");

    try {
        const res = await axios.post(API_URL, orderData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return res.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const createOrderWithDetails = async (orderData) => {
    const token = localStorage.getItem("token");
    if (!token) return console.error("❌ Không có token");

    try {
        const res = await axios.post(`${API_URL}/with-details`, orderData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return res.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getUserOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("❌ Không có token");
        return [];
    }

    try {
        const res = await axios.get(`${API_URL}/my`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res.data;
    } catch (error) {
        console.error("Lỗi khi lấy đơn hàng của người dùng", error);
        throw error.response?.data || error.message;
    }
};

export const getAllOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) return [];

    const res = await axios.get(`${API_URL}/all`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    return res.data;
};

export const updateOrderStatus = async (orderId, status) => {
    const token = localStorage.getItem("token");
    if (!token) return console.error("❌ Không có token");

    try {
        const res = await axios.put(
            `${API_URL}/update-status`,
            { orderId, status },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái đơn hàng", error);
        throw error.response?.data || error.message;
    }
};

export const deleteOrder = async (orderId) => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("❌ Không có token");
        return;
    }

    try {
        const res = await axios.delete(`${API_URL}/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (res.status === 200) {
            console.log("Đã xóa đơn hàng thành công:", res.data);
            return res.data; 
        } else {
            throw new Error("Lỗi khi xóa đơn hàng");
        }
    } catch (error) {
        console.error("Lỗi khi xóa đơn hàng", error);
        throw error.response?.data || error.message;
    }
};

