const User = require("../models/user");
const Post = require("../models/post");

// Logged-in user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId, "-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, userName, bio } = req.body;
    // const profilePicPath = req.file ? `/uploads/${req.file.filename}` : undefined;

     // ✅ Use full URL if file is uploaded
    const profilePicPath = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : undefined;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (fullName) user.fullName = fullName;
    if (userName) user.userName = userName;
    if (bio) user.bio = bio;
    if (profilePicPath) user.profilePic = profilePicPath;

    await user.save();
    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Logged-in user's posts
exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🔥 Get public profile by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "-password")
      .populate("followers", "userName profilePic")
      .populate("following", "userName profilePic");

    if (!user) return res.status(404).json({ message: "User not found" });

    const posts = await Post.find({ user: req.params.id }).sort({ createdAt: -1 });
    res.json({ user, posts });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🔥 Search users
exports.searchUsers = async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) return res.json([]);

    const users = await User.find({
      $or: [
        { userName: { $regex: query, $options: "i" } },
        { fullName: { $regex: query, $options: "i" } }
      ]
    }).select("userName fullName profilePic");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

