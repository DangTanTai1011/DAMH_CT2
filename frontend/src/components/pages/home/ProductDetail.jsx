import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById, getProductsByBrand } from "../../services/productService";
import { getReviewsByProduct, reviewProduct } from "../../services/reviewService";
import './css/ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(5);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetchProduct();
        fetchReviews();
    }, [id]);

    const fetchProduct = async () => {
        const data = await getProductById(id);
        setProduct(data);
        if (data?.brand) fetchSimilarProducts(data.brand._id);
    };

    const fetchSimilarProducts = async (brandId) => {
        try {
            const res = await getProductsByBrand(brandId);
            setSimilarProducts(res.filter(p => p._id !== id));
        } catch (err) {
            console.error("Lỗi khi lấy sản phẩm tương tự:", err);
        }
    };

    const fetchReviews = async () => {
        try {
            const res = await getReviewsByProduct(id);
            setReviews(res);
        } catch (err) {
            console.error("Lỗi khi lấy đánh giá:", err);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            await reviewProduct(id, { comment, rating });
            alert("✅ Đánh giá đã được gửi!");
            setComment("");
            setRating(5);
            fetchReviews(); 
        } catch (error) {
            alert(error.response?.data?.message || "❌ Lỗi khi gửi đánh giá");
        }
    };

    if (!product) return <h2>Đang tải dữ liệu...</h2>;

    return (
        <div className="product-detail-container">
            <h2>Chi tiết sản phẩm</h2>
            <div className="product-info">
                <div className="product-image">
                    <img src={`http://localhost:5000${product.imageUrl}`} alt={product.name} />
                </div>
                <div className="product-details">
                    <h3>{product.name}</h3>
                    <p><strong>Giá:</strong> {product.price.toLocaleString("vi-VN")} VNĐ</p>
                    <p><strong>Mô tả:</strong> {product.description}</p>
                    <p><strong>Số lượng:</strong> {product.stock}</p>
                    <p><strong>Kích cỡ:</strong> {product.size.join(", ")}</p>
                    <p><strong>Màu sắc:</strong> {product.colors.join(", ")}</p>
                    <p><strong>Đánh giá trung bình:</strong> {product.rating.toFixed(1)} ⭐</p>
                </div>
            </div>

            <hr />

            <div className="review-form">
                <h3>Gửi đánh giá</h3>
                <form onSubmit={handleReviewSubmit}>
                    <label>Điểm đánh giá (1 - 5):</label>
                    <input
                        type="number"
                        min={1}
                        max={5}
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        required
                    />
                    <br />
                    <label>Bình luận:</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    ></textarea>
                    <br />
                    <button type="submit">Gửi đánh giá</button>
                </form>
            </div>

            <hr />

            <div className="reviews-list">
                <h3>Đánh giá từ người dùng</h3>
                {reviews.length === 0 ? (
                    <p>Chưa có đánh giá nào.</p>
                ) : (
                    <ul>
                        {reviews.map((r, i) => (
                            <li key={r._id || i}>
                                <strong>{r.rating} ⭐</strong> - {r.comment} <br />
                                <em>Người dùng: {r.user?.username || "Ẩn danh"} - {new Date(r.createdAt).toLocaleString()}</em>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <hr />

            <div className="similar-products">
                <h3>Sản phẩm tương tự</h3>
                <div className="similar-products-list">
                    {similarProducts.length === 0 ? (
                        <p>Không có sản phẩm tương tự.</p>
                    ) : (
                        similarProducts.map((sp) => (
                            <div key={sp._id} className="product-card">
                                <img src={`http://localhost:5000${sp.imageUrl}`} alt={sp.name} />
                                <h4>{sp.name}</h4>
                                <p>{sp.price.toLocaleString("vi-VN")} VND</p>
                                <button onClick={() => window.location.href = `/product/${sp._id}`}>Xem chi tiết</button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
