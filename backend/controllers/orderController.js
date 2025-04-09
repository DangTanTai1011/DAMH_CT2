const Order = require("../models/Order");
const Product = require("../models/Product");
const OrderDetail = require("../models/OrderDetail");

exports.createOrder = async (req, res) => {
    const { items } = req.body;
    const userId = req.user.id;

    try {
        const populatedItems = await Promise.all(items.map(async item => {
            const product = await Product.findById(item.productId);
            return {
                productId: item.productId,
                productName: product.name,
                quantity: item.quantity,
            };
        }));

        const totalPrice = populatedItems.reduce((sum, item) => {
            const product = items.find(p => p.productId === item.productId);
            return sum + (product.price * item.quantity);
        }, 0);

        const newOrder = new Order({
            userId,
            items: populatedItems,
            totalPrice
        });

        await newOrder.save();
        res.status(201).json({ message: "Đặt hàng thành công", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi đặt hàng", error: error.message });
    }
};

exports.createOrderWithDetails = async (req, res) => {
    const { items, fullName, email, phone, address, note } = req.body;
    const userId = req.user.id;

    try {
        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Không có sản phẩm nào trong đơn hàng." });
        }

        const populatedItems = await Promise.all(items.map(async item => {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Không tìm thấy sản phẩm với ID: ${item.productId}` });
            }

            return {
                productId: item.productId,
                productName: product.name,
                quantity: item.quantity,
                price: product.price  
            };
        }));

        const totalPrice = populatedItems.reduce((sum, item) => {
            return sum + (item.price * item.quantity); 
        }, 0);

        const newOrder = new Order({
            userId,
            items: populatedItems,
            totalPrice,
            status: "Chờ xác nhận"
        });

        const savedOrder = await newOrder.save();

        const newDetail = new OrderDetail({
            orderId: savedOrder._id,
            fullName,
            email,
            phone,
            address,
            note
        });

        await newDetail.save();

        res.status(201).json({ message: "Đặt hàng thành công!", orderId: savedOrder._id });
    } catch (error) {
        console.error("Lỗi tạo đơn hàng:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi đặt hàng.", error });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy đơn hàng người dùng" });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("userId", "username email").populate("items.productId", "name price");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách đơn hàng" });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { orderId, status } = req.body;

    try {
        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },  
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        res.status(200).json({ message: "Cập nhật trạng thái đơn hàng thành công", order });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật trạng thái đơn hàng", error: error.message });
    }
};


exports.deleteOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findByIdAndDelete(orderId);
        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        await OrderDetail.deleteOne({ orderId });

        res.status(200).json({ message: "Đơn hàng đã được xóa thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa đơn hàng", error: error.message });
    }
};