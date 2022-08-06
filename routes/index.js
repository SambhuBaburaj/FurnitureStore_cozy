var express = require("express");
var router = express.Router();
const UserHelper = require("../Helper-User/UserRegister_helper");

/* GET home page. */

router.get("/", function (req, res, next) {
  res.render("user/Home", { title: "Express" });
});

router.get("/User-login", (req, res) => {
  res.render("user/User-login");
});

router.get("/My-account", (req, res) => { 
  res.render("user/User-profile");
}); 

router.post("/Create-account", UserHelper.New_user, (req, res) => {});

module.exports = router;
