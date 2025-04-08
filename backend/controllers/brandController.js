const Brand = require("../models/Brand");

exports.getBrands = async (req, res) => {
    const brands = await Brand.find();
    res.json(brands);
};

exports.createBrand = async (req, res) => {
    if (req.user.role !== "admin") {
        console.log("Người dùng không phải admin:", req.user);
        return res.status(403).json({ message: "Forbidden: Only admin can add brands" });
    }

    console.log("Dữ liệu nhận từ frontend:", req.body);

    try {
        const brand = new Brand({ name: req.body.name });
        await brand.save();
        console.log("Brand đã được thêm thành công:", brand);
        res.status(201).json(brand);
    } catch (error) {
        console.error("Lỗi khi tạo Brand:", error.message);
        res.status(400).json({ message: "Lỗi khi tạo Brand", error });
    }
};

exports.updateBrand = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden: Only admin can update brands" });
    }

    const brand = await Brand.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    if (!brand) return res.status(404).json({ message: "Brand not found" });

    res.json(brand);
};

// Xóa thương hiệu - Chỉ admin
exports.deleteBrand = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden: Only admin can delete brands" });
    }

    await Brand.findByIdAndDelete(req.params.id);
    res.json({ message: "Brand deleted" });
};
