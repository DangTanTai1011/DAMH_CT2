import React, { useState } from "react";

const ProductList = ({ products, onEdit, onDelete }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5;

    const indexOfLastProduct = currentPage * productsPerPage;

    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(products.length / productsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <table className="product-table">
                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Giá</th>
                        <th>Tồn Kho</th>
                        <th>Mô Tả</th>
                        <th>Kích Cỡ</th>
                        <th>Màu</th>
                        <th>Ảnh</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProducts.length > 0 ? (
                        currentProducts.map((product) => (
                            <tr key={product._id}>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.stock}</td>
                                <td>{product.description}</td>
                                <td>{product.size?.join(", ") || "N/A"}</td>
                                <td>{product.colors?.join(", ") || "N/A"}</td>
                                <td>
                                    {product.imageUrl && product.imageUrl.length > 0 ? (
                                        <img src={`http://localhost:5000${product.imageUrl[0]}`} alt={product.name} width="50" />
                                    ) : (
                                        "No Image"
                                    )}
                                </td>
                                <td>
                                    <button className="edit-btn" onClick={() => onEdit(product)}>✏️ Sửa</button>
                                    <button className="delete-btn" onClick={() => onDelete(product._id)}>🗑️ Xóa</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">No products found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="pagination-controls">
                <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ProductList;
