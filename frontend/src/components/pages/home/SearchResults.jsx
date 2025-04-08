import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getProducts } from "../../services/productService";

const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [filters] = useState(location.state || {}); 

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts(filters);
                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi tìm kiếm sản phẩm:", error);
            }
        };

        fetchProducts();
    }, [filters]);

    const addToCart = (product) => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
            alert("⚠ Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
            navigate("/login");
            return;
        }

        const cartKey = `cart_${userId}`;
        const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        const existingIndex = cart.findIndex(item => item._id === product._id);

        if (existingIndex !== -1) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem(cartKey, JSON.stringify(cart));
        alert("🛒 Sản phẩm đã được thêm vào giỏ hàng!");
    };

    return (
        <div>
            <h2>Kết quả tìm kiếm</h2>
            {products.length === 0 ? (
                <p>Không có sản phẩm phù hợp với tiêu chí tìm kiếm.</p>
            ) : (
                <div className="product-container">
                    {products.map((product) => (
                        <div key={product._id} className="product-card">
                            <img
                                src={`http://localhost:5000${product.imageUrl[0]}`}
                                alt={product.name}
                            />
                            <h3>{product.name}</h3>
                            <p><strong>Đánh giá:</strong> {product.rating?.toFixed(1) || 0} ⭐</p>
                            <p><strong>Giá:</strong> {product.price.toLocaleString("vi-VN")} VNĐ</p>
                            <p><strong>Thương hiệu:</strong> {product.brand.name}</p>
                            <p><strong>Loại:</strong> {product.category.name}</p>
                            <button onClick={() => navigate(`/product/${product._id}`)}>Xem chi tiết</button>
                            <button style={{ marginTop: "5px" }} onClick={() => addToCart(product)}>🛒 Thêm vào giỏ hàng</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchResults;
