const mongoConnection = require("../Connections/UserSchema");
const bcrypt = require("bcrypt");
const session = require("express-session");
// const { MainCategory } = require("../Connections/AdminSchema");
const UserHelper = require("../Helper-User/UserRegister_helper");
const { response } = require("express");
const { ObjectId } = require("mongodb");
const { json } = require("body-parser");
const { TrustProductsChannelEndpointAssignmentContext } = require("twilio/lib/rest/trusthub/v1/trustProducts/trustProductsChannelEndpointAssignment");
const e = require("express");
const ProductStore=require("../Connections/AdminSchema").Products
const MongoCategory=require("../Connections/AdminSchema").MainCategory
const MongoCart=require("../Connections/UserSchema").CartData
const MongoUserData=require("../Connections/UserSchema").user_data
const MongoAddress=require("../Connections/UserSchema").address
const MongoBanner=require("../Connections/UserSchema").BannerControl
const MongoCoupons=require("../Connections/UserSchema").Coupons
const MongoUsedCoupons=require("../Connections/UserSchema").CouponsUsed
const MongoWishList=require("../Connections/UserSchema").UserWishlist
const mongoWallet=require("../Connections/UserSchema").UserWallet


/* GET home page. */
// const CategoryList=MongoCategory.find()


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




let wishlist,user
const GetProduct=async(req,res,next)=>
{
  
const ProductList=await ProductStore.find();
const listofcat=await CategoryList()
const length=(await CategoryList()).length;
console.log(length);
const banner=await MongoBanner.find()

if(req.session.user){


 user =await MongoUserData.findOne({email:req.session.user})

 wishlist=await MongoWishList.findOne({UserId:user._id})

}
else{

    wishlist=[0] 
}



if(!wishlist)
{

    res.render("user/Home", { title: "Express",name:user,user: req.session.user ,Product:ProductList,Category:listofcat ,length:length,banner:banner,wishlist:null,cartdata:await cartdata(req.session.user)});
 
} 

else{

    res.render("user/Home", { name:user,title: "Express",user: req.session.user ,Product:ProductList,Category:listofcat ,length:length,banner:banner,wishlist:wishlist.Products,cartdata:await cartdata(req.session.user)});

}

next();
}


const getCategory=async(req,res,next)=>
{

    // console.log(req.session.Category);
const MainCat=req.query.Cat
const SubCat=req.query.SubCat
const data=await ProductStore.find({$and:[{Category:MainCat},{SubCategory:SubCat}]})
// console.log(data);
// NewPrice=Math.trunc(data.Price-(Data.Price*data.Discount)/100)
let user,wishlist;
if(req.session.user){


    user =await MongoUserData.findOne({email:req.session.user})
   
    wishlist=await MongoWishList.findOne({UserId:user._id})
   
   }
   else{
     user={
   username:"guest"
       }
       wishlist=[0] 
   }



// console.log("wishlist",wishlist);






    res.render("user/ProductBrowse",{name:user,wishlist:wishlist.Products,user: req.session.user,Category:await CategoryList(),Product:data,cartdata:await cartdata(req.session.user)})

next()
} 

const ViewSingle=async(req,res,next)=>
{
    req.session.returnto=req.originalUrl
    // console.log(req.session.returnto);
SingleProductData=await ProductStore.findOne({_id:req.query.id})
// console.log(SingleProductData);

NewPrice=Math.trunc(SingleProductData.Price-(SingleProductData.Price*SingleProductData.Discount)/100)
// console.log(NewPrice);
if(req.session.user)
{
    const user =await MongoUserData.findOne({email:req.session.user})
    
     wishlist=await MongoWishList.findOne({UserId:user._id})

}
else{
    wishlist=[0]
} 
const user =await MongoUserData.findOne({email:req.session.user})
    res.render("user/SingleProduct",{name:user,user: req.session.user,Category:await CategoryList(),SingleProductData:SingleProductData,NewPrice:NewPrice,cartdata:await cartdata(req.session.user),wishlist:wishlist.Products})

}




// Cart Area......................................................................................................

