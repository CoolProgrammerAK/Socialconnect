const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../model/user");
const Post = require("../model/post");
const Auth = require("../middleware/admin");

router.put("/:id", async (req, res) => {
  if (req.user.isAdmin || req.user._id === req.params.id) {
    try {
      await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      const currentUser2 = await User.findById(req.user._id);
      const { password, followers, ...other } = currentUser2._doc;
      return res
        .status(200)
        .json({ msg: "Account has been updated", user: other });
    } catch (error) {
      return res.status(505).json({ error: error.message });
    }
  } else {
    return res.status(422).json({ error: "You can update only your account" });
  }
});
router.put("/changepassword/:id", async (req, res) => {
  if (req.user.isAdmin || req.user._id === req.params.id) {
    try {
      const user2 = await User.findById(req.params.id);
      const validpassword = await bcrypt.compare(
        req.body.password,
        user2.password
      );
      if (!validpassword) {
        throw { status: 422, message: "Incorrect password" };
      }
      if (req.body.newpassword == req.body.confirmnewpassword) {
        const gen = await bcrypt.genSalt(10);
        req.body.newpassword = await bcrypt.hash(req.body.newpassword, gen);
        await User.findByIdAndUpdate(req.user._id, {
          password: req.body.newpassword,
        });

        return res.status(200).json({ msg: "Password changed successfully" });
      } else {
        throw { status: 422, message: "Passwords don't match" };
      }
    } catch (error) {
      return res.status(505).json({ error: error.message });
    }
  } else {
    return res.status(422).json({ error: "You can update only your account" });
  }
});
router.delete("/:id", async (req, res) => {
  if (req.user.isAdmin || req.user._id === req.params.id) {
    try {
      const user2 = await User.findById(req.params.id);
      const validpassword = await bcrypt.compare(
        req.body.password,
        user2.password
      );
      if (!validpassword) {
        throw { status: 422, message: "Incorrect password" };
      }
      await Post.deleteMany({ user: { _id: req.params.id } });
      await User.findByIdAndDelete(req.params.id);

      return res.status(200).json({ msg: "Account has been deleted" });
    } catch (error) {
      return res.status(505).json({ error: error.message });
    }
  } else {
    return res.status(422).json({ error: "You can delete only your account" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    let { password, updatedAt, ...other } = user._doc;

    return res.status(200).json({ user: other, msg: "" });
  } catch (error) {
    return res.status(505).json({ error: error.message });
  }
});

router.get("/allusers/:id", async (req, res) => {
  try {
    const user = await User.find({_id:{$ne:req.params.id}});
    

    return res.status(200).json({ users: user});
  } catch (error) {
    return res.status(505).json({ error: error.message });
  }
});


router.put("/:id/follow", async (req, res) => {
  if (req.user._id !== req.params.id || req.user.isAdmin) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user._id);
      if (user.followers.includes(req.body.userId)) {
        throw { status: 403, message: "You already follow this user" };
      } else {
        await user.updateOne({
          $push: {
            followers: req.user._id,
          },
        });
        await currentUser.updateOne({
          $push: {
            following: req.params.id,
          },
        });
        const currentUser2 = await User.findById(req.user._id);
        const { password, followers, ...other } = currentUser2._doc;
        return res
          .status(200)
          .json({ msg: "User has been followed", cuser: other });
      }
    } catch (error) {
      return res.status(505).json({ error: error.message });
    }
  } else {
    return res.status(422).json({ error: "You can't follow yourself" });
  }
});

router.put("/:id/unfollow", async (req, res) => {
  if (req.user._id !== req.params.id || req.user.isAdmin) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user._id);
      if (!user.followers.includes(req.user._id)) {
        throw { status: 403, message: "You don't follow this user" };
      } else {
        await user.updateOne({
          $pull: {
            followers: req.user._id,
          },
        });
        await currentUser.updateOne({
          $pull: {
            following: req.params.id,
          },
        });
        const currentUser2 = await User.findById(req.user._id);
        const { password, followers, ...other } = currentUser2._doc;
        return res
          .status(200)
          .json({ msg: "User has been unfollowed", cuser: other });
      }
    } catch (error) {
      return res.status(505).json({ error: error.message });
    }
  } else {
    return res.status(422).json({ error: "You can't unfollow yourself" });
  }
});
router.get("/friends/:userid", async (req, res) => {
  try {
    const user = await User.findById(req.params.userid);
    const friends = await Promise.all(
      user.following.map(async(id) => {
        const user = await User.findById(id);
        if (user) {
          return user;
        } else {
          await User.findByIdAndUpdate(req.params.userid, {
            $pull: { following: id },
          });
          return null;
        }
      })
    );
    
    let friendslist = [];
    friends.map((friend) => {
      const { _id, username, profilePicture,dob } = friend;
      friendslist.push({ _id, profilePicture, username ,dob});
    });
    return res.status(200).json({ friends: friendslist });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});



router.get("/fans/:userid", async (req, res) => {
  try {
    const user = await User.findById(req.params.userid);
    const fans = await Promise.all(
      user.followers.map(async(id) => {
        const user = await User.findById(id);
        if (user) {
          return user;
        } else {
          await User.findByIdAndUpdate(req.params.userid, {
            $pull: { followers: id },
          });
          return null;
        }
      })
    );
    
    let fanslist = [];
    fans.map((friend) => {
      const { _id, username, profilePicture,dob } = friend;
      fanslist.push({ _id, profilePicture, username ,dob});
    });
    return res.status(200).json({ fans: fanslist });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
router.put("/:id/image", async (req, res) => {
  if (req.params.id === req.user._id || req.user.isAdmin) {
    try {
      await User.findByIdAndUpdate(req.params.id, {
        profilePicture: req.body.profilePicture,
      });

      const currentUser2 = await User.findById(req.user._id);
      const { password, followers, ...other } = currentUser2._doc;
      return res
        .status(200)
        .json({ msg: "Account has been updated", cuser: other });
    } catch (error) {
      return res.status(505).json({ error: error.message });
    }
  } else {
    return res.status(422).json({ error: "You can update only your account" });
  }
});

module.exports = router;
