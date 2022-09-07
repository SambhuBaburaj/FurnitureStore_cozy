require("dotenv").config();
const mongoCategory = require("../Connections/AdminSchema");
const ProductStore=require("../Connections/AdminSchema").Products
const multer = require('multer');
const MongoOrder=require("../Connections/UserSchema").OrderDetails
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");



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



module.exports={OrderStatus,
   }