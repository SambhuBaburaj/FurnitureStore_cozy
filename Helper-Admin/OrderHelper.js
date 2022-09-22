require("dotenv").config();
const mongoCategory = require("../Connections/AdminSchema");
const ProductStore=require("../Connections/AdminSchema").Products
const multer = require('multer');
const MongoOrder=require("../Connections/UserSchema").OrderDetails
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const MongoCoupons=require("../Connections/UserSchema").Coupons


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



const OrderStatus=async(req,res)=>
{
    const status=req.body.status.toString()
console.log(status);
 const data=await MongoOrder.findOne({_id:ObjectId(req.body.userid)})
 if(req.body.status=="Cancel")
 {
  
if(data.paymentMethod=="COD" )
{
   await MongoOrder.updateOne({_id:ObjectId(req.body.userid)},{$set:{CancelOrder:1,DeliveryStatus:"canceled",PaymentStatus:"canceled"}},function(err,success)

{
if(success)
{
console.log(success);
}

}).clone()
}
else
{
  await MongoOrder.updateOne({_id:ObjectId(req.body.userid)},{$set:{CancelOrder:1,DeliveryStatus:"canceled",PaymentStatus:"refund initiated"}},function(err,success)

{
if(success)
{
console.log(success);
}

}).clone()
} 





 }


else if(req.body.status=="delivered" && data.paymentMethod=="COD" )
{
   
    await MongoOrder.updateOne({_id:ObjectId(req.body.userid) },{$set:{DeliveryStatus:req.body.status.toString(),PaymentStatus:"Success"}} ,function(s,e){
        if(s)
        console.log(s);
        else
        console.log(e);
        }).clone()

      
    
}
else{
    console.log('ofndoevnedvdfv');
await MongoOrder.updateOne({_id:ObjectId(req.body.userid) },{$set:{DeliveryStatus:req.body.status.toString()}} ,function(s,e){
if(s) 
console.log(s);
else
console.log(e);
}).clone()
}
res.json(true)

}


const Couponsview=async (req,res)=>
{


  const Coupons=await MongoCoupons.find()
  console.log(Coupons);
    res.render('admin/CouponsControl',{years:await years(),coupons:Coupons})
}



const addCoupons=async (req,res)=>
{


res.render('admin/addcoupones',{years:await years()})




}




const SaveCoupons=(req,res)=>
{

console.log(req.body);

var today = new Date();
var expire = new Date();
expire.setDate(today.getDate()+parseInt( req.body.Expire));


const coupons = new MongoCoupons({

    CouponsID:req.body.coupone,
    ExpireDate:expire,
    Discount:req.body.Discount,
    Desc:req.body.desc,
Cap:req.body.Cap


  }); 
  coupons.save();


res.redirect("/admin/CuponsControl")

}

module.exports={OrderStatus,Couponsview,addCoupons,SaveCoupons
   }