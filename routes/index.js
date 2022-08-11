const { response } = require("express");
var express = require("express");
var router = express.Router();
const UserHelper = require("../Helper-User/UserRegister_helper");

/* GET home page. */

router.get("/", function (req, res, next) {
  res.render("user/Home", { title: "Express",user: req.session.user });
});

router.get("/UserLogin",UserHelper.LoginSession, (req, res) => {
  res.render("user/User-login");
});
 
router.get("/My-account", UserHelper.SessionCheck,(req, res) => { 
  res.render("user/User-profile");
});

router.post("/Create-account", UserHelper.New_user, (req, res) => {});

router.post("/login", UserHelper.Login,(req,res)=>
{

})

router.get("/UserLogout",UserHelper.Logout,(req,res)=>
{
 res.render("user/User-login",{logout:"logout Success"}) 
})

router.get("/LoginOTP",(req,res)=>
{

res.render("user/OTPnumber")

})


router.post("/numberentry",UserHelper.NumberVerification,(req,res)=>
{



})


router.post("/OtpValidation",UserHelper.OtpValidation,async(req,res)=>
{



})

module.exports = router;
 