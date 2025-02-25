const User = require("../models/userModel");
const bcrypt = require('bcryptjs');

//Register Callback
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exist with this Email");
      return res.status(401).json({
        message: "This email already exists!!",
      });
    }

    // hashing the password before saving it in DB
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    if (!newUser.name)
      return res.status(402).send({ message: "Every Field id required!!" });

    const result = await newUser.save();

    res.status(201).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: `Something went wrong while registering user!!!. Error: ${error.message}`,
    });
  }
};

// login callback
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send(
        {
          status: false,
          message: "User Not Found"
        }
      );
    }

    const varifyPassword = await bcrypt.compare(password, user.password);

    if (!varifyPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password!"
      })
    }

    console.log("LoggedIn successfully");
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Something went wrong while login-in controller. Error: ${error?.response?.data?.message} `,
    });
  }
};

module.exports = { loginController, registerController };
