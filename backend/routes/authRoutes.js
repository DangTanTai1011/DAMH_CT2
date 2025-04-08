const express = require("express");
const {
    register,
    login,
    logout,
    getAllUsers,
    deleteUser,
    updateUser
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/admin", authMiddleware, authorizeRoles("admin"), (req, res) => {
    res.json({ message: "Welcome to Admin Panel" });
});

router.get("/users", authMiddleware, authorizeRoles("admin"), getAllUsers);
router.delete("/users/:id", authMiddleware, authorizeRoles("admin"), deleteUser);
router.put("/users/:id", authMiddleware, authorizeRoles("admin"), updateUser);

module.exports = router;
