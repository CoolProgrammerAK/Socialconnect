const router = require("express").Router();
const NotificationModel = require("../model/notification");

router.post("/", async (req, res) => {
  try {
    const notification = await NotificationModel.findOne({
      user: req.body.userid,
    });

    if (!notification) {
      const notificationsave = await new NotificationModel({
        user: req.body.userid,
        notifications: [
          {
            sender: req.body.sender,
            time: req.body.time,
            notificationType: req.body.type,
            postId:req.body.postId
          },
        ],
      });
      await notificationsave.save();
    } else {
      await NotificationModel.findOneAndUpdate(
        { user: req.body.userid },
        {
          $push: {
            notifications: {
              sender: req.body.sender,
              time: req.body.time,
              notificationType: req.body.type,  postId:req.body.postId
            },
          },
        },
        { new: true }
      );
    }
    const notify = {
      sender: req.body.sender,
      time: new Date().toUTCString(),
      notificationType: req.body.type,
    };
    return res.status(200).json({ notification: notify });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/:userid", async (req, res) => {
  try {
    const notifications = await NotificationModel.findOne({
      user: req.params.userid,
    }).populate("user notifications.sender");
    if (notifications) {
      return res
        .status(200)
        .json({ notifications: notifications.notifications });
    } else {
      return res.status(200).json({ notifications: [] });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put("/", async (req, res) => {
  try {
    const notifications = await NotificationModel.findOne({
      user: req.body.id,
    }).populate("user notifications.sender");
    if (notifications) {
      const latestnotification = await NotificationModel.findOneAndUpdate(
        { user: req.body.id},
        {
          $pull: {
            notifications: {
              sender: req.body.sender,
              notificationType: req.body.type,
              postId:req.body.postId
            },
          },
        },
        { new: true }
      );
      return res.status(200).json({ notifications: latestnotification });
    } else {
      return res.status(200).json({ notifications: [] });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put("/read", async (req, res) => {
  try {
    const notifications = await NotificationModel.findOne({
      user: req.user._id,
    }).populate("user notifications.sender");
    if (notifications) {
      if(req.body.type2!=""){
        await NotificationModel.update({
          user: req.user._id
         
        },{ 
          $set:{
          "notifications.$[elem].read": true,
        },
      },{
        multi:true,
        arrayFilters:[{"elem.notificationType": req.body.type2,"elem.read":false}]
      }
        );
      }
      const latestnotification = await NotificationModel.update({
        user: req.user._id
       
      },{ 
        $set:{
        "notifications.$[elem].read": true,
      },
    },{
      multi:true,
      arrayFilters:[{"elem.notificationType": req.body.type,"elem.read":false}]
    }
      );

      return res.status(200).json({ notifications: latestnotification });
    } else {
      return res.status(200).json({ notifications: [] });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
