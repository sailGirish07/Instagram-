const User = require("../models/user");
const Post = require("../models/post");
const { default: mongoose } = require("mongoose");

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
// exports.followUser = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const loggedInUserId = req.userId; // from auth middleware
//     const userIdToFollow = req.params.userId;

//     if (userIdToFollow === loggedInUserId) {
//       return res.status(400).json({ message: "You cannot follow yourself" });
//     }
//     const [loggedInUser, userToFollow] = await Promise.all([
//       User.findById(loggedInUserId).session(session),
//       User.findById(userIdToFollow).session(session),
//     ]);

//     if (!userToFollow || !loggedInUser) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     if (
//       loggedInUser.following.some((f) => f.userId.toString() === userIdToFollow)
//     ) {
//       return res.status(400).json({ message: "Already following this user" });
//     }

//     // Add to following & followers
//     loggedInUser.following.push({
//       userId: userIdToFollow,
//       userName: userToFollow.userName,
//       profilePic: userToFollow.profilePic,
//       fullName: userToFollow.fullName,
//     });

//     userToFollow.followers.push({
//       userId: loggedInUserId,
//       userName: loggedInUser.userName,
//       profilePic: loggedInUser.profilePic,
//       fullName: loggedInUser.fullName,
//     });

//     await loggedInUser.save({ session });
//     await userToFollow.save({ session });

//     await session.commitTransaction();
//     res.json({ message: "Followed successfully", user: userToFollow });
//   } catch (err) {
//     await session.abortTransaction();
//     console.error("Follow user error:", err);
//     res.status(500).json({ message: "Server error" });
//   } finally {
//     session.endSession();
//   }
// };
// Follow User
exports.followUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const loggedInUserId = req.userId; // from auth middleware
    const userIdToFollow = req.params.userId;

    if (userIdToFollow === loggedInUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const [loggedInUser, userToFollow] = await Promise.all([
      User.findById(loggedInUserId).session(session),
      User.findById(userIdToFollow).session(session),
    ]);

    if (!loggedInUser || !userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already following
    const isAlreadyFollowing = (loggedInUser.following || []).some(
      (f) => (f.userId || f._id).toString() === userIdToFollow
    );

    if (isAlreadyFollowing) {
      return res.status(400).json({ message: "Already following this user" });
    }

    // Add to following & followers safely
    loggedInUser.following.push({
      userId: userToFollow._id,
      userName: userToFollow.userName,
      profilePic: userToFollow.profilePic,
      fullName: userToFollow.fullName,
    });

    userToFollow.followers.push({
      userId: loggedInUser._id,
      userName: loggedInUser.userName,
      profilePic: loggedInUser.profilePic,
      fullName: loggedInUser.fullName,
    });

    // Save both users
    await loggedInUser.save({ session });
    await userToFollow.save({ session });

    // Commit transaction
    await session.commitTransaction();

    res.json({ message: "Followed successfully", user: userToFollow });
  } catch (err) {
    await session.abortTransaction();
    console.error("Follow user error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  } finally {
    session.endSession();
  }
};


//Unfollow User
// exports.unfollowUser = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const loggedInUserId = req.userId;
//     const userIdToUnfollow = req.params.userId;

//     if (userIdToUnfollow === loggedInUserId) {
//       return res.status(400).json({ message: "You cannot unfollow yourself" });
//     }

//     const [loggedInUser, userToUnfollow] = await Promise.all([
//       User.findById(loggedInUserId).session(session),
//       User.findById(userIdToUnfollow).session(session),
//     ]);

//     if (!loggedInUser || !userToUnfollow) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     loggedInUser.following = (loggedInUser.following || []).filter(
//       (f) => f.userId.toString() !== userIdToUnfollow
//     );
//     userToUnfollow.followers = (userToUnfollow.followers || []).filter(
//       (f) => f.userId.toString() !== loggedInUserId
//     );

//     await loggedInUser.save({ session });
//     await userToUnfollow.save({ session });

//     // commit transaction
//     await session.commitTransaction();

//     res.json({ message: "Unfollowed successfully", user: userToUnfollow });
//   } catch (err) {
//     await session.abortTransaction();
//     console.error("Unfollow user error:", err.message, err.stack);
//     res.status(500).json({ message: "Server error", error: err.message });
//   } finally {
//     session.endSession();
//   }
// };
// Unfollow User
exports.unfollowUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const loggedInUserId = req.userId;
    const userIdToUnfollow = req.params.userId;

    if (userIdToUnfollow === loggedInUserId) {
      return res.status(400).json({ message: "You cannot unfollow yourself" });
    }

    // Fetch both users within session
    const [loggedInUser, userToUnfollow] = await Promise.all([
      User.findById(loggedInUserId).session(session),
      User.findById(userIdToUnfollow).session(session),
    ]);

    if (!loggedInUser || !userToUnfollow) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the target user from logged-in user's following
    loggedInUser.following = (loggedInUser.following || []).filter((f) => {
      const id = f.userId || f._id;
      return id.toString() !== userIdToUnfollow;
    });

    // Remove logged-in user from target user's followers
    userToUnfollow.followers = (userToUnfollow.followers || []).filter((f) => {
      const id = f.userId || f._id;
      return id.toString() !== loggedInUserId;
    });

    // Save both users
    await loggedInUser.save({ session });
    await userToUnfollow.save({ session });

    // Commit transaction
    await session.commitTransaction();

    res.json({ message: "Unfollowed successfully", user: userToUnfollow });
  } catch (err) {
    await session.abortTransaction();
    console.error("Unfollow user error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  } finally {
    session.endSession();
  }
};


// getFollowers and getFollowing functions
exports.getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("followers");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the followers array directly (it already contains the embedded data)
    res.json(user.followers || []);
  } catch (err) {
    console.error("Get followers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("following");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the following array directly (it already contains the embedded data)
    res.json(user.following || []);
  } catch (err) {
    console.error("Get following error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
