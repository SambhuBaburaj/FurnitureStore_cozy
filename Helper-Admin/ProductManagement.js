require("dotenv").config();
const mongoCategory = require("../Connections/AdminSchema");
const ProductStore=require("../Connections/AdminSchema").Products
const multer = require('multer');

const ViewProducts=async (req,res)=>
{

    console.log('here');
   const Products=await ProductStore.find()
   console.log(Products); 
res.render("admin/viewProduct",{products:Products})

}

module.exports={
    ViewProducts
}