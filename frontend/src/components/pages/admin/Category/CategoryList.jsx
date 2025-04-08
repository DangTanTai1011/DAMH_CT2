import React from "react";

const CategoryList = ({ categories, onEdit, onDelete }) => {
    return (
        <table className="category-table">
            <thead>
                <tr>
                    <th>Loại Giày</th>
                    <th>Hành Động</th>
                </tr>
            </thead>
            <tbody>
                {categories.map((category) => (
                    <tr key={category._id}>
                        <td>{category.name}</td>
                        <td>
                            <button className="edit-btn" onClick={() => onEdit(category)}>✏️ Sửa</button>
                            <button className="delete-btn" onClick={() => onDelete(category._id)}>🗑️ Xóa</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default CategoryList;
