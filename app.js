var createError = require('http-errors');
var express = require('express');
var path = require('path');
const bodyparser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
var cookieParser = require('cookie-parser');
const session = require("express-session");
var logger = require('morgan');
const mongooseConnection=require("./Connections/mongoose")
const mongooseSchema=require("./Connections/UserSchema")
var cors = require('cors')
const MongoUserData=require("./Connections/UserSchema").user_data
const MongoCategory=require("./Connections/AdminSchema").MainCategory



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter=require("./routes/adminRouter");
const multer = require('multer');
const upload = multer()
var app = express();

// if the code get broken this is it
require("dotenv").config();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use((req,res,next)=>
{
 
  next()
})


app.use((req, res, next) => { 

  if (!req.user) {
    res.header("cache-control", "private,no-cache,no-store,must revalidate");
    res.header("Express", "-3");
  }
  next();
});

app.use(cors())



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
  session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true,
  })
);


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("assets", express.static(path.join(__dirname, "public/assets")));
app.use("/userassets", express.static(path.join(__dirname, "public/accountassets")));
app.use("/assetsAdmin", express.static(path.join(__dirname, "public/AdminAssets")));
app.use("/plugins", express.static(path.join(__dirname, "public/AdminAssets/plugins")));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/admin",adminRouter)



// catch 404 and forward to error handler



app.use(function(req, res, next) {
  next(createError(404));
});

// // error handler
app.use(async function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
const user =await MongoUserData.findOne({email:req.session.user})
const cat=await MongoCategory.find()
  res.render("User/page404", {name:user,
    Category: cat,
   cartdata:[]
  });

});  



module.exports = app;
