const OrderDetail = require("../models/OrderDetail");

exports.getOrderDetails = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "❌ Chỉ admin mới được thêm sản phẩm" });
    }
    try {
        const orderDetails = await OrderDetail.find().populate("orderId", "totalPrice status");
        
        res.json(orderDetails);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy chi tiết đơn hàng", error: error.message });
    }
};

exports.updateOrderDetail = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "❌ Chỉ admin mới được thêm sản phẩm" });
    }
    try {
        const { orderDetailId } = req.params;
        const { fullName, email, phone, address, note } = req.body;

        const orderDetail = await OrderDetail.findById(orderDetailId);
        if (!orderDetail) return res.status(404).json({ message: "Không tìm thấy chi tiết đơn hàng" });

        orderDetail.fullName = fullName || orderDetail.fullName;
        orderDetail.email = email || orderDetail.email;
        orderDetail.phone = phone || orderDetail.phone;
        orderDetail.address = address || orderDetail.address;
        orderDetail.note = note || orderDetail.note;

        await orderDetail.save();
        res.status(200).json({ message: "Cập nhật thông tin đơn hàng thành công", orderDetail });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật thông tin đơn hàng", error: error.message });
    }
};

exports.deleteOrderDetail = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "❌ Chỉ admin mới được thêm sản phẩm" });
    }
    try {
        const { orderDetailId } = req.params;
        const orderDetail = await OrderDetail.findByIdAndDelete(orderDetailId);
        if (!orderDetail) return res.status(404).json({ message: "Không tìm thấy chi tiết đơn hàng" });
        
        res.json({ message: "Chi tiết đơn hàng đã bị xóa" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa chi tiết đơn hàng", error: error.message });
    }
};
