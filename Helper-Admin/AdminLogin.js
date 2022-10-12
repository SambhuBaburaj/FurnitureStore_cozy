require("dotenv").config();
const mongoConnection=require("../Connections/UserSchema") 
const mongoose = require("mongoose");
const ProductStore=require("../Connections/AdminSchema").Products
const multer = require('multer');
const MongoOrder=require("../Connections/UserSchema").OrderDetails

const { ObjectId } = require("mongodb");

const MongoUserData=require("../Connections/UserSchema").user_data
const MongoCategory=require("../Connections/AdminSchema").MainCategory
const MongoCart=require("../Connections/UserSchema").CartData

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








const SessionCheck= (req,res,next)=>
{
  if(!req.session.admin) {
   
res.render("admin/AdminLogin",{Authentication:req.query.LoginAgain,LogoutAdmin:req.query.Logout})
}
next();
}
const AdminLogin = (req, res) => 
{

  if ( 
    req.body.email == process.env.AdminUserName &&
    req.body.password == process.env.AdminPassword
  ) {
    console.log(process.env.AdminUserName, process.env.AdminPassword);
    req.session.admin = req.body.email;

    res.redirect("/admin/home");
  }
   else 
   {
    res.render("admin/AdminLogin", {
      title: "express",
      Authentication: "invalid Email / Password", 
    });
  }
};
const HomePage=(SessionCheck,async(req,res)=>
{


  const years=await MongoOrder.aggregate([{$match:{$and:[{CancelOrder:0},{DeliveryStatus:"delivered"}]}   },{$project:{year:{$year:"$realDate"},TotalAmount:1}},{$group:{_id:'$year',sum:{$sum:'$TotalAmount'}}},{$sort:{_id:-1}}])


  let y=0,count=0,yearcount=[]
  
for(i=0;i<years.length;i++)
{
  yearcount[i]=years[i]._id
}


const monthly=await MongoOrder.aggregate([{$match:{$and:[{CancelOrder:0},{DeliveryStatus:"delivered"}]}},{$project:{month:{$month:"$realDate"},year:{$year:"$realDate"},TotalAmount:1}},{$group:{_id:{year:"$year",month:"$month"},sum:{$sum:'$TotalAmount'}}},{$sort:{"id.month":1,'_id.year':-1}}])

let counter =0
console.log(monthly);







      res.render("admin/AdminHome",{years:yearcount,monthly:monthly}); 



})
const FindData= function (req,res,next)
{
  mongoConnection.user_data.find(async(err,DataAttained) => {
  
    
    res.render("admin/UsersDetails", { years:await years(), user: req.session.admin, UserData: DataAttained });
  });
  
next()

}
const StatusChange=async(req,res,next)=>
{
  
  const status=req.params.values 
  // const id=status[0]
  console.log(status);
  // console.log(status.status);
    console.log("ok");
 await mongoConnection.user_data.updateOne(  { _id: status },{$set:{isBlocked:1}}).then((response) => {

  res.json(response)
 
 })
  
  // else 
  // {
  //   console.log("not ok");
  //  await mongoConnection.user_data.updateOne({_id:id},{$set:{isBlocked:1}})
  // } 
}
const UnBlock=async(req,res,next)=>
{
  console.log("its here");
  const id=req.query.id
  await mongoConnection.user_data.updateOne({_id:id},{$set:{isBlocked:0}})
  next()
}



module.exports = {
  AdminLogin, 
  HomePage,
SessionCheck,
FindData,
StatusChange,
UnBlock
}
