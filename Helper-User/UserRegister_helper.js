const mongoConnection = require("../Connections/UserSchema");
const bcrypt = require("bcrypt");
const session = require("express-session");
const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

const SessionCheck=(req,res)=>
{
if(!req.session.user)
{
  res.render("user/User-login", { duplicate: "login Again" });
}
next();
}

const LoginSession=(req,res,next)=>
{
  if(req.session.user)
{
  res.redirect("/")
}
next()
}


//user SignUp post
const New_user = async (req, res) => {
  const duplicate = await mongoConnection.user_data.findOne({
    email: req.body.user_email,
  });
  console.log(req.body.user_email);
  if (duplicate) {
    res.render("user/User-login", { duplicate: "email already exist" });
  } else {

    const hashed = await secure_password(req.body.user_password);

    const new_user = new mongoConnection.user_data({
      username: req.body.username,
      email: req.body.user_email,
      password: hashed,
      phone: req.body.Phone,
      isBlocked:0
    }); 
    new_user.save();
    res.render("user/User-login",{logout:"account created"})
  }
};



//hashing password
const secure_password = async (password) => {
  try {
    const password_hash = await bcrypt.hash(password, 10);
    return password_hash;
  } catch (error) {
    console.log(error);
  }
};



//Login
const Login=async(req,res)=>
{

  const username = req.body.email;
    const password = req.body.password;

const CheckName = await mongoConnection.user_data.findOne({ email: username });
const block= CheckName.isBlocked
console.log(block);

if (CheckName && block==0) {
  const PasswordMatch = await bcrypt.compare(password, CheckName.password);
  if (PasswordMatch) {
    req.session.user = req.body.email;
   
    res.redirect("/");
  } else {
    res.render("user/User-login", {
      title: "express",
      duplicate: "email/password is incorrect",
    });
  }
} else {
  res.render("user/User-login", {
    title: "express",
    duplicate: "email/password is incorrect",
  });
}
}   
const Logout=(req,res,next)=>
{

req.session.user=null
next()

}
const NumberVerification =async(req,res,next)=>
{
  const MobileNumber=req.body.PhoneNumber
  // console.log(MobileNumber);
  const CheckNumber = await mongoConnection.user_data.findOne({ phone: MobileNumber })
 
  // console.log(CheckNumber);
  // .then((verification) => {

  //   res.json({otp:true})
  // })
   
  if(CheckNumber)
  {
    client.verify.v2.services(process.env.SERVICE_ID)
    .verifications
    .create({to:'+91'+MobileNumber, channel: 'sms'})
    .then((verification) => {
    res.render("user/OtpConfirm",{number:MobileNumber})
    })
    .catch((err)=>console.log("its an error",err));
}

   
  else
  {
res.render("user/OTPnumber",{wrongnumber:"entered number does not exist"})

  }
next()
}

const OtpValidation=(req,res,next)=>
{
  const mobileNumber = req.body.number; 
  const otp = req.body.otp;
  console.log(mobileNumber);
  console.log(otp);
   client.verify.v2.services(process.env.SERVICE_ID)
      .verificationChecks
      .create({to: '+91'+mobileNumber, code: otp})
      .then (async(verification_check) => {
        let approved ='approved';
       if(verification_check.valid){
        //  otpsession(mobileNumber)
          const CheckNumber = await mongoConnection.user_data.findOne({ phone: mobileNumber})
          console.log(CheckNumber.email);
          req.session.user=CheckNumber.email
          res.redirect("/")        
          next()
        }else{
 console.log("its not working");

res.render("user/OtpConfirm",{otpvalue:"invalid OTP"})
         next()
        }
       })
   
next()
}



module.exports = {
  New_user,
  Login,
  SessionCheck,
  LoginSession,
  Logout,
  NumberVerification,
  OtpValidation
};
