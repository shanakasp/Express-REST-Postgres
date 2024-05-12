const globalErrorController = (err, req, res, next) => {
  (err, req, res, next) => {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
    });
  };
};
module.exports = globalErrorController;
