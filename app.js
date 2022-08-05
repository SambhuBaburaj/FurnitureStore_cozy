var createError = require('http-errors');
var express = require('express');
var path = require('path');
const bodyparser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongooseConnection=require("./Connections/mongoose")
const mongooseSchema=require("./Connections/UserSchema")

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter=require("./routes/adminRouter")
var app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use((req, res, next) => { 
  if (!req.user) {
    res.header("cache-control", "private,no-cache,no-store,must revalidate");
    res.header("Express", "-3");
  }
  next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("assets", express.static(path.join(__dirname, "public/assets")));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/admin",adminRouter)



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
