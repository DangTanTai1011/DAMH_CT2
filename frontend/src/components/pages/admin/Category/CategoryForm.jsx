import React, { useState } from "react";
import { createCategory, updateCategory } from "../../../services/categoryService";

const CategoryForm = ({ onClose, onCategoryAdded, editCategory }) => {
    const [categoryName, setCategoryName] = useState(editCategory ? editCategory.name : "");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!categoryName) return alert("Tên danh mục không được để trống!");

        if (editCategory) {
            await updateCategory(editCategory._id, { name: categoryName });
        } else {
            await createCategory({ name: categoryName });
        }

        onCategoryAdded();
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{editCategory ? "Sửa Loại Giày" : "Thêm Loại Giày"}</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Tên Loại Giày"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />
                    <button type="submit">{editCategory ? "Sửa" : "Thêm"}</button>
                    <button type="button" className="close-btn" onClick={onClose}>❌ Hủy</button>
                </form>
            </div>
        </div>
    );
};

export default CategoryForm;
