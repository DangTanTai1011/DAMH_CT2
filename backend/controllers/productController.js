const Product = require("../models/Product");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, file.originalname) 
});
const upload = multer({ storage }).single("image");

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("brand category");
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách sản phẩm", error });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("brand category");
        if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy sản phẩm", error });
    }
};

exports.createProduct = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(500).json({ message: "Lỗi upload file", error: err.message });

        try {
            const { name, price, stock, description, size, colors, brand, category, imageName } = req.body;
            if (!name || !price || !stock || !brand || !category) {
                return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
            }

            let imageUrl = "";
            if (req.file) {
                imageUrl = `/uploads/${req.file.filename}`;
            } else if (imageName) {
                const existingImagePath = path.join(__dirname, "..", "uploads", imageName);
                if (fs.existsSync(existingImagePath)) {
                    imageUrl = `/uploads/${imageName}`;
                }
            }

            const newProduct = new Product({
                name,
                price,
                stock,
                description,
                size: size ? JSON.parse(size) : [],
                colors: colors ? JSON.parse(colors) : [],
                brand,
                category,
                imageUrl
            });

            await newProduct.save();
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(500).json({ message: "Lỗi thêm sản phẩm", error: error.message });
        }
    });
};

exports.updateProduct = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(500).json({ message: "Lỗi upload file", error: err.message });

        try {
            const { name, price, stock, description, size, colors, brand, category, oldImage } = req.body;
            let updatedProduct = {
                name,
                price,
                stock,
                description,
                size: size ? JSON.parse(size) : [],
                colors: colors ? JSON.parse(colors) : [],
                brand,
                category,
            };

            if (req.file) {
                updatedProduct.imageUrl = `/uploads/${req.file.filename}`;
            } else if (oldImage) {
                const existingImagePath = path.join(__dirname, "..", "uploads", oldImage);
                if (fs.existsSync(existingImagePath)) {
                    updatedProduct.imageUrl = `/uploads/${oldImage}`;
                }
            }

            const product = await Product.findByIdAndUpdate(req.params.id, updatedProduct, { new: true });
            if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

            res.json(product);
        } catch (error) {
            res.status(400).json({ message: "Lỗi cập nhật sản phẩm", error });
        }
    });
};

exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Sản phẩm đã bị xóa" });
    } catch (error) {
        res.status(400).json({ message: "Lỗi xóa sản phẩm", error });
    }
};

exports.getProductsByBrand = async (req, res) => {
    const { brandId } = req.params;

    try {
        const products = await Product.find({ brand: brandId }).populate("brand category");
        if (!products) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm cho thương hiệu này" });
        }
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy sản phẩm theo thương hiệu", error });
    }
};

exports.getBrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        res.json(brands);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách thương hiệu", error });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh mục sản phẩm", error });
    }
};

exports.getProducts = async (req, res) => {
    const { name, brand, category, minPrice, maxPrice } = req.query;
    
    let filter = {};

    if (name) {
        filter.name = { $regex: name, $options: 'i' };
    }
    if (brand) {
        filter.brand = brand;
    }
    if (category) {
        filter.category = category;
    }
    if (minPrice && maxPrice) {
        filter.price = { $gte: minPrice, $lte: maxPrice };
    }

    try {
        const products = await Product.find(filter).populate("brand category");
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách sản phẩm", error });
    }
};

exports.getBrands = async (req, res) => {
    try {
        const brands = await Brand.find(); 
        res.json(brands); 
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách thương hiệu", error });
    }
};

// 🟢 Lấy danh mục sản phẩm
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh mục sản phẩm", error });
    }
};