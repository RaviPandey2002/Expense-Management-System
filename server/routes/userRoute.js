const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  loginController,
  registerController,
  logoutController,
  updatePasswordController,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts, please try again later" },
});

router.post("/register", authLimiter, registerController);
router.post("/login", authLimiter, loginController);
router.post("/logout", logoutController);
router.put("/update-password", authMiddleware, updatePasswordController);

module.exports = router;