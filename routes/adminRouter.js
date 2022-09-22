var express = require("express");
var router = express.Router();
const AdminCategory = require("../Helper-Admin/CategoryManagement");
const AdminHelper = require("../Helper-Admin/AdminLogin");
const OrderHelper = require("../Helper-Admin/OrderHelper");

const DashHelper=require("../Helper-Admin/DashBoardHelper")
const ProductManagement = require("../Helper-Admin/ProductManagement");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/AdminAssets/images/addProduct");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "--" + file.originalname);
  },
});
var upload = multer({
  storage: storage,
});

router.get("/", AdminHelper.SessionCheck, function (req, res) {
  // res.render("admin/AdminHome", { title: "Express" }); //log out success need to be added
  res.redirect("/admin/home")
});

router.post("/Login", AdminHelper.AdminLogin);

router.get("/home", AdminHelper.SessionCheck, AdminHelper.HomePage);

router.get("/Logout", (req, res) => {
  req.session.admin = null;
  res.redirect("/admin?Logout=logout success");
});
const a = AdminHelper.FindData;
router.get(
  "/UsersDetails",
  AdminHelper.SessionCheck,
  AdminHelper.FindData,
  (req, res) => {
    // res.send("evjvs")
    // res.render("admin/UsersDetails")
  }
);

router.get(
  "/DeActive/:values",
  AdminHelper.SessionCheck,
  AdminHelper.StatusChange,
  (req, res) => {
    // console.log(req.params.values);
    // res.redirect("/admin/UsersDetails")
  }
);
router.get(
  "/Active",
  AdminHelper.SessionCheck,
  AdminHelper.UnBlock,
  (req, res) => {
    res.redirect("/admin/UsersDetails");
  }
);

router.get("/Dashboard", (req, res) => {
  res.redirect("/admin/home");
});
router.get(
  "/AddCategory",
  AdminHelper.SessionCheck,
  AdminCategory.ListCategory,
  (req, res) => {}
);

router.post(
  "/AddCategory",
  AdminHelper.SessionCheck,
  AdminCategory.AddCategory,
  (req, res) => {
    res.redirect("/admin/AddCategory?cat=1");
  }
);
router.post(
  "/getsubCategory",
  AdminHelper.SessionCheck,
  AdminCategory.getCategory
),
  (req, res) => {};
router.post(
  "/productAdd",
  AdminHelper.SessionCheck,
  upload.array("images", 7),
  (req, res, next) => {
    if (!req.files) {
      console.log("no files");
    }
    next();
  },
  AdminCategory.productadd
);

router.get(
  "/ViewProducts",
  (req, res, next) => {
    next();
  },
  ProductManagement.ViewProducts
);

router.get("/managecat", AdminCategory.EditCat, (req, res) => {});
router.get(
  "/UserOrder",
  (req, res, next) => {
    next();
  },
  AdminCategory.OrderHelper
);

router.get("/editcatgory", (req, res) => {
  res.send("edit here");
});

router.post("/orderModify",OrderHelper.OrderStatus, (req, res) => {});

router.get("/editcategory",AdminCategory.EditCategory,(req,res)=>
{

})


router.post("/updateCategory",(req,res,next)=>
{
next();
}
,AdminCategory.updatecat)



router.post("/updatesubCategory",AdminCategory.changeSubCategory,(req,res)=>
{

})
router.post("/deletesubcat",AdminCategory.deleteSubCat)



router.post("/updateNewSubCatagory",AdminCategory.addNewSubcat)

router.post("/deleteCategory",AdminCategory.deletecat)
router.get("/editproduct",ProductManagement.editproduct)




router.post("/saveeditpditproduct",upload.array("images",7),(req,res,next)=>
{
  

    if (!req.files) {
      console.log("no files");
    }
    next();



},ProductManagement.updateProduct)


router.post("/deleteimage",ProductManagement.deleteimage,(req,res)=>
{


})

router.post("/deleteproduct",ProductManagement.deleteproduct)

router.get("/bannerview",ProductManagement.BannerView)

router.get("/AddBanner",ProductManagement.AddBanner,(req,res)=>
{

})

router.post("/AddBanner", upload.array("images"),(req,res,next)=>
{
  if (!req.files) {
    console.log("no files");
  }
  next();
},ProductManagement.postBanner)

router.post("/deleteBanner",ProductManagement.deletebanner)

router.get("/editbanner",ProductManagement.editBanner)


router.post("/deleteBannerimage",ProductManagement.deletebannerimage)
router.post("/saveeditBanner",upload.array("images",1),(req,rea,next)=>
{
  if (!req.files) {
    console.log("no files");
  }
  next();
},ProductManagement.saveeditbanner)


router.get("/usercount",DashHelper.usercount)
router.get("/revenuecount",DashHelper.revenuecount)
router.get("/totaloreders",DashHelper.ordercount)
router.get("/cancelcount",DashHelper.cancelcount)
router.get("/linechart",DashHelper.linechart)
router.get("/donutchart",DashHelper.donutchart)
router.get("/revenuereport",DashHelper.revenuereport)

router.get("/CuponsControl",OrderHelper.Couponsview)
router.get("/addCoupons",OrderHelper.addCoupons)
router.post("/AddCoupons",OrderHelper.SaveCoupons)

module.exports = router;
