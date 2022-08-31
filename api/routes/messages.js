const router = require("express").Router();
const MessageModel = require("../model/message");

router.post("/", async (req, res) => {
  try {
    
    const message = await MessageModel.findOne({
      conversationId: req.body.conversationId,
    });
    if (!message) {
      const messagesave = await new MessageModel({
        conversationId: req.body.conversationId,
        messages: [
          {
            sender: req.user._id,
            time: new Date().toUTCString(),
            message: req.body.message,
          },
        ],
      });
      await messagesave.save();
    } else {
      await MessageModel.findOneAndUpdate(
        { conversationId: req.body.conversationId },
        {
          $push: {
            messages: {
              sender: req.user._id,
              time: new Date().toUTCString(),
              message: req.body.message,
            },
          },
        },
        { new: true }
      );
    }
    const messag = {
      sender: req.user._id,
      time: new Date().toUTCString(),
      message: req.body.message,
    };
    return res.status(200).json({ message: messag });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await MessageModel.find({
      conversationId: req.params.conversationId,
    }).populate("conversationId");
    return res.status(200).json({ messages: messages });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
