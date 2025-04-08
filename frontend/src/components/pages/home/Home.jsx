import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getProducts,
    getBrands,
    getCategories
} from "../../services/productService";
import "./css/HomeStyles.css";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [priceRange, setPriceRange] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchInitialData = async () => {
            const [brandData, categoryData, productData] = await Promise.all([
                getBrands(),
                getCategories(),
                getProducts()
            ]);
            setBrands(brandData);
            setCategories(categoryData);
            setProducts(productData);
        };
        fetchInitialData();
    }, []);

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

    const handleSearch = () => {
        let min = "";
        let max = "";

        if (priceRange === "0-500000") {
            min = 0;
            max = 500000;
        } else if (priceRange === "500000-1000000") {
            min = 500000;
            max = 1000000;
        } else if (priceRange === "1000000-1500000") {
            min = 1000000;
            max = 1500000;
        } else if (priceRange === "1500000-2000000") {
            min = 1500000;
            max = 2000000;
        } else if (priceRange === "2000000-2500000") {
            min = 2000000;
            max = 2500000;
        } else if (priceRange === "2500000-3000000") {
            min = 2500000;
            max = 3000000;
        } else if (priceRange === "3000000-3500000") {
            min = 3000000;
            max = 3500000;
        }

        const filters = {};
        if (searchQuery.trim() !== "") filters.name = searchQuery.trim();
        if (selectedBrand !== "") filters.brand = selectedBrand;
        if (selectedCategory !== "") filters.category = selectedCategory;
        if (min !== "" && max !== "") {
            filters.minPrice = min;
            filters.maxPrice = max;
        }

        navigate("/search", { state: filters });
    };

    return (
        <div>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select onChange={(e) => setSelectedBrand(e.target.value)} value={selectedBrand}>
                    <option value="">Chọn Thương Hiệu</option>
                    {brands.map((brand) => (
                        <option key={brand._id} value={brand._id}>
                            {brand.name}
                        </option>
                    ))}
                </select>
                <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
                    <option value="">Chọn Loại</option>
                    {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <select onChange={(e) => setPriceRange(e.target.value)} value={priceRange}>
                    <option value="">Chọn khoảng giá</option>
                    <option value="0-500000">0 - 500.000 VNĐ</option>
                    <option value="500000-1000000">500.000 - 1.000.000 VNĐ</option>
                    <option value="1000000-1500000">1000.000 - 1.500.000 VNĐ</option>
                    <option value="1500000-2000000">1.500.000 - 2.000.000 VNĐ</option>
                    <option value="2000000-2500000">2.000.000 - 2.500.000 VNĐ</option>
                    <option value="2500000-3000000">2.500.000 - 3.000.000 VNĐ</option>
                    <option value="3000000-3500000">3.000.000 - 3.500.000 VNĐ</option>
                </select>
                <button onClick={handleSearch}>Tìm kiếm</button>
            </div>

            <div className="product-container">
                {products.length === 0 ? (
                    <p>Không có sản phẩm nào.</p>
                ) : (
                    products.map((product) => (
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
                    ))
                )}
            </div>
        </div>
    );
};

export default Home;
