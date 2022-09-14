const mongoose=require("mongoose");
const { stringify } = require("uuid");
// user schema
const User_Schema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    phone:Number,
    isBlocked:Number,
    date:Date
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
,  DeliveryStatus:String,
PaymentStatus:String,
  userId:mongoose.ObjectId,
  TotalAmount:Number,
  TotalQuantity:Number,
  CancelOrder:Number

  })
  const OrderDetails=mongoose.model("OrderDetails",order_schema)

const Address_schema=new mongoose.Schema({
 
  UserId:mongoose.ObjectId,
  address:{
    type:Object
  }
})
const address=mongoose.model('UserAddress',Address_schema)

  
const BannerSchema=new mongoose.Schema({
category:String,
subcategory:String,
  ProductName:String,
  Desc:String,
  Image:String


})


const BannerControl=mongoose.model("BannerControl",BannerSchema)





  module.exports = {user_data,CartData,OrderDetails,address,BannerControl}