
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    receiver: { 
      type: mongoose.Schema.Types.ObjectId,
       ref: "User", 
       required: true
       },
    text: { 
      type: String, 
    },
     post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
