import React, { useState, useEffect } from "react";
import { createProduct, updateProduct } from "../../../services/productService";
import { getBrands } from "../../../services/brandService";
import { getCategories } from "../../../services/categoryService";

const ProductForm = ({ onClose, onProductAdded, editProduct }) => {
    const [productData, setProductData] = useState({
        name: editProduct ? editProduct.name : "",
        price: editProduct ? editProduct.price : "",
        stock: editProduct ? editProduct.stock : "",
        description: editProduct ? editProduct.description : "",
        size: editProduct ? editProduct.size?.join(", ") : "",
        colors: editProduct ? editProduct.colors?.join(", ") : "",
        brand: editProduct ? editProduct.brand?._id : "",
        category: editProduct ? editProduct.category?._id : "",
        image: null,
    });

    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchBrands();
        fetchCategories();
    }, []);

    const fetchBrands = async () => setBrands(await getBrands());
    const fetchCategories = async () => setCategories(await getCategories());

    const handleChange = (e) => {
        setProductData({ ...productData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setProductData({ ...productData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!productData.name || !productData.price || !productData.stock || !productData.brand || !productData.category) {
            return alert("Vui lòng nhập đầy đủ thông tin!");
        }

        const formData = new FormData();
        formData.append("name", productData.name);
        formData.append("price", productData.price);
        formData.append("stock", productData.stock);
        formData.append("description", productData.description);
        formData.append("size", JSON.stringify(productData.size.split(",")));  
        formData.append("colors", JSON.stringify(productData.colors.split(","))); 
        formData.append("brand", productData.brand);
        formData.append("category", productData.category);

        if (productData.image) {
            formData.append("image", productData.image);
        }

        try {
            if (editProduct) {
                await updateProduct(editProduct._id, formData);
            } else {
                await createProduct(formData);
            }

            onProductAdded();
            onClose();
        } catch (error) {
            console.error("Lỗi khi gửi dữ liệu:", error);
            alert("Lỗi khi xử lý sản phẩm, vui lòng thử lại!");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{editProduct ? "Sửa Sản Phẩm" : "Thêm Sản Phẩm"}</h3>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Product Name" value={productData.name} onChange={handleChange} />
                    <input type="number" name="price" placeholder="Price" value={productData.price} onChange={handleChange} />
                    <input type="number" name="stock" placeholder="Stock" value={productData.stock} onChange={handleChange} />
                    <input type="text" name="description" placeholder="Description" value={productData.description} onChange={handleChange} />
                    <input type="text" name="size" placeholder="Size (comma-separated)" value={productData.size} onChange={handleChange} />
                    <input type="text" name="colors" placeholder="Colors (comma-separated)" value={productData.colors} onChange={handleChange} />
                    <input type="file" onChange={handleFileChange} />

                    <select name="category" value={productData.category} onChange={handleChange}>
                        <option value="">Danh Sách Loại</option>
                        {categories.map(category => <option key={category._id} value={category._id}>{category.name}</option>)}
                    </select>

                    <select name="brand" value={productData.brand} onChange={handleChange}>
                        <option value="">Danh Sách Thương Hiệu</option>
                        {brands.map(brand => <option key={brand._id} value={brand._id}>{brand.name}</option>)}
                    </select>

                    <button type="submit">{editProduct ? "Sửa" : "Thêm"}</button>
                    <button type="button" className="close-btn" onClick={onClose}>❌ Hủy</button>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
