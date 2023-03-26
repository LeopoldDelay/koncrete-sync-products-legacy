const { validationResult } = require('express-validator');

function check_body_format(req, res, next) {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    console.log(`(check-body-format) Bad request: ${JSON.stringify(errors)}`);
    res.status(400).json({ status: 'Error bad request', body: errors });
  } else {
    next();
  }
}

module.exports = check_body_format;
