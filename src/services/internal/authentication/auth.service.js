const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;
console.log(`(auth_service) secret --> ${secret}`);

const authService = () => {
  const issue = (payload) => jwt.sign(payload, secret);
  const verify = (token, callback) => jwt.verify(token, secret, {}, callback);

  return {
    issue,
    verify
  };
};

module.exports = authService;
