// const express = require("express");
// const connectDb = require("./config/db");
// const cors = require("cors");
// const bcrypt = require("bcrypt");
// const User = require("./models/user");
// const Post = require("./models/post");
// const Message = require("./models/message");
// const Notification = require("./models/notification");
// const jwt = require("jsonwebtoken");
// const multer = require("multer");
// const path = require("path");
// require("dotenv").config();

// const app = express();

// // Connect to DB
// connectDb();

// app.use(express.json());
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

// // Serve uploads
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Multer config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) =>
//     cb(null, Date.now() + "-" + file.originalname),
// });
// const upload = multer({ storage });

// // Middleware: Auth
// const authMiddleware = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader)
//     return res.status(401).json({ message: "No token provided" });

//   const token = authHeader.split(" ")[1];
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.userId;
//     next();
//   } catch {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

// // Authentication

// // Signup
// app.post("/signup", async (req, res) => {
//   try {
//     const { email, password, fullName, userName } = req.body;
//     const existing = await User.findOne({ email });
//     if (existing)
//       return res.status(400).json({ error: "Email already registered" });

//     const hashedPass = await bcrypt.hash(password, 10);
//     const user = new User({ email, password: hashedPass, fullName, userName });
//     await user.save();

//     res.json({
//       message: "Signup successful. Please login to continue.",
//       user: {
//         id: user._id,
//         email: user.email,
//         fullName: user.fullName,
//         userName: user.userName,
//       },
//     });
//   } catch (err) {
//     console.error("Signup error:", err);
//     res.status(500).json({ error: "Signup failed" });
//   }
// });

// // Login
// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     const passMatch = await bcrypt.compare(password, user.password);
//     if (!passMatch)
//       return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign(
//       { userId: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.status(200).json({ message: "Login Successful", token });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Forgot Password
// app.post("/forgot-pass", async (req, res) => {
//   try {
//     const { email, newPassword } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "User not found" });

//     const hashedPass = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPass;
//     await user.save();

//     res.json({ message: "Password reset successfully" });
//   } catch (err) {
//     console.error("Error resetting password:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Profile

// app.get("/profile", authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId, "-password");
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const profileUser = user.toObject();
//     if (profileUser.profilePic) {
//       profileUser.profilePic = `${req.protocol}://${req.get("host")}${
//         profileUser.profilePic
//       }`;
//     }

//     res.json(profileUser);
//   } catch {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// app.put(
//   "/profile",
//   authMiddleware,
//   upload.single("profilePic"),
//   async (req, res) => {
//     try {
//       const { fullName, userName, bio } = req.body;
//       const profilePicPath = req.file ? `/uploads/${req.file.filename}` : undefined;

//       const user = await User.findById(req.userId);
//       if (!user) return res.status(404).json({ message: "User not found" });

//       if (fullName) user.fullName = fullName;
//       if (userName) user.userName = userName;
//       if (bio) user.bio = bio;
//       if (profilePicPath) user.profilePic = profilePicPath;

//       await user.save();
//       res.json({ message: "Profile updated successfully", user });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // Posts

// app.post("/posts", authMiddleware, upload.single("media"), async (req, res) => {
//   try {
//     const { caption } = req.body;
//     if (!req.file)
//       return res.status(400).json({ message: "No media file uploaded" });

//     const post = new Post({
//       caption,
//       media: `/uploads/${req.file.filename}`,
//       user: req.userId,
//     });

//     await post.save();
//     const user = await User.findById(req.userId);
//     user.posts.push(post._id);
//     await user.save();

//     res.json(post);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// app.get("/profile-posts", authMiddleware, async (req, res) => {
//   try {
//     const posts = await Post.find({ user: req.userId }).sort({ createdAt: -1 });
//     res.json(posts);
//   } catch {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// app.get("/posts", authMiddleware, async (req, res) => {
//   try {
//     const posts = await Post.find()
//       .populate("user", "userName profilePic")
//       .populate("comments.user", "userName profilePic")
//       .sort({ createdAt: -1 });

//     res.json(posts);
//   } catch {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Like / Unlike
// app.put("/posts/:postId/like", authMiddleware, async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const post = await Post.findById(postId);
//     if (!post) return res.status(404).json({ message: "Post not found" });

//     const userIndex = post.likes.indexOf(req.userId);

//     if (userIndex === -1) {
//       post.likes.push(req.userId);

//       if (post.user.toString() !== req.userId) {
//         const senderUser = await User.findById(req.userId);
//         await Notification.create({
//           userId: post.user,
//           fromUser: req.userId,
//           message: `${senderUser.userName} liked your post`,
//           type: "like",
//           relatedId: post._id,
//           read: false,
//         });
//       }
//     } else {
//       post.likes.splice(userIndex, 1);
//     }

//     await post.save();
//     res.json({ likes: post.likes.length });
//   } catch {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Comment
// app.post("/posts/:postId/comment", authMiddleware, async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const { text } = req.body;
//     if (!text.trim())
//       return res.status(400).json({ message: "Comment cannot be empty" });

