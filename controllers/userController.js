const User = require("../models/userModel");

//Register Callback
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exist with this Email");
      return res.status(401).json({
        success: false,
        error: "This email already exists!!",
      });
    }
    const newUser = new User({
      name,
      email,
      password,
    });
    if (!newUser.name)
      return res.status(402).send({ message: "NO proper data send" });
    const result = await newUser.save();
    console.log("RES:", result);
    res.status(201).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};

// login callback
const loginController = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User Not Found");
    }
    console.log("LogedIn successfully");
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};

module.exports = { loginController, registerController };
