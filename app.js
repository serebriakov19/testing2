let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');
let logger = require('morgan');
let http = require('http');

let indexRouter = require('./routes');
let testRouter = require('./routes/test');
let pageRouter = require('./routes/page');
let testPassingRouter = require('./routes/testPassing');
let loginRouter = require('./routes/login');
let registerRouter = require('./routes/register');
let logoutRouter = require('./routes/logout');
let studentPageRouter = require('./routes/studentPage');
let teacherPageRouter = require('./routes/teacherPage');
let findRouter = require('./routes/find');
let profileRouter = require('./routes/profile');
let assessmentRouter = require('./routes/assessment');

let app = express();

// view engine setup
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev', {skip: (req, res) => {return req.originalUrl.startsWith('/bower_components') ||
        req.originalUrl.startsWith('/stylesheets')}}));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(cookieParser());

app.use(
    session({
      resave: false,
      secret: 'you secret key',
      saveUninitialized: true,
    })
)

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/test', testRouter);
app.use('/page', pageRouter);
app.use('/testPassing', testPassingRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/logout', logoutRouter);
app.use('/studentPage', studentPageRouter);
app.use('/teacherPage', teacherPageRouter);
app.use('/find', findRouter);
app.use('/profile', profileRouter);
app.use('/assessment', assessmentRouter);

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

http.createServer(app).listen(3000);
