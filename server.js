// Dependencies
// ============
var flash 				 = require('connect-flash');
var express        = require('express');
var path           = require('path');
var logger         = require('morgan');
var cookieParser   = require('cookie-parser'); // for working with cookies
var bodyParser     = require('body-parser');
var session        = require('express-session'); 
var methodOverride = require('method-override'); // for deletes in express
var passport 			 = require("./config/passport");
var config				 = require("./config/config");
// Express settings
// ================

// instantiate our app
var app            = express();

// override POST to have DELETE and PUT
app.use(methodOverride('_method'));

//allow sessions
// app.use(session({ secret: 'booty Mctootie', cookie: { maxAge: 60000 }}));
// app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));

//set up handlebars
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

var isAuth 				 = require("./config/middleware/isAuthenticated");
var authCheck 		 = require('./config/middleware/attachAuthenticationStatus');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: config.sessionKey, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(authCheck);

require('./routes')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: (app.get('env') === 'development') ? err : {}
  })
});


// our module get's exported as app.
module.exports = app;


// Where's the listen? Open up bin/www, and read the comments.
