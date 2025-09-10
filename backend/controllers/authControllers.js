const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { email, password, fullName, userName } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "Email already registered" });

    const user = new User({ email, password, fullName, userName });
    await user.save();

    res.json({ message: "Signup successful. Please login.", user });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
