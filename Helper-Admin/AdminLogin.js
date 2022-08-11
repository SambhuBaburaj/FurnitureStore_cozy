require("dotenv").config();
const mongoConnection=require("../Connections/UserSchema") 
const mongoose = require("mongoose");
const SessionCheck= (req,res,next)=>
{
  if(req.session.admin) {
   
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
const HomePage=(SessionCheck,(req,res)=>
{

      res.render("admin/AdminHome");
})
const FindData=function(req,res,next)
{
  mongoConnection.user_data.find((err,DataAttained) => {
  
    
    res.render("admin/UsersDetails", { user: req.session.admin, UserData: DataAttained });
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
