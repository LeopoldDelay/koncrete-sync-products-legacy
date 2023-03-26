const Client = require('ssh2-sftp-client');
const fs = require('fs');
const utf8 = require('utf8');
const { resolveSoa } = require('dns');

const config = {
  host: process.env.OCTO_FTP_CATALOGUE_HOST ,
  port: process.env.OCTO_FTP_CATALOGUE_PORT ,
  user: process.env.OCTO_FTP_CATALOGUE_USER ,
  password: process.env.OCTO_FTP_CATALOGUE_PASSWORD
};
const src = 'CATALOGUE_KONCRETE_FR.csv';

async function downloadFile(client, srcFile, dstFile) {
  const fileExists = await client.exists(srcFile);
  if (fileExists) {
    console.log(`Remote file found: ${srcFile}`);
    await client.fastGet(srcFile, dstFile, { encoding: 'ANSI' });
    console.log(`File downloaded to ${dstFile}`);
  } else {
    console.log(`Remote file does not exist: ${srcFile}`);
  }
}

async function DownloadOctopiaProduct(downloadPath) {
  try {
    const client = new Client();
    try {
      await client.connect(config);
      await downloadFile(client, src, downloadPath);
    } catch (err) {
      console.error(err.message);
      throw new Error(err);
    } finally {
      await client.end();
    }
    return `File downloaded to : ${src}`;
  } catch (err) {
    console.log('(octopia sync get product FTP) Internal server error :', err);
    return err;
  }
}

module.exports = DownloadOctopiaProduct;
