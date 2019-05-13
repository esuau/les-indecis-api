var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var heartbeatRouter = require('./routes/heartbeat');
var authRouter = require('./routes/auth');
var getMessageRouter = require('./routes/get-message');
var addMessageRouter = require('./routes/add-message');
var availabilityRouter = require('./routes/availability')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', heartbeatRouter);
app.use('/connect', authRouter);
app.use('/get_msg', getMessageRouter);
app.use('/add_msg', addMessageRouter);
app.use('/checkavailability', availabilityRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send the error status
  res.status(err.status || 500);
  res.send();
});

module.exports = app;
