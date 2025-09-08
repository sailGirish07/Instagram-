const Post = require("../models/post");
const User = require("../models/user");
const Notification = require("../models/notification");

// Create a post
exports.createPost = async (req, res) => {
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
    console.error("Create post error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get profile posts
exports.getProfilePosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Profile posts error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all posts (feed)
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "userName profilePic")
      .populate("comments.user", "userName profilePic")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Get posts error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Like/unlike post
exports.toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const userIndex = post.likes.indexOf(req.userId);

    if (userIndex === -1) {
      post.likes.push(req.userId);

      if (post.user.toString() !== req.userId) {
        const senderUser = await User.findById(req.userId);
        await Notification.create({
          userId: post.user,
          fromUser: req.userId,
          message: `${senderUser.userName} liked your post`,
          type: "like",
          relatedId: post._id,
        });
      }
    } else {
      post.likes.splice(userIndex, 1);
    }

    await post.save();
    res.json({ likes: post.likes.length });
  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add comment
exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    if (!text.trim())
      return res.status(400).json({ message: "Comment cannot be empty" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = { user: req.userId, text, createdAt: new Date() };
    post.comments.push(comment);
    await post.save();

    if (post.user.toString() !== req.userId) {
      const senderUser = await User.findById(req.userId);
      await Notification.create({
        userId: post.user,
        fromUser: req.userId,
        message: `${senderUser.userName} commented on your post`,
        type: "comment",
        relatedId: post._id,
      });
    }

    res.json(comment);
  } catch (err) {
    console.error("Comment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
