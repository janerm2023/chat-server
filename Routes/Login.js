const router = require("express").Router();
const userModel = require("../model/user");
const bcrypt = require("bcrypt");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email) {
      //   Check for Username in the DB
      const user = await userModel.findOne({ email });

      const hash = await bcrypt.compare(password, user.password);

      if (hash) {
        return res.json({
          status: true,
          user: {
            id: user._id,
            name: user.name,
            username: user.name.split(" ")[0],
            email: user.email,
            profile: user.profile,
          },
        });
      }
    }
  } catch (err) {
    if (err) throw err;
  }
});

module.exports = router;
