const mongoConnection = require("../Connections/UserSchema");
const bcrypt = require("bcrypt");
const session = require("express-session");
// const { MainCategory } = require("../Connections/AdminSchema");
const UserHelper = require("../Helper-User/UserRegister_helper");
const { response } = require("express");
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


const AddToCart= async(req,res,next)=>
{
//  console.log(req.query.ProductId);
//  console.log(req.session.user);
const User=await mongoConnection.user_data.findOne({email:req.session.user})
const CartUser=await MongoCart.findOne({UserId:User._id})
const CartData={ItemId:req.query.ProductId, Quantity:1}
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
console.log(UserIdData,"here"); 
 


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
            // console.log(error);
        } else {
            // console.log(success);
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
// person.friends.push(friend);
// person.save(done);

// const CartItem = new mongoConnection.CartData({ 

//     ItemId:"ytfyt" 


// }); 
// CartItem.save()



// res.render("user/Cart",{Category:await CategoryList()})

 
// console.log(User);


   
}

}

 

 

module.exports={
    GetProduct,
    getCategory,
    ViewSingle,
    AddToCart
}
