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

const MongoUsedCoupons=require("../Connections/UserSchema").CouponsUsed


async function years()
{


    const years=await MongoOrder.aggregate([{$match:{$and:[{CancelOrder:0},{DeliveryStatus:"delivered"}]}   },{$project:{year:{$year:"$realDate"},TotalAmount:1}},{$group:{_id:'$year',sum:{$sum:'$TotalAmount'}}},{$sort:{_id:-1}}])


    let y=0,count=0,yearcount=[]
    
  for(i=0;i<years.length;i++)
  {
    yearcount[i]=years[i]._id
  }
  return yearcount

}


const usercount=async (req,res)=>
{


    const usercount=await MongoUserData.aggregate([{$match:{date: {
        $gte: new Date(
            (new Date().getTime() - (req.query.day * 24 * 60 * 60 * 1000))
        ) 
    }  }}])

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

let raze,pay,cash;
if(cod.length<1)
{
   cash= 0
}
else{
 cash=cod[0].sum
}
if(paypal.length<1)
{
   pay =0
}
else
{
    pay=paypal[0].sum
}
if(razer.length<1)
{

raze=0
}
else
{
 raze=razer[0].sum
}

    const chartdata=[cod[0].sum,raze,paypal[0].sum]

res.json(chartdata)


}

const revenuereport=async (req,res)=>
{

    const category=await MongoCategory.find().sort( {MainCategory:1  } )
       const monthly=await MongoOrder.aggregate([{$match:{$and:[{CancelOrder:0},{DeliveryStatus:"delivered"}]}},{$unwind:'$products'},{$project:{month:{$month:"$realDate"},year:{$year:"$realDate"},TotalAmount:1,MainCategory:1,ItemId:'$products.ItemId'}},
    {$lookup:{
            from:'productdetails',
            localField:'ItemId', 
            foreignField:'_id',
            as:'product'
        }
    
    },{$project:{month:1,year:1,TotalAmount:1,product: { $arrayElemAt: ['$product.Category',0]}}},
    {$match:{year:parseInt(req.query.year)}},
    {$group:{_id:{year:"$year",month:"$month",category:"$product"},sum:{$sum:'$TotalAmount'}}},
    
])
console.log(req.query.year);



console.log(monthly);

res.render("admin/RevenueReport",{years:await years(),category:category,monthly:monthly})



}





module.exports={usercount,
    revenuecount,ordercount,cancelcount,linechart,donutchart,revenuereport
} 