import React, { useEffect, useState } from "react";
import CategoryList from "./CategoryList";
import CategoryForm from "./CategoryForm";
import { getCategories, deleteCategory } from "../../../services/categoryService";

import "../Category/CategoryStyles.css"; 


const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editCategory, setEditCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setCategories(await getCategories());
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa loại giày này?")) {
            await deleteCategory(id);
            fetchCategories();
        }
    };

    return (
        <div className="category-container">
            <h2>Danh Sách Loại Giày</h2>
            <button className="add-btn" onClick={() => setShowForm(true)}>➕ Thêm Loại</button>

            <CategoryList 
                categories={categories} 
                onEdit={(category) => {
                    setEditCategory(category);
                    setShowForm(true);
                }} 
                onDelete={handleDelete} 
            />

            {showForm && <CategoryForm onClose={() => setShowForm(false)} onCategoryAdded={fetchCategories} editCategory={editCategory} />}
        </div>
    );
};

export default CategoryPage;
