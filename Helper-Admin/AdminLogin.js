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
  const status=req.query.status
  const id=req.query.id
  console.log(id);
  if(status==1)
  {
    console.log("ok");
 await mongoConnection.user_data.updateOne(  { _id: id },{$set:{isBlocked:0}})
  }
  else
  {
    console.log("not ok");
   await mongoConnection.user_data.updateOne({_id:id},{$set:{isBlocked:1}})
  } 
next()
}




module.exports = {
  AdminLogin, 
  HomePage,
SessionCheck,
FindData,
StatusChange
}
