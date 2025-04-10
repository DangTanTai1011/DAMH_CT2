const Review = require("../models/Review");
const Product = require("../models/Product");

exports.addReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.id;

        const newReview = new Review({ product: productId, user: userId, rating, comment });
        await newReview.save();

        const reviews = await Review.find({ product: productId });
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await Product.findByIdAndUpdate(productId, { rating: avgRating });

        res.status(201).json({ message: "✅ Đánh giá thành công", review: newReview });
    } catch (err) {
        res.status(500).json({ message: "❌ Lỗi đánh giá", error: err.message });
    }
};

exports.getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.find({ product: productId }).populate("user", "username email");
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: "Lỗi lấy đánh giá", error: err.message });
    }
};

exports.getAllReviews = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "❌ Chỉ admin mới được truy cập" });
    }
    try {
        const reviews = await Review.find().populate("user", "username email").populate("product", "name");
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: "Lỗi lấy tất cả đánh giá", error: err.message });
    }
};

exports.deleteReview = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "❌ Chỉ admin mới được truy cập" });
    }
    try {
        const { reviewId } = req.params;

        const review = await Review.findByIdAndDelete(reviewId);
        if (!review) return res.status(404).json({ message: "Không tìm thấy đánh giá" });

        const reviews = await Review.find({ product: review.product });
        const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
        await Product.findByIdAndUpdate(review.product, { rating: avgRating });

        res.json({ message: "Đánh giá đã bị xóa" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi xóa đánh giá", error: err.message });
    }
};

exports.updateReview = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "❌ Chỉ admin mới được truy cập" });
    }
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.id;

        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ message: "Không tìm thấy đánh giá" });

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Bạn không có quyền sửa đánh giá này" });
        }

        review.rating = rating;
        review.comment = comment;
        review.createdAt = new Date();
        await review.save();

        const reviews = await Review.find({ product: review.product });
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await Product.findByIdAndUpdate(review.product, { rating: avgRating });

        res.json({ message: "✅ Đánh giá đã được cập nhật", review });
    } catch (err) {
        res.status(500).json({ message: "❌ Lỗi khi cập nhật đánh giá", error: err.message });
    }
};
