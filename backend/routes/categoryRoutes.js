const express = require("express");
const { getCategories, createCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", getCategories);
router.post("/", authMiddleware, authorizeRoles("admin"), createCategory);
router.put("/:id", authMiddleware, authorizeRoles("admin"), updateCategory);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteCategory);

module.exports = router;
