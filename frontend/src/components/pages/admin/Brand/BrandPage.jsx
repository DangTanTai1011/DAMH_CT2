import React, { useEffect, useState } from "react";
import BrandList from "./BrandList";
import BrandForm from "./BrandForm";
import { getBrands, deleteBrand } from "../../../services/brandService";
import "../Brand/BrandStyles.css";

const BrandPage = () => {
  const [brands, setBrands] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editBrand, setEditBrand] = useState(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setBrands(await getBrands());
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa thương hiệu này?")) {
      await deleteBrand(id);
      fetchBrands();
    }
  };

  return (
    <div className="brand-container">
      <div className="brand-header">
        <button className="add-btn" onClick={() => setShowForm(true)}>➕ Thêm Thương Hiệu</button>
        <h2>Danh Sách Thương Hiệu</h2>
      </div>

      <BrandList
        brands={brands}
        onEdit={(brand) => {
          setEditBrand(brand);
          setShowForm(true);
        }}
        onDelete={handleDelete}
      />

      {showForm && (
        <BrandForm
          onClose={() => setShowForm(false)}
          onBrandAdded={fetchBrands}
          editBrand={editBrand}
        />
      )}
    </div>
  );
};

export default BrandPage;
