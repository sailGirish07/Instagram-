const User = require("../models/user");
const Post = require("../models/post");
const { default: mongoose } = require("mongoose");

// Logged-in user profile
exports.getProfile = async (req, res) => {
  try {
    // const user = await User.findById(req.userId, "-password");
    // if (!user) return res.status(404).json({ message: "User not found" });
    // res.json(user);
    const userId = mongoose.Types.ObjectId(req.userId);

    const result = await User.aggregate([
      {$match : {_id: userId}},
      {$project : {
        password : 0
      }},
    ]);

    if(!result || result.length === 0)
      return res.status(400).json({message: "User not found"});
    res.json(result[0]);
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
    // const posts = await Post.find({ user: req.userId }).sort({ createdAt: -1 });
    const posts = await Post.aggregate([
      {$match : {user : req.userId}},
      {$sort: {createdAt: -1}},
    ]);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get public profile by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.params.id);
    const result = await User.aggregate([
      {$match : {_id : userId}},
      {$project:{password : 0}},
      {
        $lookup:{
          from :"users",
          localField : "followers",
          foreignField : "_id",
          as : "followers"
        }
      },
      {
        $project : {
          followers: { userName: 1, profilePic: 1 },
          following: 1,
          fullName: 1,
          userName: 1,
          email: 1,
          createdAt: 1
        }
      },
      {
        $lookup : {
          from : "users",
          localField: "following",
          foreignField: "_id",
          as:"following"
        }
      },
      {
        $project:{
          followers: 1,
          following: { userName: 1, profilePic: 1 },
          fullName: 1,
          userName: 1,
          email: 1,
          createdAt: 1
        }
      },
      {
        $lookup : {
          from : "posts",
          let :{userId: "$_id"},
          pipeline: [
            { $match: { $expr: { $eq: ["$user", "$$userId"] } } },
            { $sort: { createdAt: -1 } } // newest posts first
          ],
          as: "posts"
        }
      }
    ]);
     if (!result || result.length === 0)
      return res.status(404).json({ message: "User not found" });

    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Search users
exports.searchUsers = async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) return res.json([]);

    const users = await User.aggregate([
      {
        $match : {
          $or : [
            { userName: { $regex: query, $options: "i" }},
             { fullName: { $regex: query, $options: "i" }},
          ],
        },S
      },
      {
        $project : {
          _id: 1,
          userName : 1,
          fullName : 1,
          profilePic: 1,
        }
      }
    ]);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });          
  }
};


// Follow User
exports.followUser = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const loggedInUserId = req.userId; 
    const userIdToFollow = req.params.userId;

    if (userIdToFollow === loggedInUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    await session.withTransaction(async () => {
      const [loggedInUser, userToFollow] = await Promise.all([
        User.findById(loggedInUserId).session(session),
        User.findById(userIdToFollow).session(session),
      ]);

      if (!loggedInUser || !userToFollow) {
        throw new Error("User not found");
      }

      // Already following check
      const isAlreadyFollowing = (loggedInUser.following || []).some(
        (f) => (f.userId || f._id).toString() === userIdToFollow
      );
      if (isAlreadyFollowing) {
        throw new Error("Already following this user");
      }

      // Add to following & followers
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

      await loggedInUser.save({ session });
      await userToFollow.save({ session });
    });

    res.json({ message: "Followed successfully" });
  } catch (err) {
    console.error("Follow user error:", err);
    res.status(400).json({ message: err.message });
  } finally {
    session.endSession();
  }
};

// Unfollow User
exports.unfollowUser = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const loggedInUserId = req.userId;
    const userIdToUnfollow = req.params.userId;

    if (userIdToUnfollow === loggedInUserId) {
      return res.status(400).json({ message: "You cannot unfollow yourself" });
    }

    await session.withTransaction(async () => {
      const [loggedInUser, userToUnfollow] = await Promise.all([
        User.findById(loggedInUserId).session(session),
        User.findById(userIdToUnfollow).session(session),
      ]);

      if (!loggedInUser || !userToUnfollow) {
        throw new Error("User not found");
      }

      loggedInUser.following = (loggedInUser.following || []).filter(
        (f) => (f.userId || f._id).toString() !== userIdToUnfollow
      );

      userToUnfollow.followers = (userToUnfollow.followers || []).filter(
        (f) => (f.userId || f._id).toString() !== loggedInUserId
      );

      await loggedInUser.save({ session });
      await userToUnfollow.save({ session });
    });

    res.json({ message: "Unfollowed successfully" });
  } catch (err) {
    console.error("Unfollow user error:", err);
    res.status(400).json({ message: err.message });
  } finally {
    session.endSession();
  }
};

// Get Followers
exports.getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch logged-in user's following list
    const loggedInUser = await User.findById(req.userId).select("following");
    const loggedInFollowing = loggedInUser?.following || [];

    // Fetch target user's followers
    const user = await User.findById(userId).select("followers");

    if (!user) return res.status(404).json({ message: "User not found" });

    // Normalize and add isFollowedByMe flag
    const followersWithFlag = (user.followers || []).map((f) => ({
      userId: f.userId,
      userName: f.userName,
      profilePic: f.profilePic,
      fullName: f.fullName,
      isFollowedByMe: loggedInFollowing.some((follow) =>
        follow.userId.equals(f.userId)
      ),
    }));

    res.json(followersWithFlag);
  } catch (err) {
    console.error("Get followers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Following
exports.getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch logged-in user's following list
    const loggedInUser = await User.findById(req.userId).select("following");
    const loggedInFollowing = loggedInUser?.following || [];

    // Fetch target user's following
    const user = await User.findById(userId).select("following");

    if (!user) return res.status(404).json({ message: "User not found" });

    // Normalize and add isFollowedByMe flag
    const followingWithFlag = (user.following || []).map((f) => ({
      userId: f.userId,
      userName: f.userName,
      profilePic: f.profilePic,
      fullName: f.fullName,
      isFollowedByMe: loggedInFollowing.some((follow) =>
        follow.userId.equals(f.userId)
      ),
    }));

    res.json(followingWithFlag);
  } catch (err) {
    console.error("Get following error:", err);
    res.status(500).json({ message: "Server error" });
  }
};