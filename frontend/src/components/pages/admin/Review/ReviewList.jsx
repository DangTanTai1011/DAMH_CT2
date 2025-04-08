import React, { useEffect, useState } from "react";
import { getReviewsByProduct, updateReview, deleteReview } from "../../../services/reviewService";
import { useParams } from "react-router-dom";
import "./ReviewList.css";

const ReviewList = () => {
    const [reviews, setReviews] = useState([]);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editRating, setEditRating] = useState(0);
    const [editComment, setEditComment] = useState("");
    const { productId } = useParams();
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("role") === "admin"; 

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await getReviewsByProduct(productId);
                setReviews(res.data);
            } catch (err) {
                console.error("Lỗi khi lấy đánh giá:", err);
            }
        };

        fetchReviews();
    }, [productId]);

    const handleDelete = async (reviewId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;
        try {
            await deleteReview(reviewId, token);
            setReviews(reviews.filter((r) => r._id !== reviewId));
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
        try {
            await updateReview(reviewId, { rating: editRating, comment: editComment }, token);
            alert("✅ Đã cập nhật đánh giá");
            setEditingReviewId(null);
            fetchReviews(); 
        } catch (err) {
            console.error("Lỗi khi lưu đánh giá:", err);
            alert("❌ Lỗi khi cập nhật đánh giá");
        }
    };

    return (
        <div className="review-admin-container">
            <h2>Danh sách đánh giá</h2>
            <table>
                <thead>
                    <tr>
                        <th>Sản phẩm</th>
                        <th>Người đánh giá</th>
                        <th>Điểm</th>
                        <th>Bình luận</th>
                        <th>Thời gian</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.map((review) => (
                        <tr key={review._id}>
                            <td>{review.product?.name || "Không xác định"}</td>
                            <td>{review.user?.username || "Ẩn danh"}</td>
                            <td>
                                {editingReviewId === review._id ? (
                                    <input
                                        type="number"
                                        min={1}
                                        max={5}
                                        value={editRating}
                                        onChange={(e) => setEditRating(Number(e.target.value))}
                                    />
                                ) : (
                                    `${review.rating} ⭐`
                                )}
                            </td>
                            <td>
                                {editingReviewId === review._id ? (
                                    <input
                                        type="text"
                                        value={editComment}
                                        onChange={(e) => setEditComment(e.target.value)}
                                    />
                                ) : (
                                    review.comment
                                )}
                            </td>
                            <td>{new Date(review.createdAt).toLocaleString()}</td>
                            <td>
                                {isAdmin ? (
                                    <>
                                        {editingReviewId === review._id ? (
                                            <>
                                                <button onClick={() => handleSave(review._id)}>💾 Lưu</button>
                                                <button onClick={() => setEditingReviewId(null)}>❌ Hủy</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => startEditing(review)}>✏️ Sửa</button>
                                                <button onClick={() => handleDelete(review._id)}>🗑️ Xóa</button>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <span>Không có quyền</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReviewList;
