const AppError = require('./../utils/appError');

const handleJsonWebTokenError = (err) => {
  return new AppError('Invalid token. Please log in again!', 401);
};

const handleTokenExpiredError = (err) => {
  return new AppError('Token expired. Please log in again!', 401);
};

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  } else {
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  if (err.isOperational === true) {
    if (req.originalUrl.startsWith('/api')) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message,
      });
    }
  } else {
    if (req.originalUrl.startsWith('/api')) {
      console.log(err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
      });
    } else {
      res.status(500).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later.',
      });
    }
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'JsonWebTokenError') {
      err = handleJsonWebTokenError(err);
    }

    if (err.name === 'TokenExpiredError') {
      err = handleTokenExpiredError(err);
    }

    sendErrorProd(err, req, res);
  }
};
