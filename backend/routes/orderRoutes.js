const express = require("express");
const {
    createOrder,
    createOrderWithDetails,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder  
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createOrder);

router.post("/with-details", authMiddleware, createOrderWithDetails);

router.get("/my", authMiddleware, getUserOrders);

router.get("/all", authMiddleware, authorizeRoles("admin"), getAllOrders);

router.put("/update-status", authMiddleware, authorizeRoles("admin"), updateOrderStatus);

router.delete("/:orderId", authMiddleware, authorizeRoles("admin"), deleteOrder); 

module.exports = router;
