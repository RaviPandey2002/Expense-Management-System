const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register callback
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ success: false, message: "name, email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "An account with this email already exists" });
    }

    // hashing the password before saving it in DB
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const result = await newUser.save();
    const { password: _, ...safeResult } = result.toObject();

    res.status(201).json({
      success: true,
      result: safeResult,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: `Something went wrong while registering user!!!. Error: ${error.message}`,
    });
  }
};

// Login callback
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).lean();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password!",
      });
    }

    const { password: _, ...safeUser } = user;

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      user: safeUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Something went wrong while logging in. Error: ${error.message}`,
    });
  }
};

// Logout callback
const logoutController = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  return res.status(200).json({ success: true, message: "Logged out successfully" });
};

// update password callback
const updatePasswordController = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: `Error updating password: ${error.message}` });
  }
};

module.exports = { loginController, registerController, logoutController, updatePasswordController };
