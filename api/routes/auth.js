const router = require("express").Router();
const User = require("../model/user");
const bcrypt = require("bcrypt");
const { createJWT } = require("../middleware/generatetoken");
const nodemailer = require("nodemailer");
const sendgridtransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");

const transport = nodemailer.createTransport(
  sendgridtransport({
    auth: {
      api_key:
        "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",
    },
  })
);
router.post("/register", async (req, res) => {
  try {
    const users = await User.findOne({ email: req.body.email });
    if (users) {
      throw { status: 422, message: "Email already exists" };
    } else if (req.body.confirmpassword !== req.body.password) {
      throw { status: 422, message: "Passwords don't match" };
    } else {
      var salt = await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(req.body.password, salt);
      const user = new User({
        username: req.body.username,
        password: hashedpassword,
        email: req.body.email,
      });
      await user.save();
      transport.sendMail({
        to: req.body.email,
        from: "avineykhetarpal01@gmail.com",
        subject: "Signup Success",
        html: "<h1>Welcome to SocialConnect Family</h1>",
      });
      return res
        .status(200)
        .json({ msg: "User successfully registered . Please Log In" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user2 = await User.findOne({ email: req.body.email });
    if (!user2) {
      throw { status: 422, message: "User not found" };
    }
    const validpassword = await bcrypt.compare(
      req.body.password,
      user2.password
    );
    if (!validpassword) {
      throw { status: 422, message: "Incorrect password" };
    }
    var token = createJWT(user2.toJSON());
    const { password, followers, ...other } = user2._doc;
    return res
      .status(200)
      .json({ msg: "Login Successful", token: token, user: other });
  } catch (error) {
    return res.status(422).json({ error: error.message });
  }
});

router.post("/reset-password", async (req, res) => {
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex");
    try {
      User.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
          return res
            .status(422)
            .json({ msg: "User doesn't exist with that email",status:422 });
        }
        user.resetToken = token;
        user.expireToken = Date.now() + 900000;
        user.save().then((result) => {
          transport.sendMail({
            to: req.body.email,
            from: "avineykhetarpal01@gmail.com",
            subject:"Password Reset",
            html: `<p>You requested for Password Reset</p><h3>
            Click on this <a href="http://localhost:3000/reset/${token}">
            link</a> to reset your password. Link will be expire after <b> 15 minutes</b>
            </h3>`,
          })
          return res
            .status(200)
            .json({ msg: "Email sent to your inbox. Click the link to reset your password." ,status:200});
        });
      });
    } catch (error) {
      return res.status(500).json({error:"Server Error",status:500})
    }
   
  });
});

router.post('/new-password',(req,res)=>{
  const password=req.body.password
  const confirmpassword=req.body.confirmpassword
  const token=req.body.token
  try {
    if (password!=confirmpassword) {
      return res
        .status(422)
        .json({ msg: "Password's don't match",status:422 });
    }
    User.findOne({resetToken:token,expireToken:{$gt:Date.now()}}).then(async(user)=>{
      if(!user){
        return res
        .status(422)
        .json({ msg: "Try Again Session expired",status:422 });
      }
      var salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);
        user.resetToken=undefined
        user.expireToken=undefined
        user.password=hashedpassword
        user.save().then(()=>{
          return res
          .status(200)
          .json({ msg: "Password changed successfully",status:200 });
        })
  
    })
  } catch (error) {
    return res
    .status(422)
    .json({ msg: error.message,status:422 });
  }
  
})
module.exports = router;
