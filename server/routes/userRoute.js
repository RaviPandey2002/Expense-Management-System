const express = require("express");
const {
  loginController,
  registerController,
  logoutController,
  updatePasswordController,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.put("/update-password", authMiddleware, updatePasswordController);

module.exports = router;