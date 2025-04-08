import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ReviewStyles.css"; 

const ReviewPage = () => {
    const [reviews, setReviews] = useState([]);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editRating, setEditRating] = useState(0);
    const [editComment, setEditComment] = useState("");

    const fetchReviews = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.get("http://localhost:5000/api/reviews", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReviews(res.data);
        } catch (err) {
            console.error("Lỗi khi lấy đánh giá:", err);
        }
    };

    const handleDelete = async (reviewId) => {
        const token = localStorage.getItem("token");
        if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchReviews(); 
        } catch (err) {
            console.error("Lỗi khi xóa đánh giá:", err);
        }
    };

    const startEditing = (review) => {
        setEditingReviewId(review._id);
        setEditRating(review.rating);
        setEditComment(review.comment);
    };

    const handleSave = async (reviewId) => {
        const token = localStorage.getItem("token");
        try {
            await axios.put(`http://localhost:5000/api/reviews/${reviewId}`, {
                rating: editRating,
                comment: editComment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("✅ Cập nhật thành công");
            setEditingReviewId(null);
            fetchReviews();
        } catch (err) {
            alert("❌ Lỗi khi cập nhật");
            console.error(err);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    return (
        <div className="review-container">
            <div className="review-header">
                <h2>Quản lý đánh giá</h2>
            </div>
            <table className="review-table">
                <thead>
                    <tr>
                        <th>Sản phẩm</th>
                        <th>Người dùng</th>
                        <th>Đánh giá</th>
                        <th>Nội dung</th>
                        <th>Thời gian</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.map((r) => (
                        <tr key={r._id}>
                            <td>{r.product?.name || "Không xác định"}</td>
                            <td>{r.user?.username || "Ẩn danh"}</td>
                            <td>
                                {editingReviewId === r._id ? (
                                    <input
                                        type="number"
                                        min={1}
                                        max={5}
                                        value={editRating}
                                        onChange={(e) => setEditRating(Number(e.target.value))}
                                    />
                                ) : (
                                    `${r.rating} ⭐`
                                )}
                            </td>
                            <td>
                                {editingReviewId === r._id ? (
                                    <input
                                        type="text"
                                        value={editComment}
                                        onChange={(e) => setEditComment(e.target.value)}
                                    />
                                ) : (
                                    r.comment
                                )}
                            </td>
                            <td>{new Date(r.createdAt).toLocaleString()}</td>
                            <td>
                                {editingReviewId === r._id ? (
                                    <>
                                        <button onClick={() => handleSave(r._id)}>💾 Lưu</button>
                                        <button onClick={() => setEditingReviewId(null)}>❌ Hủy</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => startEditing(r)}>✏️ Sửa</button>
                                        <button onClick={() => handleDelete(r._id)}>🗑️ Xóa</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReviewPage;
