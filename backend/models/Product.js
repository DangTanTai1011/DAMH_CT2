const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    size: [{ type: Number, required: true }],
    stock: { type: Number, required: true },
    colors: [{ type: String, required: true }],
    imageUrl: [{ type: String, required: true }],
    rating: { type: Number, default: 0, min: 0, max: 5 }
});

module.exports = mongoose.model("Product", ProductSchema);
