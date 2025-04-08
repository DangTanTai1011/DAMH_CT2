import React, { useEffect, useState } from "react";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";
import { getProducts, deleteProduct } from "../../../services/productService";
import "../Product/ProductStyles.css";

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editProduct, setEditProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error);
            alert("Không thể tải danh sách sản phẩm!");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
            try {
                await deleteProduct(id);
                fetchProducts();
            } catch (error) {
                console.error("Lỗi khi xóa sản phẩm:", error);
                alert("Xóa sản phẩm thất bại!");
            }
        }
    };

    return (
        <div className="product-container">
            <div className="product-header">
            <h2 className="product-header">Danh Sách Sản Phẩm</h2>

</div>
<div className="add-btn-wrapper">
  <button className="add-btn" onClick={() => setShowForm(true)}>
    ➕ Thêm Sản Phẩm
  </button>

            </div>

            <ProductList
                products={products}
                onEdit={(product) => {
                    setEditProduct(product);
                    setShowForm(true);
                }}
                onDelete={handleDelete}
            />

            {showForm && (
                <ProductForm
                    onClose={() => setShowForm(false)}
                    onProductAdded={fetchProducts}
                    editProduct={editProduct}
                />
            )}
        </div>
    );
};

export default ProductPage;
