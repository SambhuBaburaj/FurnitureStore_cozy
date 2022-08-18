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

    console.log(req.session.Category);
const MainCat=req.query.Cat
const SubCat=req.query.SubCat
const data=await ProductStore.find({$and:[{Category:MainCat},{SubCategory:SubCat}]})
console.log(data);
// NewPrice=Math.trunc(data.Price-(Data.Price*data.Discount)/100)
    res.render("user/ProductBrowse",{Category:await CategoryList(),Product:data})

next()
} 

const ViewSingle=async(req,res,next)=>
{

SingleProductData=await ProductStore.findOne({_id:req.query.id})
console.log(SingleProductData);
NewPrice=Math.trunc(SingleProductData.Price-(SingleProductData.Price*SingleProductData.Discount)/100)
console.log(NewPrice);
    res.render("user/SingleProduct",{Category:await CategoryList(),SingleProductData:SingleProductData,NewPrice:NewPrice})

}
const CartPage=async (req,res)=>
{
    res.render("user/Cart",{Category:await CategoryList()})
}


const AddToCart=(req,res)=>
{
   
console.log(req.query.ProductId);
console.log(req.session.user);
res.send("ygfhdhj")

   


}

 

 

module.exports={
    GetProduct,
    getCategory,
    ViewSingle,
    CartPage,
    AddToCart
}
