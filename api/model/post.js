const mongoose = require("mongoose");
const Schema=mongoose.Schema
const PostSchema = new mongoose.Schema(
  {
    
    user:{
      type:Schema.Types.ObjectId,
      ref:'users',
      required:true
    },
    img: {
      type: String,
    },
    desc:{
      type:String,
      max:500
    },
    likes:{
      type:Array,
      default:[]
    },
    comments:[
      {
        _id:{type:String},
        userProfile:{
          type:Schema.Types.ObjectId,
          ref:'users',required:true
        },
        time:{type:Date},
        comment:{type:String,required:true}
      },{_id:false}
    ]

  },
  { timestamps: true }
);

var usermodel = mongoose.model("posts", PostSchema);
module.exports = usermodel;
