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



router.get("/AddCart",(req,res,next)=>//must add session check
{
  return new Promise(async (resolve, reject) => {

if(!req.session.user) 
{
  res.redirect("/UserLogin")
}
else
(
  next()
)
  }) 

},ProductHelper.AddToCart,async(req,res)=>
{
  const UserId=await MongoUserData.findOne({email:req.session.user});

cartDetails=await MongoCart.findOne({UserId:UserId._id})
// console.log(cartDetails.product);
const ProductId=cartDetails.product;
// console.log(ProductId);

// const Products=[]
// ProductId.forEach(async function  (product)
// {
// // console.log(product.ItemId);
// products=await ProductStore.find({_id:product.ItemId})

// console.log(Products);
// })

// const a=await MongoCart.aggregate([{$lookup:{from:'ProductDetails',localField:'product.ItemId'.ItemId,foreignField:'_id',as:'cate'}}])

// console.log(a);
// MongoCart.find({$and:{UserId:}})
  res.render("user/Cart",{Category:await CategoryList(),CartItem:"k"})
}
)
 

module.exports = router   