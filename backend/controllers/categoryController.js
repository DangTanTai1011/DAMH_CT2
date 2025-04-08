const Category = require("../models/Category");

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error });
    }
};

exports.createCategory = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden: Only admin can add categories" });
    }

    try {
        const category = new Category({ name: req.body.name });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: "Error creating category", error });
    }
};

exports.updateCategory = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden: Only admin can update categories" });
    }

    try {
        const category = await Category.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
        if (!category) return res.status(404).json({ message: "Category not found" });

        res.json(category);
    } catch (error) {
        res.status(400).json({ message: "Error updating category", error });
    }
};

exports.deleteCategory = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden: Only admin can delete categories" });
    }

    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: "Category deleted" });
    } catch (error) {
        res.status(400).json({ message: "Error deleting category", error });
    }
};
