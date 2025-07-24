var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport')
var flash = require('connect-flash')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var expressSession = require('express-session')
var loginRouter = require('./routes/login');
var signupRouter = require('./routes/signup');
var profileRouter = require('./routes/profile');
var homeRouter = require('./routes/home');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession({
  resave:false,
  saveUninitialized:false,
  secret:"helloo1234oknowbyegodourwork" 
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//flash
app.use(function (req, res, next) {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
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


passport.serializeUser(usersRouter.serializeUser());
passport.deserializeUser(usersRouter.deserializeUser())


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/profile', profileRouter);
app.use('/home', homeRouter);

// app.use(function(req, res, next) {
//   next(createError(404));
// });







module.exports = app;
