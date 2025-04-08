const Cart = require('../models/Cart');

const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId', 'name price imageUrl');
        if (!cart) {
            return res.status(404).json({ message: 'Giỏ hàng trống' });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy giỏ hàng', error: error.message });
    }
};

const addToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ userId });
        if (cart) {
            const existingProduct = cart.items.find(item => item.productId.toString() === productId);
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.items.push({ productId, quantity });
            }
            await cart.save();
        } else {
            cart = new Cart({
                userId,
                items: [{ productId, quantity }]
            });
            await cart.save();
        }

        res.status(201).json({ message: 'Sản phẩm đã được thêm vào giỏ hàng' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm sản phẩm vào giỏ hàng', error: error.message });
    }
};

module.exports = { getCart, addToCart };