const AddToCart= async(req,res,next)=>
{

    console.log(req.params);
//  console.log(req.query.ProductId);
//  console.log(req.session.user);
if(!req.query.ProductId)
{
  next()
}
else{

const User=await mongoConnection.user_data.findOne({email:req.session.user})
const CartUser=await MongoCart.findOne({UserId:User._id})
// console.log("object id is here",User._id);
const FindProduct= await ProductStore.findOne({_id:req.query.ProductId})
// console.log("findproduct",FindProduct._id);
const CartData={ItemId:FindProduct._id, Quantity:1}
if(!CartUser){

    const Cart_Schema = new mongoConnection.CartData({

        UserId:User._id,

    })
    Cart_Schema.save();

console.log(await MongoCart.find({UserId:User._id}));

    MongoCart.findOneAndUpdate({UserId:User._id }, { $push: { product: CartData  } }, function (error, success) {
        if (error) {
            console.log(error);
        } else { 
            // console.log(success);
        }
    });

    // res.render("user/Cart",{Category:await CategoryList(),CartItem:"k"})
    next()
}
else{
const UserIdData=CartUser.product.ItemId
// console.log(UserIdData,"here"); 
 


if(await MongoCart.findOne({UserId:CartUser.UserId}))
{

 if(await MongoCart.findOne({$and:[{UserId:CartUser.UserId},{product:{ $elemMatch:{ItemId:req.query.ProductId}}}]}))
{ 
  
// console.log(await MongoCart.findOne({$and:[{product: CartData },{UserId:CartUser.UserId}]}));
    // res.render("user/Cart",{Category:await CategoryList(),CartItem:UserIdData})
    next()
} 
else
{

    MongoCart.findOneAndUpdate({UserId:CartUser.UserId }, { $push: { product: CartData  } }, function (error, success) {
        if (error) {
            console.log(error);
        } else {
   
        }
    });
    // res.render("user/Cart",{Category:await CategoryList(),CartItem:UserIdData})
    next()
}
}
else
{
// res.render("user/Cart",{Category:await CategoryList(),CartItem:UserIdData})
next()
}


   
}
}
}

 const ProductPost=async(req,res)=>
 {

    console.log(req.session);
    
   const UserId=await MongoUserData.findOne({email:req.session.user});

   
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
//  console.log(CartProduct);
const user =await MongoUserData.findOne({email:req.session.user})

   res.render("user/Cart",{name:user,user: req.session.user,Category:await CategoryList(),CartItem:CartProduct,cartdata:await cartdata(req.session.user)})
 } 

//  quantity control.................
const QuantityControl=async(req,res)=>
{
    console.log(req.body);
const userObject=req.body.UserObject
const Quantity=req.body.Quantity
const ProductId=req.body.productId
const Count=req.body.count
// console.log(userObject);
console.log(Count);
await MongoCart.updateOne({_id:ObjectId(userObject),'product.ItemId':ObjectId(ProductId)},{$inc:{'product.$.Quantity':Count}})
// const a=await MongoCart.aggregate([{$match:{_id:ObjectId(userObject)}},{$unwind:'$product'},{$project:{Product:'$product.ItemId',Quantity:'$product.Quantity'}},{$match:{Product:ObjectId(ProductId)}},{$inc:{Quantit':Count}}])

res.json(true)

 
}
const RemoveProduct=async(req,res)=>
{
const UserObject=req.body.UserObject

const product=req.body.productId

// console.log(await MongoCart.find({_id:ObjectId(UserObject)},{'product':{ItemId:ObjectId(product)}}));

MongoCart.updateOne({_id:ObjectId(UserObject)},{$pull:{'product':{ItemId:ObjectId(product)}}}, function (error, success) {
    if (error) {
        console.log(error);
    } else {
console.log(success);
    }})
res.json(true)

}

const ClearCart=async(req,res)=>
{

   const Useremail=req.session.user;
   const UserId=await mongoConnection.user_data.findOne({email:Useremail})
   console.log(UserId._id);
   console.log(await MongoCart.findOne({UserId:UserId._id}));
   await MongoCart.deleteOne({UserId:UserId._id}, function (error, success) {
    if (error) {
        console.log(error);
    } else {
console.log(success);
    }}).clone()
res.redirect("/AddCart")
}

const CheckOut=async(req,res)=>
{ 
    console.log(req.session.couponid,);
    // console.log(req.session.user);
    const UserId=await MongoUserData.findOne({email:req.session.user});
    cartDetails=await MongoCart.findOne({UserId:UserId._id})
     
     
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

let quantity=0,TotalPrice=0,Price=0,Discount=0;




 CartProduct.forEach(function (CartItems)
 {

    quantity=quantity+CartItems.Quantity;
  
    Discount=Discount+CartItems.Quantity*(CartItems.product.Price*CartItems.product.Discount/100)
    Price=Price+(CartItems.Quantity* CartItems.product.Price)
  
})
TotalPrice=Price-Discount
if(req.session.coupon)
{
    TotalPrice=TotalPrice-req.session.coupon 
}

// console.log(Math.trunc(Price));
//     console.log( Math.trunc(TotalPrice));
//     console.log("sdi",Discount);

const CheckoutData={
RealPrice:Math.trunc(Price),
DisPrice:Math.trunc(TotalPrice),
Quantity: Math.trunc(quantity),
Discount:Math.trunc(Discount),
coupon:req.session.coupon

}
const user=await MongoUserData.findOne({email:req.session.user})
const address=await MongoAddress.find({userID:user.id})




if(quantity==0)
{
    res.redirect("/")
}
else
{
   const wallet=await mongoWallet.findOne({userId:user._id})
   const user =await MongoUserData.findOne({email:req.session.user})

res.render("user/CheckOut",{name:user,user: req.session.user,Category:await CategoryList(),CheckoutData:CheckoutData,address:address,cartdata:await cartdata(req.session.user),wallet:wallet.balance})

}
} 








