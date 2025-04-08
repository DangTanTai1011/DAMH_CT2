const express = require("express");
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByBrand 
} = require("../controllers/productController");  

const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

router.get("/by-brand/:brandId", getProductsByBrand);  

router.post("/", authMiddleware, authorizeRoles("admin"), createProduct);
router.put("/:id", authMiddleware, authorizeRoles("admin"), updateProduct);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteProduct);

module.exports = router;
