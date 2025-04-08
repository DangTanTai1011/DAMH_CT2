import React from "react";
import { deleteBrand } from "../../../services/brandService";

const BrandList = ({ brands, onEdit, onDelete }) => {
    return (
        <table className="brand-table">
            <thead>
                <tr>
                    <th>Thương Hiệu</th>
                    <th>Hành Động</th>
                </tr>
            </thead>
            <tbody>
                {brands.map((brand) => (
                    <tr key={brand._id}>
                        <td>{brand.name}</td>
                        <td>
                            <button className="edit-btn" onClick={() => onEdit(brand)}>✏️ Sửa</button>
                            <button className="delete-btn" onClick={() => onDelete(brand._id)}>🗑️ Xóa</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default BrandList;
