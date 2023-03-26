const csv = require('csvtojson');
const formatProductOctopiaToKoncrete = require('../../../api/middlewares/format-octopia-product-to-koncrete');
const add_task_in_queue = require('../queues/add_task_in_queue.service');

const batch = [];
let product_json_formated;
let task_body = {};
const batch_len_limit = process.env.OCTOPIA_BATCH_LEN || 100;

async function treatOctopiaCSV(pathToCSV) {
  console.log('[INFO] Begin treatment of octopia product');
  const jsonArray = csv({ delimiter: [';'] }).fromFile(pathToCSV, { encoding: 'binary' })
    .subscribe((product_json) => new Promise(((resolve, reject) => {
      product_json_formated = formatProductOctopiaToKoncrete(product_json);
      if (product_json_formated.status === 400) {
        resolve(product_json);
      }
      // Creation of a task by batch to avoid App Engine and Koncrete server overloading
      if (batch.length < batch_len_limit) {
        batch.push(product_json_formated);
      } else {
        task_body = {
          service: 'octopia-sync-product-queue',
          data: batch
        };
        console.log('Sending to octopia queue ', task_body.data.length, ' products');
        add_task_in_queue('octopia-sync-product-queue', task_body);
        batch.length = 0;
      }
      resolve(product_json);
    })));
  await add_task_in_queue('octopia-sync-product-queue', {
    service: 'octopia-sync-product-queue',
    data: batch
  });
  console.log('Sending to octopia queue ', batch.length, ' finals products');
  console.log(`Added ${(await jsonArray).length} product to task queue`);
  return 'Products treated';
}
module.exports = treatOctopiaCSV;
