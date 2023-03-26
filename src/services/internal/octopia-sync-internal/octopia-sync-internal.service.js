const treatOctopiaCSV = require('../../external/octopia-sync-external/treat-octopia-csv.service');
const DownloadOctopiaProduct = require('../../external/octopia-sync-external/get-octopia-product-FTP.service');

const local_dst = 'C:/Users/Léopold/Desktop/tmp/CATALOGUE_KONCRETE_FR.csv';
const path = process.env.OCTO_SAVED_FILE_PATH || local_dst;

async function octopiaProductSyncInternal() {
  try {
    await DownloadOctopiaProduct(path);
    const res = await treatOctopiaCSV(path);
    return res;
  } catch (err) {
    console.log('(Octopia product sync internal) Internal server error :', err);
    throw err;
  }
}

module.exports = octopiaProductSyncInternal;
