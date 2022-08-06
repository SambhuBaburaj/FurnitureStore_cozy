require("dotenv").config();

const SessionCheck= (req,res,next)=>
{
  if(!req.session.admin) {
   
res.render("admin/AdminLogin",{Authentication:req.query.LoginAgain,LogoutAdmin:req.query.Logout})
}
next();
}
const AdminLogin = (req, res) => {

  if (
    req.body.email == process.env.AdminUserName &&
    req.body.password == process.env.AdminPassword
  ) {
    console.log(process.env.AdminUserName, process.env.AdminPassword);
    req.session.admin = req.body.email;

    res.redirect("/admin/home");
  }
   else 
   {
    res.render("admin/AdminLogin", {
      title: "express",
      Authentication: "invalid Email / Password", 
    });
  }
};
const HomePage=(SessionCheck,(req,res)=>
{

      res.render("admin/AdminHome");
})

module.exports = {
  AdminLogin, 
  HomePage,
SessionCheck
}
