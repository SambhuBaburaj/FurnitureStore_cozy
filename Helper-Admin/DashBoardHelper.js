require("dotenv").config();
const mongoCategory = require("../Connections/AdminSchema");
const ProductStore=require("../Connections/AdminSchema").Products
const multer = require('multer');
const MongoOrder=require("../Connections/UserSchema").OrderDetails
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const MongoUserData=require("../Connections/UserSchema").user_data
const MongoCategory=require("../Connections/AdminSchema").MainCategory
const MongoCart=require("../Connections/UserSchema").CartData



const usercount=async (req,res)=>
{
    console.log(req.query);

    const usercount=await MongoUserData.aggregate([{$match:{date: {
        $gte: new Date(
            (new Date().getTime() - (req.query.day * 24 * 60 * 60 * 1000))
        ) 
    }  }}])
    console.log(usercount.length);

    console.log( (new Date().getTime() - (req.query.day * 24 * 60 * 60 * 1000)));
    res.json(usercount.length)
}


const revenuecount=async (req,res)=>
{
console.log(req.query);
const revenue=await MongoOrder.aggregate([{$match:{$and:[  {date: {
    $gte: new Date(
        (new Date().getTime() - (req.query.day * 24 * 60 * 60 * 1000))
    ) 
}  },{CancelOrder:0},{PaymentStatus:"Success"}  ]}}])
let total=0;
revenue.forEach((element)=>
{
total=total+element.TotalAmount
})

res.json(total)

}

const ordercount=async (req,res)=>
{
    const ordercount=await MongoOrder.aggregate([{$match:{$and:[  {date: {
        $gte: new Date(
            (new Date().getTime() - (req.query.day * 24 * 60 * 60 * 1000))
        ) 
    }  },{CancelOrder:0}  ]}}])


  res.json(ordercount.length)
}



const cancelcount=async(req,res)=>
{
    const ordercount=await MongoOrder.aggregate([{$match:{$and:[  {date: {
        $gte: new Date(
            (new Date().getTime() - (req.query.day * 24 * 60 * 60 * 1000))
        ) 
    }  },{CancelOrder:1}  ]}}])
    
    res.json(ordercount.length)



}


const linechart=async(req,res)=>
{

const years=await MongoOrder.aggregate([{$match:{$and:[{CancelOrder:0},{DeliveryStatus:"delivered"}]}   },{$project:{year:{$year:"$realDate"},TotalAmount:1}},{$group:{_id:'$year',sum:{$sum:'$TotalAmount'}}},{$sort:{_id:1}}])

console.log(years);
let y=0,count=0,yearcount=[],revenue=[];

for(i=years[0]._id;i<=years[years.length-1]._id;i++)
{
if(i==years[y]._id)
{

    yearcount[count]=i
    revenue[count]=years[y].sum
count++
y++;
}
else{
    yearcount[count]=i
    revenue[count]=0;
    count++
}

}



res.json(
    {
years:yearcount,

revenue:revenue
    }
)

}


const donutchart=async (req,res)=>
{


    const cod=await MongoOrder.aggregate([{$match:{paymentMethod:"COD",PaymentStatus:"Success"}},{$group:{_id:"$paymentMethod",sum:{$sum:"$TotalAmount"}}}])
const razer=await MongoOrder.aggregate([{$match:{paymentMethod:"RazorPay",PaymentStatus:"Success"}},{$group:{_id:"$paymentMethod",sum:{$sum:"$TotalAmount"}}}])
const paypal=await MongoOrder.aggregate([{$match:{paymentMethod:"PayPal",PaymentStatus:"Success"}},{$group:{_id:"$paymentMethod",sum:{$sum:"$TotalAmount"}}}])

    const chartdata=[cod[0].sum,razer[0].sum,paypal[0].sum]
    console.log(chartdata);
res.json(chartdata)


}

module.exports={usercount,
    revenuecount,ordercount,cancelcount,linechart,donutchart
}