require("dotenv").config();
const mongoCategory = require("../Connections/AdminSchema");
const ProductStore=require("../Connections/AdminSchema").Products
const multer = require('multer');

const mongoose = require("mongoose");
const AddCategory = (req, res, next) => {
  console.log("its here");
  const MainCategory = req.body.MainCategory;
  const Category = new mongoCategory.MainCategory({
    MainCategory: MainCategory,
    SubCategory: req.body.SubCategory,
  });
  Category.save();

  next();
};

const ListCategory = async (req, res) => {
  // res.render("admin/Category");
  await mongoCategory.MainCategory.find((err, DataAttained) => {
    // res.render("admin/Category")
    res.render("admin/Category", {
      user: req.session.admin,
      category: DataAttained,
      success:req.query.success,
      Category:req.query.cat,
    });
  }).clone();
};
const getCategory = async (req, res) => {
  const MainCategory = req.body.maincata;
  // db.student.aggregate([{$match:{name:"Mike"}},{$unwind:"$interest"},{$project:{interest:1,_id:0}})
  const SubCategory = await mongoCategory.MainCategory.aggregate([
    { $match: { MainCategory: MainCategory } },
    { $unwind: "$SubCategory" },
    { $project: { SubCategory: 1, _id: 0 } },
  ]);

  // const SubCategory= await mongoCategory.MainCategory.aggregate([{$match:{MainCategory:MainCategory}}]);

  res.json(SubCategory);
};
//photo upload_product

const AddPhoto= (req,res,next)=>
{
console.log("azrrt");

next();
}


const productadd = (req, res,next) => {

  
 
    
    
  
      var filenames = req.files.map(function (file) {
          return file.filename;



      });
      req.body.images = filenames;
    console.log(req.body);



      const Category = new ProductStore({
        ProductName: req.body.ProductName,
        Category: req.body.Category,
        SubCategory: req.body.subCategory,
        Price: req.body.price,
        Discount:req.body.DisPrice,
        Disc:req.body.desc,
        Images:req.body.images,
   
      }); 
      Category.save();

res.redirect("/admin/AddCategory?success='product added'")


    
  next()
};

module.exports = { AddCategory, ListCategory, getCategory, productadd
,AddPhoto };
