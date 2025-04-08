const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    console.log("Token nhận từ frontend:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized - Invalid token format" });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        console.log("User đã decode:", req.user);
        next();
    } catch (error) {
        console.error("Lỗi xác thực token:", error.message);
        res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
};

module.exports = authMiddleware;
