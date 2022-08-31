const router = require("express").Router();
const Post = require("../model/post");
const User = require("../model/user");
const Auth = require("../middleware/admin");
const {v4:uuidv4}=require('uuid')
router.post("/", async (req, res) => {
  try {
    const post = new Post({
      user: req.user._id,
      ...req.body,
    });
    const post2 = await post.save();
    const postdata = await Post.findById(post2._id).populate("user");
    return res
      .status(200)
      .json({ posts: postdata, msg: "Post has been published" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("user");
    if (post.user._id == req.user._id) {
      await post.updateOne({
        ...req.body,
      });
      return res.status(200).json({ msg: "Post has been updated" });
    } else {
      throw { status: 422, message: "You can update only your post" };
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("user");
    if (post.user._id == req.user._id) {
      await post.deleteOne();
      return res.status(200).json({ msg: "The post has been deleted" });
    } else {
      throw { status: 422, message: "You can delete only your post" };
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post.likes.includes(req.user._id)) {
      await post.updateOne({ $push: { likes: req.user._id } });
      return res.status(200).json({ msg: "The post has been liked" });
    } else {
      await post.updateOne({ $pull: { likes: req.user._id } });
      return res.status(200).json({ msg: "The post has been disliked" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put("/:id/comment", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
   const newid=uuidv4()
    await post.updateOne({
      $push: {
        comments: {
    _id:newid,
          comment: req.body.comment,
          userProfile: req.user._id,
          time: new Date().toUTCString(),
        },
      },
    });
    return res.json({ msg: "Comment done",id:newid });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/:id/comment", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "comments.userProfile"
    );

    const { comments } = post._doc;

    const finalcomments = await Promise.all(
      comments.map(async(comment) => {
        const user =await User.findById(comment.userProfile);
        if (user) {
          return comment;
        } else {
          await Post.findByIdAndUpdate(req.params.id, {
            $pull: { comments: { _id: comment._id } },
          });
          return null;
        }
      })
    );
    let commentslist = [];
    finalcomments.map((comment) => {
      if(comment!=null){
      commentslist.push(comment);
    }});
    return res.json({ comments: commentslist});
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


router.delete("/:id/comment", async (req, res) => {
  try {
    if (req.user._id === req.body.userid) {
      const post = await Post.findById(req.params.id);
      await post.updateOne({
        $pull: {
          comments: {
            _id: req.body.id,
          },
        },
        
      });
      return res.status(200).json({ msg: "Comment deleted" });
    } else {
      throw { status: 422, message: "You can delete only your comment" };
    }
  } catch (error) {
    return res.status(422).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("user");

    return res.status(200).json({ posts: post });
  } catch (error) {
    return res.status(505).json({ error: error.message });
  }
});
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userposts = await Post.find({
      user: { _id: req.params.userId },
    }).populate("user");

    const friendposts = await Promise.all(
      currentUser.following.map((id) => {
        return Post.find({ user: { _id: id } }).populate("user");
      })
    );
    return res.status(200).json({ posts: userposts.concat(...friendposts) });
  } catch (error) {
    return res.status(505).json({ error: error.message });
  }
});
router.get("/profile/:userid", async (req, res) => {
  try {
    const userposts = await Post.find({
      user: { _id: req.params.userid },
    }).populate("user");

    return res.status(200).json({ posts: userposts });
  } catch (error) {
    return res.status(505).json({ error: error.message });
  }
});

module.exports = router;
