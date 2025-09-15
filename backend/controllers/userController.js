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

// Get public profile by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "-password")
      .populate("followers", "userName profilePic")
      .populate("following", "userName profilePic");

    if (!user) return res.status(404).json({ message: "User not found" });

    const posts = await Post.find({ user: req.params.id }).sort({
      createdAt: -1,
    });
    res.json({ user, posts });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Search users
exports.searchUsers = async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) return res.json([]);

    const users = await User.find({
      $or: [
        { userName: { $regex: query, $options: "i" } },
        { fullName: { $regex: query, $options: "i" } },
      ],
    }).select("userName fullName profilePic");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Follow a user
exports.followUser = async (req, res) => {
  try {
    const loggedInUserId = req.userId; // from auth middleware
    const userIdToFollow = req.params.userId;

    if (userIdToFollow === loggedInUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const userToFollow = await User.findById(userIdToFollow);
    const loggedInUser = await User.findById(loggedInUserId);

    if (!userToFollow || !loggedInUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Already following
    if (loggedInUser.following.includes(userIdToFollow)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    // Add to following & followers
    loggedInUser.following.push({
      userId: userIdToFollow,
      userName: userToFollow.userName,
      profilePic: userToFollow.profilePic,
    });
    userToFollow.followers.push({
      userId: loggedInUserId,
      userName: userToFollow.userName,
      profilePic: userToFollow.profilePic,
    });
    await loggedInUser.save();
    await userToFollow.save();

    res.json({ message: "Followed successfully", user: userToFollow });
  } catch (err) {
    console.error("Follow user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
  try {
    const loggedInUserId = req.userId;
    const userIdToUnfollow = req.params.userId;

    if (userIdToUnfollow === loggedInUserId) {
      return res.status(400).json({ message: "You cannot unfollow yourself" });
    }

    const userToUnfollow = await User.findById(userIdToUnfollow);
    const loggedInUser = await User.findById(loggedInUserId);

    if (!userToUnfollow || !loggedInUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove from following & followers
    // loggedInUser.following = loggedInUser.following.filter(
    //   (id) => id.toString() !== userIdToUnfollow
    // );
    // userToUnfollow.followers = userToUnfollow.followers.filter(
    //   (id) => id.toString() !== loggedInUserId
    // );

    loggedInUser.following = loggedInUser.following.filter(
  (f) => f.userId.toString() !== userIdToUnfollow
);
userToFollow.followers = userToFollow.followers.filter(
  (f) => f.userId.toString() !== loggedInUserId
);


    await loggedInUser.save();
    await userToUnfollow.save();

    res.json({ message: "Unfollowed successfully", user: userToUnfollow });
  } catch (err) {
    console.error("Unfollow user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getFollowers = async (req, res) => {
  const user = await User.findById(req.params.userId).populate(
    "followers",
    "userName profilePic"
  ); // Get only name + pic
  res.json(user.followers);
};

exports.getFollowing = async (req, res) => {
  const user = await User.findById(req.params.userId).populate(
    "following",
    "userName profilePic"
  );
  res.json(user.following);
};
