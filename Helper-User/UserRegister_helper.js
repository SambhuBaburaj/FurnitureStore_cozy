const mongoConnection = require("../Connections/UserSchema");
const bcrypt = require("bcrypt");
const session = require("express-session");
const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
const MongoCategory=require("../Connections/AdminSchema").MainCategory
const MongoWallet=require("../Connections/UserSchema").UserWallet
const MongoUserData=require("../Connections/UserSchema").user_data






async function cartdata(user)
{
    console.log(user);
    const UserId=await MongoUserData.findOne({email:user});

   if(UserId)
   {
  // console.log(UserId._id);
  cartDetails=await MongoCart.findOne({UserId:UserId._id})
    
    
  //  const ProductId=cartDetails.product;
  //  const MatchCartUserId=await MongoCart.aggregate([{$match:{UserId:UserId._id}}])
   
   
   const CartProduct=await MongoCart.aggregate([{$match:{UserId:UserId._id}},{$unwind:'$product'},{$project:{ItemId:'$product.ItemId',
   Quantity:'$product.Quantity'}}, {
     $lookup:{
         from:'productdetails',
         localField:'ItemId', 
         foreignField:'_id',
         as:'product'
     }}, {$project:{
       ItemId: 1, Quantity: 1 ,product: { $arrayElemAt: ['$product',0]}
   }}])
console.log(CartProduct);
return CartProduct
   }
   else 
   return [];
  
}

const CategoryList=async()=>

{
   return await MongoCategory.find()
}



const SessionCheck=async(req,res,next)=>
{
if(!req.session.user)
{


// res.send("greong")
 res.redirect("/UserLogin")

}
else
{
  next()
}
next()
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
    res.render("user/User-login", { user: req.session.user,duplicate: "email already exist" ,cartdata:await cartdata(req.session.user),Category:await CategoryList()});
  } else {













    const hashed = await secure_password(req.body.user_password);

    const new_user = new mongoConnection.user_data({
      username: req.body.username,
      email: req.body.user_email,
      password: hashed,
      phone: req.body.Phone,
      isBlocked:0,
      date:new Date()
    }); 
    new_user.save((e,s)=>
    {
      if(e)
      {
      console.log( "rgesrfer", e);
      }
      else
      {
console.log(s);


      }
    });


    const newUserWallet=new MongoWallet({

      userId:new_user._id,
      balance:0
    })
    newUserWallet.save()
    


    res.render("user/User-login",{user: req.session.user,logout:"account created",Category:await CategoryList(),cartdata:await cartdata(req.session.user)})
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
   
console.log(req.session.returnto);
   if(req.session.returnto)
   { 
    console.log(req.session.returnto);
    res.redirect(req.session.returnto);
   }
   else{
    res.redirect("/")
   }
  } else {
    res.render("user/User-login", {user: req.session.user,
      title: "express",
      duplicate: "email/password is incorrect",Category:await CategoryList(),cartdata:await cartdata(req.session.user)
    });
  } 
} else { 
  res.render("user/User-login", {user: req.session.user,
    title: "express",
    duplicate: "email/password is incorrect",Category:await CategoryList(),cartdata:await cartdata(req.session.user)

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
    .then(async(verification) => {
    res.render("user/OtpConfirm",{user: req.session.user,number:MobileNumber,Category:await CategoryList(),cartdata:await cartdata(req.session.user)})
    })
    .catch((err)=>console.log("its an error",err));
}

   
  else
  {
res.render("user/OTPnumber",{user: req.session.user,wrongnumber:"entered number does not exist",cartdata:await cartdata(req.session.user),Category:await CategoryList()})

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

res.render("user/OtpConfirm",{user: req.session.user,otpvalue:"invalid OTP",cartdata:await cartdata(req.session.user),Category:await CategoryList()})
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
