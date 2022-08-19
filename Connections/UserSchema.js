const mongoose=require("mongoose");
const { stringify } = require("uuid");
// user schema
const User_Schema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    phone:Number,
    isBlocked:Number
  });
  const user_data = mongoose.model("user_data", User_Schema);

//Cart schema
const Cart_Schema=new mongoose.Schema({
UserId:String,
product:[{
  ItemId:String,
  Quantity:Number
}
]


})
const CartData=mongoose.model("CartData",Cart_Schema)
 


module.exports = {user_data,CartData}