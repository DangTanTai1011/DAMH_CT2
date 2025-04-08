import axios from "axios";

const API_URL = "http://localhost:5000/api/orderdetails";

export const getOrderDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Không có token");

    const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }, 
    });

    return response.data;
};

export const deleteOrderDetail = async (orderDetailId) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Không có token");

    const response = await axios.delete(`${API_URL}/${orderDetailId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
};

export const updateOrderDetail = async (orderDetailId, updatedData) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Không có token");

    const response = await axios.put(
        `${API_URL}/${orderDetailId}`,
        updatedData,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );

    return response.data;
};
