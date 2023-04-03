// controllers/auth.js

const User = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  try {
    // Check if email already exists in database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send({ message: "Email already exists" });
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).send({ message: "Passwords do not match" });
    }

    // Create new user with hashed password
    const newUser = new User({
      email,
      password,
    });

    await newUser.save();

    res.status(201).send({ message: "User created successfully" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: existingUser._id },
      "process.env.JWT_SECRET",
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, expiresIn: 3600 });
  } catch (error) {
    next(error);
  }
};
