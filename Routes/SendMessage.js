const router = require("express").Router();
const messageModel = require("../model/message");

router.post("/messages", async (req, res) => {
  try {
    const { fromId, toId, message } = req.body;

    const data = await messageModel.create({
      message: message,
      users: [fromId, toId],
      owner: fromId,
    });

    if (data) {
      return res.json({ status: true, data: data.message });
    }

    if (!data) {
      return res.json({ status: false, msg: "Failed to send message!" });
    }
  } catch (error) {
    if (error) throw error;
  }
});

module.exports = router;
