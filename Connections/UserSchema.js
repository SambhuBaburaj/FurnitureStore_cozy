const mongoose=require("mongoose")
const User_Schema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    phone:Number,
    Block:Number
  });
  const user_data = mongoose.model("user_data", User_Schema);




module.exports = {user_data}