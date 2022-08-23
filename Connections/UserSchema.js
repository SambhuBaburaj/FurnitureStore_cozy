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
UserId: mongoose.ObjectId,
product:[{
  ItemId:mongoose.ObjectId,
  Quantity:Number
}
]


})
const CartData=mongoose.model("CartData",Cart_Schema)

const order_schema=new mongoose.Schema({

  
  DeliveryDetails:{
    type:Object
  },
  
  paymentMethod:String,
  date:Date,
  realDate:Date,
  products:Array 
,
  userId:mongoose.ObjectId,
  TotalAmount:Number,
  Status:String
  })
  const OrderDetails=mongoose.model("OrderDetails",order_schema)
  
  module.exports = {user_data,CartData,OrderDetails}