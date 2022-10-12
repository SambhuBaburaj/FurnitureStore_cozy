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
const session = require("express-session");
 
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


 
 async function cartdata(user)
 {
     console.log(user);
     const UserId=await MongoUserData.findOne({email:user});
 
    if(UserId)
    {
   // console.log(UserId._id);
   cartDetails=await MongoCart.findOne({UserId:UserId._id})
     
     
   //  const ProductId=cartDetails.product;
   //  const MatchCartUserId=await MongoCart.aggregate([{$match:{UserId:UserId._id}}])
    
    
    const CartProduct=await MongoCart.aggregate([{$match:{UserId:UserId._id}},{$unwind:'$product'},{$project:{ItemId:'$product.ItemId',
    Quantity:'$product.Quantity'}}, {
      $lookup:{
          from:'productdetails',
          localField:'ItemId', 
          foreignField:'_id',
          as:'product'
      }}, {$project:{
        ItemId: 1, Quantity: 1 ,product: { $arrayElemAt: ['$product',0]}
    }}])
 console.log(CartProduct);
 return CartProduct
    }
    else 
    return [];
   
 }
 
 
 const CategoryList=async()=>

 {
    return await MongoCategory.find()
 }



router.get("/",ProductHelper.GetProduct,async function (req, res, next) {

 
});

router.get("/UserLogin",UserHelper.LoginSession, async (req, res) => {
  res.render("user/User-login",{Category:CategoryList,cartdata:await cartdata(req.session.user)});
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
 res.render("user/User-login",{logout:"logout Success",Category:await CategoryList(),cartdata:await cartdata(req.session.user)}) 
})

router.get("/LoginOTP",async(req,res)=>
{

res.render("user/OTPnumber",{Category:await CategoryList(),cartdata:await cartdata(req.session.user)})

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
router.post("/OrderCheckout",(req,res,next)=>
{
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


},PaymentHelper.OrderCheckout)
router.get("/CODOrderSuccess",async (req,res,next)=>
{
console.log(req.query,"sfiuajr");

     res.render("user/OrderPlaced", {
      Category: await CategoryList(),
      orderID: req.query.data,cartdata:await cartdata(req.session.user)
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

router.get("/MyWishlist",(req,res,next)=>//must add session check
{


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

},ProfileHelper.wishlistView)

router.post("/WishList",(req,res,next)=>
{


 
    // req.session.user="sambhubaburaj007@gmail.com"

    return new Promise(async (resolve, reject) => {
      // req.session.user="sambhubaburaj007@gmail.com"
  
  if(!req.session.user) 
  {
res.json(
{status:'invlid'}

)
  }
else
{

  next()
}
  

  
 
   
  
    }) 
},ProfileHelper.WishListControl)



router.post("/removewish",(req,res,next)=>//must add session check
{


  return new Promise(async (resolve, reject) => {
    // req.session.user="sambhubaburaj007@gmail.com"

if(!req.session.user) 
{
  res.json(
    {status:'invlid'}
    
    )
     
}
else
(
  next()
)   

  }) 

},ProfileHelper.removewish

)
router.get("/WalletHistory",(req,res,next)=>
{
next()
},ProfileHelper.WalletHistory)








module.exports = router    