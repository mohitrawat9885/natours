const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = err => {
  // console.log(err);
  value = err.keyValue.name;
  // const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
  // console.log(value);
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  }
};

const handleJWTError = () =>
  new AppError('Invalid Token. Please log in again!', 401);

const sendErrorProd = (err, req, res) => {
  console.log('ERROR 😒', err);

  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
      // Programming or other unknown error  donot leak error detail
    }
    // 1) Log error
    // 2 Send message
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }
  // B
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
    // Programming or other unknown error  donot leak error detail
  }
  // 1) Log error
  console.log('ERROR 😒', err);
  // 2 Send message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.'
  });
  // Operational, trusted error: send message to client
};

module.exports = (err, req, res, next) => {
  // console.log('Mess', err.message);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // console.log(err.name);
    let error = { ...err };
    // console.log(err);
    error.message = err.message;

    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    // console.log('Prod', error);
    // error.message = err.message;
    sendErrorProd(error, req, res);
  }
};
