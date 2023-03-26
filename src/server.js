const express = require('express');
const bodyParser = require('body-parser');
const router = require('./api/routes');

const app = express();
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use('/', router);

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
let server;

const start = async () => new Promise((res) => {
  server = app.listen(PORT, () => {
    console.log(`(start_server) Server listening on port ${PORT}...`);
    res();
  });
});

module.exports = {
  start,
  app
};

module.exports.stop = () => server.close();
