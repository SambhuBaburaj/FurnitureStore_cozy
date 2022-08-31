var express = require("express");
var router = express.Router();
const AdminCategory=require("../Helper-Admin/CategoryManagement")
const AdminHelper = require("../Helper-Admin/AdminLogin");
const ProductManagement = require("../Helper-Admin/ProductManagement");
const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file,cb) {
      cb(null,'./public/AdminAssets/images/addProduct')
  },
  filename: function (req, file, cb) {
      cb(null,Date.now()+"--"+ file.originalname)
  }
})
var upload = multer({
  storage: storage,
})




router.get("/", AdminHelper.SessionCheck, function (req, res) {
  res.render("admin/AdminHome", { title: "Express" }); //log out success need to be added
});

 

router.post("/Login", AdminHelper.AdminLogin);

router.get("/home", AdminHelper.SessionCheck, AdminHelper.HomePage);

router.get("/Logout", (req, res) => { 
  req.session.admin = null;
  res.redirect("/admin?Logout=logout success");
});
const a= AdminHelper.FindData
router.get("/UsersDetails",AdminHelper.SessionCheck,AdminHelper.FindData,(req,res)=>
{
 
 

  // res.send("evjvs")       
  // res.render("admin/UsersDetails")
})
  

router.get("/DeActive/:values",AdminHelper.SessionCheck,AdminHelper.StatusChange,(req,res)=>
{
// console.log(req.params.values);
// res.redirect("/admin/UsersDetails")

})
router.get("/Active",AdminHelper.SessionCheck,AdminHelper.UnBlock,(req,res)=>{
  res.redirect("/admin/UsersDetails")
})

router.get("/Dashboard",(req,res)=>
{

  res.redirect("/admin/home")
})
router.get("/AddCategory",AdminHelper.SessionCheck,AdminCategory.ListCategory,(req,res)=>
{


})

router.post("/AddCategory",AdminHelper.SessionCheck,AdminCategory.AddCategory,(req,res)=>
{
  res.redirect("/admin/AddCategory?cat=1")
})
router.post("/getsubCategory",AdminHelper.SessionCheck,AdminCategory.getCategory),(req,res)=>
{

}
router.post("/productAdd",AdminHelper.SessionCheck,upload.array("images", 7),(req,res,next)=>
{
  if (!req.files) {
    console.log("no files");
    
    }
next()
},AdminCategory.productadd
)


router.get("/ViewProducts",(req,res,next)=>
{
next()
},ProductManagement.ViewProducts
)

module.exports = router;
 