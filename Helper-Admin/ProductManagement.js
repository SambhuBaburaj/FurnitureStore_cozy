require("dotenv").config();
const mongoCategory = require("../Connections/AdminSchema");
const ProductStore=require("../Connections/AdminSchema").Products
const multer = require('multer');
const { ObjectId } = require("mongodb");
const MongoBanner=require("../Connections/UserSchema").BannerControl
const ViewProducts=async (req,res)=>
{

    console.log('here');
   const Products=await ProductStore.find()
   console.log(Products); 
  
//    console.log(category);
res.render("admin/viewProduct",{products:Products,})

}



const editproduct=async(req,res)=>
{
    const category=await mongoCategory.MainCategory.find()
console.log(req.query.productid);
const product=await ProductStore.findOne({_id:ObjectId(req.query.productid)})

res.render("admin/EditProduct",{product:product,category:category})

}




const updateProduct=async(req,res)=>
{

// console.log(req.files,"whf9wjef");
if(req.files[0])
{
var filenames = req.files.map(function (file) {
    return file.filename;
});
// console.log(filenames);
req.body.images = filenames;

console.log("imges",req.body.images);

await ProductStore.updateOne({_id:ObjectId(req.body.productid)},{$push:{'Images':{$each : req.body.images}}})
}

// console.log(req.body);
// console.log( await ProductStore.findOne({_id:ObjectId(req.body.productid)}));

// console.log(req.body);

await ProductStore.updateOne({_id:ObjectId(req.body.productid)},{$set:{ProductName:req.body.ProductName,Price:req.body.price,Discount:req.body.DisPrice,Disc:req.body.desc}})




if(req.body.Category)
{
    await ProductStore.updateOne({_id:ObjectId(req.body.productid)},{Category:req.body.Category,SubCategory:req.body.subCategory})

}
res.redirect("/admin/editproduct?productid="+req.body.productid)
}

const deleteimage=async (req,res)=>
{
    console.log(req.body);
await ProductStore.updateOne({_id:ObjectId(req.body.id)},{$pull:{'Images':req.body.image}},(e,s)=>
{
  if(e)
  console.log(e);
  else
  console.log(s);
}).clone()


console.log(req.body);
res.json(true)
}

const deleteproduct=async(req,res)=>
{

await ProductStore.remove({_id:ObjectId(req.body.productid)})
res.json(true)

}



const BannerView=async(req,res)=>
{

const banner=await MongoBanner.find()
console.log(banner);
res.render("admin/bannerControl",{banner:banner})

}
 

const AddBanner=async (req,res)=>
{

    const category=await mongoCategory.MainCategory.find()
res.render("admin/AddBanner",{category:category})


}
const postBanner=(req,res)=>
{

    console.log(req.body);
    var filenames = req.files.map(function (file) {
        return file.filename;



    });
    req.body.images = filenames;
console.log(req.body.images);
 
const bannercontrol=new MongoBanner({
category:req.body.Category,
subcategory:req.body.subCategory,
    ProductName:req.body.bannername,
    Desc:req.body.desc,
    Image:req.body.images[0]


})
bannercontrol.save()

res.redirect("/admin/bannerview")
}



const deletebanner=async (req,res)=>
{

console.log(req.body);


await MongoBanner.remove({_id:ObjectId(req.body.bannerId)} ,(e,s)=>
{
    if(s)
    console.log(s);
    else
    console.log(e);
})
res.json(true)
}

const editBanner=async (req,res)=>
{

console.log(req.query);

const banner=await MongoBanner.findOne({_id:ObjectId(req.query.bannerid)})


const category=await mongoCategory.MainCategory.find()
res.render("admin/editbanner",{banner:banner,category:category})

}

const deletebannerimage=async (req,res)=>
{




    console.log(req.body);

await MongoBanner.updateOne({_id:req.body.bannerId},{$unset:{Image:""}})
res.json(true)

}
const saveeditbanner=async (req,res)=>
{
    var filenames = req.files.map(function (file) {
        return file.filename;

    });
    req.body.images = filenames;
console.log(req.body);
await MongoBanner.updateOne({_id:ObjectId(req.body.bannerid)},{$set:{category:req.body.Category,subcategory:req.body.subCategory,ProductName:req.body.bannername,Desc:req.body.desc,Image:req.body.images[0]}})

 res.redirect("/admin/bannerview")

}
 

module.exports={
    ViewProducts,editproduct,updateProduct,deleteimage,deleteproduct,

    BannerView,AddBanner,postBanner,deletebanner,editBanner,deletebannerimage,saveeditbanner
} 