const router = require("express").Router();
const userModel = require("../model/user");

router.get("/users/:id", async (req, res) => {
  try {
    // Find all users expect the one with the specific id & select the specified details out
    const user = await userModel.find({ _id: { $ne: req.params.id } });

    res.json(user);
  } catch (error) {
    if (error) throw error;
  }
});

module.exports = router;