const OrderCheckout= async(req,res)=>
{
    const UserId=await MongoUserData.findOne({email:req.session.user});
    cartDetails=await MongoCart.findOne({UserId:UserId._id})

     
    var CartProduct=await MongoCart.aggregate([{$match:{UserId:UserId._id}},{$unwind:'$product'},{$project:{ItemId:'$product.ItemId',
    Quantity:'$product.Quantity'}}, {
      $lookup:{
          from:'productdetails',
          localField:'ItemId', 
          foreignField:'_id',
          as:'product'
      }}, {$project:{
        ItemId: 1, Quantity: 1 ,product: { $arrayElemAt: ['$product',0]}
    }}])
   
    let TotalPrice=0



    CartProduct.forEach(function (CartItems)
    {
   

       TotalPrice=TotalPrice+(CartItems.Quantity*( CartItems.product.Price-(CartItems.product.Price*CartItems.product.Discount/100)))
      
   })





// console.log(user);

const details = req.body
console.log(details);
const Address={
Name:details.FirstName+" "+details.LastName,
Mobile:details.phone,
Email:details.email,
Address:details.Address,
Country:details.Country,
State:details.State,
City:details.City,
Zip:details.zip,
additional:details.additional 


}

const user=await mongoConnection.user_data.findOne({email:req.session.user})
// console.log(user._id);
// console.log(await MongoCart.find({UserId:user._id}));

// console.log(Address);
const ProductData=await MongoCart.aggregate([{$match:{UserId:user._id}},{$unwind:'$product'},{$project:{ItemId:'$product.ItemId',
Quantity:'$product.Quantity',_id:0}}])
if(details.delivery=="COD")
{
console.log('heree');

const OrderDetails = new mongoConnection.OrderDetails({
 DeliveryDetails:Address, 
 
 userId:user._id,
date:new Date().toDateString(),
realDate:new Date(),
products:ProductData,
status:"Order Placed",
PaymentMethode:details.delivery,
PaymentStatus:"pending",
DeliveryStatus:"pending",
TotalAmount:Math.trunc(TotalPrice),
paymentMethod:"COD",
CancelOrder:0
})
OrderDetails.save(function(err,room){
    var newRoomId = room._id;

    console.log("room",newRoomId);
    })

 
await MongoCart.deleteOne({UserId:user._id}, function (error, success) {
    if (error) {
        console.log(error);
    } else {
console.log(success);
    }}).clone()
    const user =await MongoUserData.findOne({email:req.session.user})

res.render("user/OrderPlaced",{name:user,user: req.session.user,Category:await CategoryList() ,orderID:OrderDetails._id,cartdata:await cartdata(req.session.user)});

}


}


const ApplyCoupon=async(req,res)=>
{


    const UserId=await mongoConnection.user_data.findOne({email:req.session.user})





var CartProduct=await MongoCart.aggregate([{$match:{UserId:UserId._id}},{$unwind:'$product'},{$project:{ItemId:'$product.ItemId',
Quantity:'$product.Quantity'}}, {
  $lookup:{
      from:'productdetails',
      localField:'ItemId', 
      foreignField:'_id',
      as:'product'
  }}, {$project:{
    ItemId: 1, Quantity: 1 ,product: { $arrayElemAt: ['$product',0]}
}}])

let TotalPrice=0



CartProduct.forEach(function (CartItems)
{


   TotalPrice=TotalPrice+(CartItems.Quantity*( CartItems.product.Price-(CartItems.product.Price*CartItems.product.Discount/100)))
  
})

 

const UsedCoupon=await MongoUsedCoupons.findOne({$and:[{user:UserId._id},{CouponsId:req.body.coupon}] })
const allCoupons=await MongoCoupons.findOne({CouponsID:req.body.coupon})

console.log(UsedCoupon);






if(UsedCoupon)
{
 
    res.json({
        status:"Used"
    })
}

else if(allCoupons)
{

 if(allCoupons.Cap>TotalPrice)
{
 res.json({
    status:"min",
    cap:allCoupons.Cap
 })
}

 else if (allCoupons.Cap<TotalPrice)
{
    

  const discount= ( TotalPrice*allCoupons.Discount)/100
const GrantTotal=TotalPrice-discount
console.log(req.body.coupon);
req.session.coupon=Math.round(discount)
req.session.couponid=req.body.coupon;
console.log(req.session.couponid);
res.json({
    status:"applied",
    discount:Math.round(discount),
    GrantTotal:Math.round(GrantTotal)
})



}
}

else
{
  
        res.json({
            status:"denied"
        })
  
    }





}
  

module.exports={
    GetProduct,
    getCategory,
    ViewSingle,
    AddToCart,
    ProductPost,
    QuantityControl,
    RemoveProduct,
    ClearCart,
    CheckOut,
    OrderCheckout,
    ApplyCoupon
}  
