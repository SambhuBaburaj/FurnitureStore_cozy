const mongoConnection = require("../Connections/UserSchema");
const bcrypt = require("bcrypt");
const session = require("express-session");
// const { MainCategory } = require("../Connections/AdminSchema");
const UserHelper = require("../Helper-User/UserRegister_helper");
const { response } = require("express");
const { ObjectId } = require("mongodb");
const { json } = require("body-parser");
const ProductStore=require("../Connections/AdminSchema").Products
const MongoCategory=require("../Connections/AdminSchema").MainCategory
const MongoCart=require("../Connections/UserSchema").CartData

/* GET home page. */
// const CategoryList=MongoCategory.find()

const CategoryList=async()=>

{
   return await MongoCategory.find()
}


const GetProduct=async(req,res,next)=>
{
  
const ProductList=await ProductStore.find();
const listofcat=await CategoryList()
const length=(await CategoryList()).length;
console.log(length);
res.render("user/Home", { title: "Express",user: req.session.user ,Product:ProductList,Category:listofcat ,length:length});
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
    res.render("user/ProductBrowse",{Category:await CategoryList(),Product:data})

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
    res.render("user/SingleProduct",{Category:await CategoryList(),SingleProductData:SingleProductData,NewPrice:NewPrice})

}




// Cart Area......................................................................................................

const AddToCart= async(req,res,next)=>
{
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
   res.render("user/Cart",{Category:await CategoryList(),CartItem:CartProduct})
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
const CheckOut=(req,res)=>
{


    
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
    CheckOut
}
