var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var db = require('./config/connection');
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var session = require('express-session');
var fileUpload = require("express-fileupload");
var app = express();
var MongoStore = require('connect-mongo');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs' , hbs({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/'}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  key: "user_sid",
  secret:"Key",
  cookie:{maxAge: 365 * 24 * 60 * 60 * 60 * 1000},
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({
  mongoUrl: 'mongodb+srv://hari:123@sample.rfsqu.mongodb.net/sessionStorage?retryWrites=true&w=majority',
  ttl: 365 * 24 * 60 * 60 
  })
}));
app.use(fileUpload());

db.connect((err)=>{
  if(err){
    console.log("Connection Failed");
    }
  else{
    console.log("Database Connected");
  }
  
});

app.get('/ping', function(req, res){
  req.session.destroy();
  res.send(200); 
});

app.use('/', userRouter);
app.use('/admin', adminRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
