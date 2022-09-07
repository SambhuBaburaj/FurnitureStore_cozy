require("dotenv").config();
const mongoCategory = require("../Connections/AdminSchema");
const ProductStore=require("../Connections/AdminSchema").Products
const multer = require('multer');
const MongoOrder=require("../Connections/UserSchema").OrderDetails
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
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

const EditCat=async(req,res)=>
{


const Allcategory=await mongoCategory.MainCategory.find()

  res.render("admin/managecat",{Allcategory:Allcategory})
}

const OrderHelper=async (req,res)=>
{

  const orderdetails=await MongoOrder.find()
const quantity=await MongoOrder.aggregate([{$project:{products:1}},{$unwind:"$products"},{$group:{_id:'$_id',quantity:{$sum:"$products.Quantity"}}}])

  res.render("admin/UserOrders",{order:orderdetails.reverse(),quantity:quantity})
}
const EditCategory=async (req,res)=>
{
  console.log(req.query.catid);

  const category=await mongoCategory.MainCategory.findOne({_id:req.query.catid})
  console.log(category);
  res.render("admin/EditCategory",{category:category})
}
const updatecat=async (req,res)=>
{
console.log(req.body);
const catdetail =await mongoCategory.MainCategory.findOne({_id:ObjectId(req.body.catid)})
await ProductStore.updateMany({Category:catdetail.MainCategory},{Category:req.body.newcat})
await mongoCategory.MainCategory.updateOne({MainCategory:catdetail.MainCategory},{$set:{MainCategory:req.body.newcat}})
res.json(true)
}



const changeSubCategory=async (req,res)=>
{console.log(req.body);

  await ProductStore.updateMany({SubCategory:req.body.subcat},{SubCategory:req.body.newsubcat})
  console.log(await mongoCategory.MainCategory.findOne({_id: ObjectId(req.body.catid)}));
await mongoCategory.MainCategory.updateOne({_id: ObjectId(req.body.catid), SubCategory:req.body.subcat}, {$set: {'SubCategory.$': req.body.newsubcat}} ,(e,s)=>
{
  if(e)
  console.log(e);
  else
  console.log(s);
}).clone();
res.json(true)  

}
const deleteSubCat=async(req,res)=>
{
  await mongoCategory.MainCategory.updateOne({ _id: ObjectId(req.body.catid) },
     { $pull: { 'SubCategory': req.body.subcat }})
     res.json(true)

}

const addNewSubcat=(req,res)=>
{


console.log(req.body);

mongoCategory.MainCategory.updateOne({_id:req.body.catid},{$push:{SubCategory:req.body.newsubCatagory}},(e,s)=>
{
  if(e)
  console.log(e);
  else
  console.log(s);
})

res.redirect("/admin/editcategory?catid="+req.body.catid)
}

const deletecat=async(req,res)=>
{
console.log(req.body);
 await mongoCategory.MainCategory.remove({_id:req.body.catid},(e,s)=>
 {
  if(e)
  console.log(e);
  else
  console.log(s);
 }).clone()
 res.json(true)
}


module.exports = { AddCategory, ListCategory, getCategory, productadd
,AddPhoto ,EditCat,OrderHelper,EditCategory,updatecat,changeSubCategory,
deleteSubCat,addNewSubcat,deletecat

};
