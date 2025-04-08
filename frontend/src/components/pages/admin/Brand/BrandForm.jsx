import React, { useState } from "react";
import { createBrand, updateBrand } from "../../../services/brandService";

const BrandForm = ({ onClose, onBrandAdded, editBrand }) => {
    const [brandName, setBrandName] = useState(editBrand ? editBrand.name : "");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!brandName) return alert("Tên thương hiệu không được để trống!");

        if (editBrand) {
            await updateBrand(editBrand._id, { name: brandName });
        } else {
            await createBrand({ name: brandName });
        }

        onBrandAdded();
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{editBrand ? "Sửa Thương Hiệu" : "Thêm Thương Hiệu"}</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Tên Thương Hiệu"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                    />
                    <div className="modal-buttons">
                        <button type="submit">{editBrand ? "Sửa" : "Thêm"}</button>
                        <button type="button" className="close-btn" onClick={onClose}>❌ Hủy</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BrandForm;
