const express = require("express");
const connectDb = require("./config/db");
const cors = require("cors");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const Post = require("./models/post");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
require('dotenv').config();

const app = express();

connectDb();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // save inside /uploads
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});


const upload = multer({ storage });

const authMiddleware = (req, res, next) => {
  console.log("Headers received:", req.headers);
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

//Signup
app.post("/signup", async (req, res) => {
  try {
    const { email, password, fullName, userName } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "Email already registered" });

    const user = new User({ email, password, fullName, userName });
    await user.save();

    res.json({
      message: "Signup successful. Please login to continue.",
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        userName: user.userName,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
});

//Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "invalide Credentials" });

    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch)
      return res.status(400).json({ message: "Invalide Credentials" });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login Successful", token: token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//Forgot Password
app.post("/forgot-pass", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Error while reseting the password", err);
  }
});


app.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId, "-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Make profilePic a full URL
    const profileUser = user.toObject();
    if (profileUser.profilePic) {
      profileUser.profilePic = `http://localhost:8080${profileUser.profilePic}`;
    }

    res.json(profileUser);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// Update Profile with file upload
app.put(
  "/profile",
  authMiddleware,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const { fullName, userName, bio } = req.body; // text fields
      const profilePicPath = req.file
        ? `/uploads/${req.file.filename}`
        : undefined; // uploaded file

      const user = await User.findById(req.userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      // Update fields if provided
      if (fullName) user.fullName = fullName;
      if (userName) user.userName = userName;
      if (bio) user.bio = bio;
      if (profilePicPath) user.profilePic = profilePicPath;

      await user.save();

      res.json({ message: "Profile updated successfully", user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


app.post("/posts", authMiddleware, upload.single("media"), async (req, res) => {
  try {
    const { caption } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "No media file uploaded" });
    }
    const filePath = `/uploads/${req.file.filename}`; 
    const post = new Post({
      caption,
      media: filePath,
      user: req.userId,
    });

    await post.save();
    const user = await User.findById(req.userId);
    user.posts.push(post._id);
    await user.save();

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


app.get("/profile-posts", authMiddleware, async (req, res) => {
  try {
    // Find posts for the user
    const posts = await Post.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Get all posts (feed)
app.get("/posts", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "userName profilePic") // get username & profile pic
      .populate("comments.user", "userName profilePic")
      .sort({ createdAt: -1 }); // latest first

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// const user = new User({
//     email : 'pcl@gmail.com',
//     password : 'abcd',
//     fullName : 'Pranav Panchal',
//     userName : 'pranav_photography'
// });

// user.save().then((res) => {
//     console.log('User saved', res);
// }).catch ((err) => {
//     console.log(err);
// });



const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
