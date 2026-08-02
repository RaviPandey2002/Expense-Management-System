const User = require("../models/userModel");
const Transaction = require("../models/transactionModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const generateDemoTransactions = require("../utils/demoData");

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
    const isDuplicate = error.code === 11000;
    res.status(isDuplicate ? 409 : 400).json({
      success: false,
      message: isDuplicate
        ? "An account with this email already exists"
        : `Something went wrong while registering user. Error: ${error.message}`,
    });
  }
};

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

    if (user.isDemo) {
      return res.status(403).json({
        success: false,
        message: "Demo accounts cannot log in with a password",
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

const logoutController = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  return res.status(200).json({ success: true, message: "Logged out successfully" });
};

const updatePasswordController = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "currentPassword and newPassword are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    }

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

const COOKIE_OPTIONS = (maxAgeMs) => ({
  httpOnly: true,
  secure: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: maxAgeMs,
});

const DEMO_TTL_MS  = 2 * 60 * 60 * 1000;
const DEMO_TTL_SEC = 2 * 60 * 60;

const demoLoginController = async (req, res) => {
  try {
    const existingToken = req.cookies?.token;
    if (existingToken) {
      try {
        const decoded = jwt.verify(existingToken, process.env.JWT_SECRET);
        const existingUser = await User.findById(decoded.userId).lean();

        if (existingUser && existingUser.isDemo) {
          const { password: _, ...safeUser } = existingUser;
          const newToken = jwt.sign(
            { userId: existingUser._id, isDemo: true },
            process.env.JWT_SECRET,
            { expiresIn: `${DEMO_TTL_SEC}s` }
          );
          res.cookie("token", newToken, COOKIE_OPTIONS(DEMO_TTL_MS));
          return res.status(200).json({ success: true, user: { ...safeUser, isDemo: true } });
        }
      } catch (_) {
        // ignore
      }
    }

    const uuid       = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
    const demoEmail  = `demo_${uuid}@demo.local`;
    const demoPass   = await bcrypt.hash(crypto.randomUUID(), 10); // random, never used
    const expiresAt  = new Date(Date.now() + DEMO_TTL_MS);

    const demoUser = await User.create({
      name: "Demo User",
      email: demoEmail,
      password: demoPass,
      isDemo: true,
      expiresAt,
    });

    await Transaction.insertMany(generateDemoTransactions(demoUser._id));

    const { password: _pw, ...safeUser } = demoUser.toObject();
    const token = jwt.sign(
      { userId: demoUser._id, isDemo: true },
      process.env.JWT_SECRET,
      { expiresIn: `${DEMO_TTL_SEC}s` }
    );

    res.cookie("token", token, COOKIE_OPTIONS(DEMO_TTL_MS));
    return res.status(201).json({ success: true, user: { ...safeUser, isDemo: true } });

  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to start demo session" });
  }
};

module.exports = { loginController, registerController, logoutController, updatePasswordController, demoLoginController };
