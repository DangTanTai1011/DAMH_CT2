const express = require("express");
const router = express.Router();
const { getOrderDetails, deleteOrderDetail, updateOrderDetail } = require("../controllers/orderDetailController");
const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.get("/", authMiddleware, authorizeRoles("admin"), getOrderDetails);

router.put("/:orderDetailId", authMiddleware, authorizeRoles("admin"), updateOrderDetail);

router.delete("/:orderDetailId", authMiddleware, authorizeRoles("admin"), deleteOrderDetail);

module.exports = router;
