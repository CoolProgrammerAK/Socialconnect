const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MessageSchema = new mongoose.Schema(
{
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "conversation",
    },
    messages:[
      {
        sender:{ type: String},
        time:{type:Date},
        message:{type:String}

      }
    ]
  },
  { timestamps: true }
);

var messagemodel = mongoose.model("message", MessageSchema);
module.exports = messagemodel;
