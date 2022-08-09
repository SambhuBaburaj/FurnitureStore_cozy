var express = require("express");
var router = express.Router();

const AdminHelper = require("../Helper-Admin/AdminLogin");
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
  

router.get("/DeActive/:values",AdminHelper.StatusChange,(req,res)=>
{
// console.log(req.params.values);
res.redirect("/admin/UsersDetails")

})
router.get("/Active",AdminHelper.UnBlock,(req,res)=>{
  res.redirect("/admin/UsersDetails")
})

router.get("/Dashboard",(req,res)=>
{

  res.redirect("/admin/home")
})

module.exports = router;
