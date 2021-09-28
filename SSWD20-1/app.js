var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter= require('./routes/auth');

var session = require('express-session');
var FileStore = require('session-file-store')(session);

var app = express();


function auth (req, res, next) {
  if (!req.session.user){
  var authHeader = req.headers.authorization;
  if (!authHeader) {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');              
      err.status = 401;
      next(err);
      return;
  }
  var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  var user = auth[0];
  console.log ('User is '+user)
  var pass = auth[1];
  console.log ('Password is '+pass)
  if (user == 'admin' && pass == 'password') {
    req.session.user ='admin';
      next(); // authorized
  } else {
      var err = new Error('You are not authenticated!');
                 
      err.status = 401;
      next(err);
  }
  }
  else
  {
    if(req.session.user === 'admin') {
      next();
    }
    else {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);
    }

  }
  }


app.use(session({
    name: 'session-id',
    secret: '12345-67890-98765-43210',
    saveUninitialized: false,
    resave: false,
    store: new FileStore()

}));




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/users/logout', usersRouter);


app.use(auth)

app.use('/auth', authRouter);



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
