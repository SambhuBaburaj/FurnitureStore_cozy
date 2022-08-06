var express = require("express");
var router = express.Router();

const AdminHelper = require("../Helper-Admin/AdminLogin");
router.get("/",AdminHelper.SessionCheck, function (req, res) {

  res.render("admin/AdminHome", { title: "Express"});//log out success need to be added
});
router.post("/Login", AdminHelper.AdminLogin);
 
router.get("/home",AdminHelper.SessionCheck,AdminHelper.HomePage)

router.get("/Logout",(req,res)=>
{
  req.session.admin = null;
  // res.redirect("/");
  res.redirect("/admin?Logout=logout success");
})
module.exports = router; 
