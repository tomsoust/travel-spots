function requestLogger(req, res, next) {
  console.log(`${req.method} ${req.path} ${new Date().toLocaleString()}`)
  next();
}

module.exports = requestLogger;