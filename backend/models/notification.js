const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      //Receiver
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    fromUser: {
      // sender
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message: String,
    type: {
      type: String,
      enum: ["message", "like", "comment"],
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
    }, // postId or messageId
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
