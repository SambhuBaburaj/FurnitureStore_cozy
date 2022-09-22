const { response } = require("express");
var express = require("express");
var router = express.Router();
const UserHelper = require("../Helper-User/UserRegister_helper");
const ProductHelper=require("../Helper-User/Home-helper")
const PaymentHelper=require("../Helper-User/PaymentHelper")
const ProfileHelper=require("../Helper-User/ProfileHelper")
const MongoUserData=require("../Connections/UserSchema").user_data
const MongoCategory=require("../Connections/AdminSchema").MainCategory
const MongoCart=require("../Connections/UserSchema").CartData
const ProductStore=require("../Connections/AdminSchema").Products
const CC = require("currency-converter-lt");
const paypal = require('paypal-rest-sdk');
const { OrderHelper } = require("../Helper-Admin/CategoryManagement");
 
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AQVcB0br1h3w35WAI6TnvZ1YWo5tb4MAQsnPWC03HS4Ablcy6yY7M9dJ6GsWdPSFxzYv7Dzj6JZVffOb',
  'client_secret': 'EFZcTQfiBEyN2w_p1TpChtgkakULbuHfYvGMWyUwsk8OCvACXZqo8AsCAWCPR_jTXiUHHrpPH0ooZVqo'
});
/* GET home page. */


router.use((req, res, next) => {

  req.session.user="sambhubaburaj007@gmail.com"
  next()

 })



 const CategoryList=async()=>

 {
    return await MongoCategory.find()
 }



router.get("/",ProductHelper.GetProduct,function (req, res, next) {

 
});

router.get("/UserLogin",UserHelper.LoginSession, (req, res) => {
  res.render("user/User-login",{Category:CategoryList});
});
 


router.post("/Create-account", UserHelper.New_user, (req, res) => {});

router.post("/login", UserHelper.Login,(req,res)=>
{ 

})

router.get("/headline",(req,res)=>
{
  res.redirect("/")
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
  req.session.coupon=null
  req.session.couponid=null
  

  return new Promise(async (resolve, reject) => {
    // req.session.user="sambhubaburaj007@gmail.com"

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



 router.get("/CheckOut",(req,res,next)=>

 {

  next()
  
 },ProductHelper.CheckOut
 )
router.post("/OrderCheckout",PaymentHelper.OrderCheckout,(req,res)=>
{




})
router.get("/CODOrderSuccess",async (req,res,next)=>
{
console.log(req.query,"sfiuajr");

     res.render("user/OrderPlaced", {
      Category: await CategoryList(),
      orderID: req.query.data,
    });
    next()
})




router.get("/OrderSuccess",async (req,res,next)=>
{

  console.log(req.params.data);
    //  res.render("user/OrderPlaced", {
    //   Category: await CategoryList(),
    //   orderID: OrderDetails._id,
    // });
    next()
},PaymentHelper.PaypalOrderPlaced)

router.get("/OrderSuccessrazer",(Req,res,next)=>
{
next()
},PaymentHelper.razersuccess
)


router.get("/OrderFailed",(req,res)=>
{
req.send("unsuccess")
}
)



router.get("/YourOrders",ProfileHelper.SingleOrder,async(req,res)=>
{

  // console.log(req.query,"f7fgf");

})


router.get("/My-account",(req, res,next) => { 
  return new Promise(async (resolve, reject) => {
    // req.session.user="sambhubaburaj007@gmail.com"

if(!req.session.user) 
{
  res.redirect("/UserLogin")
}
else
(
  next()
)   

  })


},ProfileHelper.MainProfile);

router.post("/cancelOrder",(req,res,next)=>
{
console.log("here");
next()
},ProfileHelper.cancelOrder

)

router.post("/SaveAddress",(req,res,next)=>
{
next()
},ProfileHelper.SaveAddress

)

router.get("/paypalpay",async(req,res,next)=>
{

next()
},PaymentHelper.paypalhelp)


router.post("/verifyPayments",(req,res,next)=>
{
next()
},PaymentHelper.razorpayhelp
)

router.post("/ReuturnOrder",(req,res,next)=>
{

next()
},ProfileHelper.ReturnProduct)


router.post("/DeleteAddress",ProfileHelper.addreessdelete)


router.get("/editAddress",ProfileHelper.addressEditer)

router.post("/saveupdateAddress",ProfileHelper.updateaddress)
router.post("/ApplyCoupon",ProductHelper.ApplyCoupon)

router.get("/MyWishlist",ProfileHelper.wishlistView)







module.exports = router    