const router = require("express").Router();
const messageModel = require("../model/message");

router.post("/allMessages", async (req, res) => {
  try {
    const { fromId, toId } = req.body;

    const message = await messageModel
      .find({ users: { $all: [fromId, toId] } })
      .sort({ updatedAt: 1 });

    const projectedMessage = message.map((msg) => {
      return {
        fromSelf: msg.owner.toString() === fromId,
        message: msg.message,
      };
    });

    res.json(projectedMessage);
  } catch (error) {
    if (error) throw error;
  }
});

module.exports = router;
