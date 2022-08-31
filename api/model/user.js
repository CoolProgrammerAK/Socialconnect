const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
    password: {
      type: String,
      required: true,
      min: 6
    },
    profilePicture: {
      type: String,
      default: "",
    },
    resetToken:String,
    expireToken:Date,
    coverPicture: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    city:{
      type:String,
      max:50
    },
    desc:{
      type:String,
      max:50
    },
    from:{
      type:String,
      max:50
    },
    relationship:{
      type:String,
      enum:["Single","Ready to Mingle","Married"]
    },
    phone:{
      type:String,
      max:10
    },
    dob:{
      type:Date
    }

  },
  { timestamps: true }
);

var usermodel = mongoose.model("users", UserSchema);
module.exports = usermodel;
