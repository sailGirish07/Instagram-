const Post = require("../models/post");
const User = require("../models/user");
const Notification = require("../models/notification");
// const message = require("../models/message");
// const mongoose = require('mongoose');

// Create a post
exports.createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "No media file uploaded" });
    }
    const filePath = `/uploads/${req.file.filename}`;

    //  // Determine media type
    // const fileType = req.file.mimetype.startsWith("video/") ? "video" : "image";

    // const post = new Post({
    //   caption,
    //   media: { url: filePath, type: fileType },
    //   user: req.userId,
    // });

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
exports.getSavedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: "savedPosts",
      populate: { path: "user", select: "userName profilePic" },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.savedPosts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//Feed
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.aggregate([
      { $sort: { createdAt: -1 } }, // Sort posts by latest first

      // Lookup to get the post's user details
      {
        $lookup: {
          from: "users",            // users collection
          localField: "user",       // reference field in Post
          foreignField: "_id",     // target field in users
          as: "userDetails"         // output array field
        }
      },
      { $unwind: "$userDetails" },  // Flatten the array to object

      // Lookup to get details of all users who commented on the post
      {
        $lookup: {
          from: "users",
          localField: "comments.user",
          foreignField: "_id",
          as: "commentUsers"
        }
      },

      // Map comments to embed user details
      {
        $addFields: {                   //Replace comment array to new transformed array 
          comments: {
            $map: {                     //For each comment produce a new object
              input: "$comments",
              as: "comment",                   //variable for each comment
              in: {                            //each comment will look like after transformation
                _id: "$$comment._id",
                text: "$$comment.text",
                createdAt: "$$comment.createdAt",
                user: {                         //find matching user 
                  $arrayElemAt: [               // Extract the first match 
                    {
                      $filter: {                //Filter array to find correct user
                        input: "$commentUsers",       //all users who comment
                        as: "cu",                     //variable for user 
                        cond: { $eq: ["$$cu._id", "$$comment.user"] }
                      }
                    },
                    0                         //First matching user 
                  ]
                }
              }
            }
          }
        }
      },

      // Shape the output structure
      {
        $project: {
          caption: 1,
          media: 1,
          likes: 1,
          createdAt: 1,
          user: {
            userName: "$userDetails.userName",
            profilePic: "$userDetails.profilePic"
          },
          comments: 1
        }
      }
    ]);

    res.json(posts);
  } catch (err) {
    console.error("Get posts aggregation error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
