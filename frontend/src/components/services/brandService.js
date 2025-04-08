import axios from "axios";

const API_URL = "http://localhost:5000/api/brands";

export const getBrands = async () => {
    const res = await axios.get(API_URL);
    return res.data;
};

export const createBrand = async (brandData) => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("⚠ Không tìm thấy token trong localStorage!");
        return;
    }

    try {
        console.log("Dữ liệu gửi đi:", brandData);
        console.log("Token gửi đi:", token);

        const res = await axios.post(API_URL, brandData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log("API Response:", res.data);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi gửi dữ liệu:", error.response?.data || error.message);
        throw error;
    }
};

export const updateBrand = async (id, brandData) => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("⚠ Không tìm thấy token trong localStorage!");
        return;
    }

    const res = await axios.put(`${API_URL}/${id}`, brandData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

export const deleteBrand = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("⚠ Không tìm thấy token trong localStorage!");
        return;
    }

    const res = await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};
