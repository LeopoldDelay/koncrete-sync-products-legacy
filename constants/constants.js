const isProd = process.env.NODE_ENV === 'production'; // vs preprod




module.exports = {
  IN_PRODUCTION: isProd
};