//     const post = await Post.findById(postId);
//     if (!post) return res.status(404).json({ message: "Post not found" });

//     const comment = { user: req.userId, text, createdAt: new Date() };
//     post.comments.push(comment);
//     await post.save();

//     if (post.user.toString() !== req.userId) {
//       const senderUser = await User.findById(req.userId);
//       await Notification.create({
//         userId: post.user,
//         fromUser: req.userId,
//         message: `${senderUser.userName} commented on your post`,
//         type: "comment",
//         relatedId: post._id,
//         read: false,
//       });
//     }

//     res.json(comment);
//   } catch {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Search Profile

// app.get("/search", authMiddleware, async (req, res) => {
//   try {
//     const { query } = req.query;
//     if (!query) return res.json([]);

//     const users = await User.find({
//       $or: [
//         { userName: { $regex: query, $options: "i" } },
//         { fullName: { $regex: query, $options: "i" } },
//       ],
//     }).select("userName fullName profilePic");

//     const formatted = users.map((u) => ({
//       ...u.toObject(),
//       profilePic: u.profilePic
//         ? `${req.protocol}://${req.get("host")}${u.profilePic}`
//         : null,
//     }));

//     res.json(formatted);
//   } catch {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// app.get("/user/:id", authMiddleware, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await User.findById(id, "-password");
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const profileUser = user.toObject();
//     if (profileUser.profilePic) {
//       profileUser.profilePic = `${req.protocol}://${req.get("host")}${
//         profileUser.profilePic
//       }`;
//     }

//     const posts = await Post.find({ user: id }).sort({ createdAt: -1 });
//     res.json({ user: profileUser, posts });
//   } catch {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Message

// app.post("/messages/:receiverId", authMiddleware, async (req, res) => {
//   try {
//     const { receiverId } = req.params;
//     const { text } = req.body;
//     if (!text || !text.trim())
//       return res.status(400).json({ message: "Message cannot be empty" });

//     const receiverUser = await User.findById(receiverId);
//     if (!receiverUser) return res.status(404).json({ message: "Receiver not found" });

//     const senderUser = await User.findById(req.userId);

//     const message = new Message({ sender: req.userId, receiver: receiverId, text });
//     await message.save();

//     await Notification.create({
//       userId: receiverId,
//       fromUser: req.userId,
//       message: `${senderUser.userName} sent you a message`,
//       type: "message",
//       relatedId: message._id,
//       read: false,
//     });

//     await message.populate([
//       { path: "sender", select: "userName profilePic" },
//       { path: "receiver", select: "userName profilePic" },
//     ]);

//     res.json(message);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// app.get("/messages/conversations", authMiddleware, async (req, res) => {
//   try {
//     const userId = req.userId;
//     const messages = await Message.find({
//       $or: [{ sender: userId }, { receiver: userId }],
//     })
//       .populate("sender", "userName profilePic")
//       .populate("receiver", "userName profilePic")
//       .sort({ createdAt: -1 });

//     const convMap = {};
//     messages.forEach((msg) => {
//       if (!msg.sender || !msg.receiver) return;
//       const otherId =
//         msg.sender._id.toString() === userId
//           ? msg.receiver._id.toString()
//           : msg.sender._id.toString();
//       if (!convMap[otherId]) {
//         convMap[otherId] = {
//           participants: [msg.sender, msg.receiver],
//           lastMessage: msg,
//           loggedInUser: userId,
//         };
//       }
//     });

//     res.json(Object.values(convMap));
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// app.get("/messages/:userId", authMiddleware, async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const messages = await Message.find({
//       $or: [
//         { sender: req.userId, receiver: userId },
//         { sender: userId, receiver: req.userId },
//       ],
//     })
//       .populate("sender", "userName profilePic")
//       .populate("receiver", "userName profilePic")
//       .sort({ createdAt: 1 });

//     res.json(messages);
//   } catch {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// //Notification

// app.get("/notifications", authMiddleware, async (req, res) => {
//   try {
//     const notifications = await Notification.find({ userId: req.userId })
//       .sort({ createdAt: -1 })
//       .populate("fromUser", "userName profilePic");

//     res.json(notifications);
//   } catch {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// app.put("/notifications/:id/read", authMiddleware, async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Notification.findByIdAndUpdate(id, { read: true });
//     res.json({ message: "Notification marked as read" });
//   } catch {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// app.put("/notifications/mark-all-read", authMiddleware, async (req, res) => {
//   try {
//     await Notification.updateMany(
//       { userId: req.userId, read: false },
//       { $set: { read: true } }
//     );
//     res.json({ message: "All notifications marked as read" });
//   } catch {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// const PORT = 8080;
// app.listen(PORT, () =>
// console.log(`Server running on port ${PORT}`));

const express = require("express");
const connectDb = require("./config/db");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Connect DB
connectDb();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // frontend
    credentials: true,
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/posts", require("./routes/postRoutes"));
app.use("/messages", require("./routes/messageRoute"));
app.use("/notifications", require("./routes/notificationRoutes"));

// Route not found
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Server error", error: err.message });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
