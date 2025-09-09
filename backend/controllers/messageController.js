const Message = require("../models/message");
const User = require("../models/user");
const Notification = require("../models/notification");

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const { text, post  } = req.body;

    if ((!text || !text.trim()) && !post) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    const receiverUser = await User.findById(receiverId);
    if (!receiverUser)
      return res.status(404).json({ message: "Receiver not found" });

    const senderUser = await User.findById(req.userId);

    const message = new Message({
      sender: req.userId,
      receiver: receiverId,
      text,
      post
    });
    await message.save();
  //   message = await message.populate("post", "imageUrl title"); //important
  //  res.json(message);
  
  await message.populate([
      { path: "sender", select: "userName profilePic" },
      { path: "receiver", select: "userName profilePic" },
      {path: "post", select: "imageUrl title"}
    ]);

     res.json(message);

    await Notification.create({
      userId: receiverId,
      fromUser: req.userId,
      message: `${senderUser.userName} sent you a message`,
      type: "message",
      relatedId: message._id,
      read: false,
    });

    // await message.populate([
    //   { path: "sender", select: "userName profilePic" },
    //   { path: "receiver", select: "userName profilePic" },
    //   {path: "post", select: "imageUrl title"}
    // ]);

   
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get conversations
exports.getConversations = async (req, res) => {
  try {
    const userId = req.userId;

    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "userName profilePic")
      .populate("receiver", "userName profilePic")
      .populate("post", "imageUrl title")
      .sort({ createdAt: -1 });

    const convMap = {};

    messages.forEach((msg) => {
      if (!msg.sender || !msg.receiver) return;

      const otherId =
        msg.sender._id.toString() === userId
          ? msg.receiver._id.toString()
          : msg.sender._id.toString();

      if (!convMap[otherId]) {
        convMap[otherId] = {
          participants: [msg.sender, msg.receiver],
          lastMessage: msg,
          loggedInUser: userId,
        };
      }
    });

    res.json(Object.values(convMap));
  } catch (err) {
    console.error("Conversations error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get specific chat
exports.getChat = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: req.userId, receiver: userId },
        { sender: userId, receiver: req.userId },
      ],
    })
      .populate("sender", "userName profilePic")
      .populate("receiver", "userName profilePic")
      .populate("post", "media caption")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
