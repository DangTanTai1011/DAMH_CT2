const express = require("express");
const Cart = require("../models/Cart");
const router = express.Router();

router.get("/:userId", async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) {
            return res.status(404).json({ message: "Giỏ hàng trống" });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy giỏ hàng", error: error.message });
    }
});

module.exports = router;
