const { response } = require("express");
var express = require("express");
var router = express.Router();
const UserHelper = require("../Helper-User/UserRegister_helper");
ProductHelper=require("../Helper-User/Home-helper")
const MongoCategory=require("../Connections/AdminSchema").MainCategory
/* GET home page. */
const CategoryList=async()=>

{
   return await MongoCategory.find()
}



router.get("/",ProductHelper.GetProduct,function (req, res, next) {

 
});

router.get("/UserLogin",UserHelper.LoginSession, (req, res) => {
  res.render("user/User-login",{Category:CategoryList});
});
 
router.get("/My-account",UserHelper.SessionCheck,(req, res) => { 
  res.render("user/User-profile",{Category:CategoryList});
});

router.post("/Create-account", UserHelper.New_user, (req, res) => {});

router.post("/login", UserHelper.Login,(req,res)=>
{

})

router.get("/UserLogout",UserHelper.Logout,(req,res)=>
{
 res.render("user/User-login",{logout:"logout Success",Category:req.session.Category}) 
})

router.get("/LoginOTP",(req,res)=>
{

res.render("user/OTPnumber",{Category:req.session.Category})

})


router.post("/numberentry",UserHelper.NumberVerification,(req,res)=>
{



})


router.post("/OtpValidation",UserHelper.OtpValidation,async(req,res)=>
{



})


router.get("/SubCatList",ProductHelper.getCategory,(req,res)=>
{
})


router.get("/ProductSingle",(req,res)=>
{
  console.log(req.query);
  res.send("se9ug")
})



module.exports = router;
 