const router = require("express").Router();
const userModel = require("../model/user");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const bcrypt = require("bcrypt");
const saltRounds = 10;
const fs = require("fs");

router.post("/register", uploadMiddleware.single("files"), async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // console.log(req.body);
    // console.log(req.file);
    //   Check for Username in the DB
    const usernameChecker = await userModel.findOne({ username });
    const emailChecker = await userModel.findOne({ email });

    if (usernameChecker) {
      return res.json({
        msg: "Username already used!",
        status: false,
      });
    }

    if (emailChecker) {
      return res.json({
        msg: "Email already used!",
        status: false,
      });
    }

    const { originalname, path } = req.file;

    const ext = originalname.split(".")[1];
    const newPath = path + "." + ext;

    fs.renameSync(path, newPath);

    const hash = await bcrypt.hash(password, saltRounds);

    if (hash) {
      await userModel.create({
        name: username,
        email,
        password: hash,
        profile: newPath,
      });

      return res.json({ status: true });
    }
  } catch (err) {
    if (err) throw err;
  }
});

module.exports = router;
