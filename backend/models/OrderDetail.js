const mongoose = require("mongoose");

const OrderDetailSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    note: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("OrderDetail", OrderDetailSchema);
