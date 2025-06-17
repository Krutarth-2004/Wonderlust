// Wrap async functions to catch errors and pass to next()
function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
}

module.exports = wrapAsync;
