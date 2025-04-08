import axios from "axios";

const API_URL = "http://localhost:5000/api/reviews";

export const getReviewsByProduct = (productId) => {
    return axios.get(`${API_URL}/product/${productId}`).then(res => res.data);
};

export const reviewProduct = async (productId, reviewData) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Chưa đăng nhập");

    const res = await axios.post(`${API_URL}/${productId}`, reviewData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const deleteReview = (reviewId) => {
    const token = localStorage.getItem("token");
    return axios.delete(`${API_URL}/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const updateReview = async (reviewId, updatedData) => {
    const token = localStorage.getItem("token");
    const res = await axios.put(`http://localhost:5000/api/reviews/${reviewId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};
