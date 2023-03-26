// const loadEnv = require('./src/loadEnv');
// const loadParameters = require('./src/loadParameters');

// loadEnv().then(() => {
// loadParameters().then(() => {
// eslint-disable-next-line global-require
const server = require('./src/server');

server.start();
// });
// });
