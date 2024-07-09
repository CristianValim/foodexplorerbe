// errorMiddleware.js (Backend)
function errorMiddleware(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Erro interno do servidor';
  
    res.status(statusCode).json({
      status: 'error',
      message
    });
  }
  
  module.exports = errorMiddleware;
  