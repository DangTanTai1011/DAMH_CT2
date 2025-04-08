const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.post("/:productId", authMiddleware, reviewController.addReview);
router.get("/product/:productId", reviewController.getReviewsByProduct);
router.get("/", authMiddleware, authorizeRoles("admin"), reviewController.getAllReviews);
router.delete("/:reviewId", authMiddleware, authorizeRoles("admin"), reviewController.deleteReview);
router.put("/:reviewId", authMiddleware, authorizeRoles("admin"), reviewController.updateReview);

module.exports = router;
