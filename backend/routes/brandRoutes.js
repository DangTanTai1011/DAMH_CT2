const express = require("express");
const { getBrands, createBrand, updateBrand, deleteBrand } = require("../controllers/brandController");
const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", getBrands);
router.post("/", authMiddleware, authorizeRoles("admin"), createBrand);
router.put("/:id", authMiddleware, authorizeRoles("admin"), updateBrand);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteBrand);

module.exports = router;
