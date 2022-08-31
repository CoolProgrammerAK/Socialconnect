const router = require("express").Router();
const ConversationModel = require("../model/conversation");

router.post("/", async (req, res) => {
  try {
    const conversation = await new ConversationModel({
      memberDetails: { user1: req.body.user1, user2: req.body.user2 },
      members: [req.body.user1, req.body.user2],
    });
    const savedconvo = await conversation.save()
    return res.status(200).json({ conver: savedconvo.populate("memberDetails.user1 memberDetails.user2") });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/:userid", async (req, res) => {
  try {
    const conversation = await ConversationModel.find({
      members: {
        $in: [req.params.userid],
      },
    }).populate("memberDetails.user1 memberDetails.user2");
    return res.status(200).json({ conversation: conversation });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/find/:userid1/:userid2", async (req, res) => {
  try {
    const conversation = await ConversationModel.findOne({
      members: {
        $all: [req.params.userid1, req.params.userid2],
      },
    });
    return res.status(200).json({ conversation: conversation });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
