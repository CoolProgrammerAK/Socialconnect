const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type:Array
    },
     memberDetails:
     
       {user1:{type:Schema.Types.ObjectId,ref:'users'},
       user2:{type:Schema.Types.ObjectId,ref:'users'}}
     
    
  },
  { timestamps: true }
);

var conversationmodel = mongoose.model("conversation", ConversationSchema);
module.exports = conversationmodel;
