const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },

    notifications: [
      {
        sender: { type: Schema.Types.ObjectId, ref: "users" },
        time: { type: Date },
        notificationType: { type: String, enum: ["Chat", "Follow", "Like","Comment"] },
        read:{type:Boolean,default:false},
        postId:{type:String,default:""},
        
          _id:false
          
      },
     
    ],
  },
  { timestamps: true }
);

var notificationmodel = mongoose.model("notification", NotificationSchema);
module.exports = notificationmodel;
