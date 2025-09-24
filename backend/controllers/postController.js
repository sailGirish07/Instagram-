const Post = require("../models/post");
const User = require("../models/user");
const Notification = require("../models/notification");
const mongoose = require('mongoose');

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
    if (!user) return res.status(404).json({ message: "User not found" });

    user.posts.push(post._id);
    await user.save();

    res.json(user);
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get profile posts
exports.getProfilePosts = async (req, res) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    // Fetch posts of logged-in user
    const posts = await Post.find({ user: req.userId })
      .populate("user", "userName profilePic") // include user info
      .sort({ createdAt: -1 });

    // Normalize media for frontend
    const normalizedPosts = posts.map((post) => {
      let mediaType = "image";
      if (post.media && post.media.toLowerCase().endsWith(".mp4")) {
        mediaType = "video";
      }
      return {
        ...post.toObject(),
        media: { url: post.media, type: mediaType },
      };
    });

    console.log("Profile posts found:", normalizedPosts.length);

    res.json(normalizedPosts);
  } catch (err) {
    console.error("Profile posts error:", err);
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

    if (!text?.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Create comment
    const comment = {
      user: req.userId,
      text,
      createdAt: new Date(),
    };
    post.comments.push(comment);
    await post.save();

    // Populate only the last comment's user
    const populatedComment = await post.populate({
      path: "comments.user",
      select: "userName profilePic",
    });

    const newComment =
      populatedComment.comments[populatedComment.comments.length - 1];

    // Create notification if commenting on someone else's post
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
    res.json(newComment); // send populated comment
  } catch (err) {
    console.error("Comment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all comments for a post
exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate(
      "comments.user",
      "userName profilePic"
    );
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post.comments);
  } catch (err) {
    console.error("Get comments error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Toggle Save Post
exports.toggleSavePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId; // set by auth middleware

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const postIndex = user.savedPosts.findIndex(
      (id) => id.toString() === postId
    );

    let saved;
    if (postIndex === -1) {
      // Save post
      user.savedPosts.push(postId);
      saved = true;
    } else {
      // Unsave post
      user.savedPosts.splice(postIndex, 1);
      saved = false;
    }

    await user.save();

    res.json({ saved }); // Return the new saved state
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch all saved posts
// exports.getSavedPosts = async (req, res) => {
//   try {
//     const user = await User.findById(req.userId).populate({
//       path: "savedPosts",
//       populate: { path: "user", select: "userName profilePic" },
//     });
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user.savedPosts);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

exports.getSavedPosts = async(req,res) => {
  try{
    const userId = new mongoose.Types.ObjectId(req.userId);

    const pipeline = [
      {$match : {_id : userId}},
      {
        $lookup : {
          from : "posts",
          localField : "savedPosts",
          foreignField: "_id",
          as : "savedPostsData",
        },
      },
      {$unwind :"$savedPostsData"},
      {
        $lookup : {
          from : "users",
          localField :"savedPostsData.user",
          foreignField : "_id",
          as : "SavedPostsUser",
        },
      },
      {$unwind :{ path: "$savedPostsUser", preserveNullAndEmptyArrays: true }},
      {
        $project : {
          _id : "$savedPostsData._id", 
          caption : "$savedPostsData.caption",
          media : "$savedPostsData.media",
          createdAt :"$savedPostsData.createdAt",
          user : {
            _id : "$savedPostsUser._id",
            userName : "$savedPostsUser.userName",
            profilePic :"$savedPostsUser.profilePic",
          },
          likes : "$savedPostsData.likes",
          comments : "$savedPostsData.comments",
        },
      },
      {
        $group : {
          _id : null,
          savedPosts : {$push : "$$ROOT"} 
        }
      }
    ];

      const result = await User.aggregate(pipeline);

    if(!result.length || !Array.isArray(result[0].savedPosts) ){
      return res.json([]);
    }

    res.json(result[0].savedPosts);
  }catch(err){
    console.error("Get saved posts error", err);
    res.status(500).json({message: "Server Error"});
  }
}
//Feed
// exports.getAllPosts = async (req, res) => {
//   try {
//     const posts = await Post.find()
//       .populate("user", "userName profilePic")
//       .populate("comments.user", "userName profilePic")
//       .sort({ createdAt: -1 });
//     res.json(posts);
//   } catch (err) {
//     console.error("Get posts error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


exports.getAllPosts = async(req, res) => {
  try{
    const pipeline = [
      {$sort : {createdAt : -1}}  ,  
      {
        $lookup : {
          from : "users",
          localField: "user",
          foreignField : "_id",
          as:"user"
        }
      },
      {$unwind: "$user"},
      {$unwind : {path: "$comments", preserveNullAndEmptyArrays: true}},
      {
        $lookup: {
          from :"users",
          localField : "comments.user",
          foreignField: "_id",
          as : "comments.user"
        }
      },
      {$unwind : {path: "$comments.user", preserveNullAndEmptyArrays : true}},
      {
        $group : {
          _id: "$_id",
          caption: { $first: "$caption" },
          media: { $first: "$media" },
          likes: { $first: "$likes" },
          createdAt: { $first: "$createdAt" },
          user: { 
            $first: {
              _id: "$user._id",
              userName: "$user.userName",
              profilePic: "$user.profilePic"
            }
          },
          comments: { 
            $push: {
              $cond: {
                if: "$comments.user", 
                then: {
                  _id: "$comments._id",
                  text: "$comments.text",
                  createdAt: "$comments.createdAt",
                  user: {
                    _id: "$comments.user._id",
                    userName: "$comments.user.userName",
                    profilePic: "$comments.user.profilePic"
                  }
                },
                else: "$$REMOVE"
              }
            } 
          }
        }
      },
      {
        $project: {
          _id: 1,
          caption: 1,
          media: 1,
          likes: 1,
          comments: 1,
          user: 1,
          createdAt: 1,
          updatedAt: 1, 
        }
      }
    ];
    const posts = await Post.aggregate(pipeline);
    res.json(posts);
  }catch(err){
    console.log("Get posts error",err);
    res.status(500).json({message : "Server Error"});
  }
}