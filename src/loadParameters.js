const fs = require('fs');
const { Storage } = require('@google-cloud/storage');
const dotenv = require('dotenv');

const CLOUD_STORAGE = {
  Bucket: process.env.NODE_ENV,
  ParametersFileName: process.env.NODE_ENV_PARAMS
};

// Imports the Google Cloud client library

// Creates a client
const storage = new Storage();
const readFile = (FileName) => new Promise((res) => {
  console.log('Reading File');
  const archivo = storage.bucket(CLOUD_STORAGE.Bucket).file(FileName).createReadStream();
  console.log('Concat Data');
  let buf = '';
  archivo
    .on('data', (d) => {
      buf += d;
    })
    .on('end', () => res(buf));
});

const readFileLocal = (FileName) => new Promise((res) => {
  console.log('Reading File');
  const archivo = fs.createReadStream(FileName);
  console.log('Concat Data');
  let buf = '';
  archivo
    .on('data', (d) => {
      buf += d;
    })
    .on('end', () => res(buf));
});

module.exports = async () => {
  const dotParametersExits = fs.existsSync('.parameters');

  if (dotParametersExits) {
    console.log('using local parameters');
    const parameters = await readFileLocal('./.parameters');
    process.env.parameters = JSON.stringify(dotenv.parse(parameters));
    console.log(`using ${process.env.NODE_ENV} parameters`);
    return;
  }

  const parameters = await readFile(CLOUD_STORAGE.ParametersFileName);
  process.env.parameters = JSON.stringify(dotenv.parse(parameters));
  console.log(`using ${process.env.NODE_ENV} parameters`);
};
