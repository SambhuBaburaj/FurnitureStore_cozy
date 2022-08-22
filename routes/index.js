const { response } = require("express");
var express = require("express");
var router = express.Router();
const UserHelper = require("../Helper-User/UserRegister_helper");
ProductHelper=require("../Helper-User/Home-helper")
MongoUserData=require("../Connections/UserSchema").user_data
const MongoCategory=require("../Connections/AdminSchema").MainCategory
const MongoCart=require("../Connections/UserSchema").CartData
const ProductStore=require("../Connections/AdminSchema").Products
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

router.get("/UserLogout",UserHelper.Logout,async(req,res)=>
{
 res.render("user/User-login",{logout:"logout Success",Category:await CategoryList()}) 
})

router.get("/LoginOTP",async(req,res)=>
{

res.render("user/OTPnumber",{Category:await CategoryList()})

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


router.get("/ProductSingle",ProductHelper.ViewSingle,(req,res)=>
{



})


// cart Area..........................................

router.get("/AddCart",(req,res,next)=>//must add session check
{


  return new Promise(async (resolve, reject) => {
    req.session.user="sambhubaburaj007@gmail.com"

if(!req.session.user) 
{
  res.redirect("/UserLogin")
}
else
(
  next()
)   

  }) 

},ProductHelper.AddToCart,ProductHelper.ProductPost
) 
 router.post("/CountControl",ProductHelper.QuantityControl,(req,res)=>
 {
 })

 router.post("/RemoveProduct",ProductHelper.RemoveProduct,(req,res)=>
 {

 })

 router.get("/ClearCart",ProductHelper.ClearCart,(req,res)=>
 {

 })



 router.get("/CheckOut",ProductHelper.CheckOut,(req,res)=>
 {

 })

module.exports = router   