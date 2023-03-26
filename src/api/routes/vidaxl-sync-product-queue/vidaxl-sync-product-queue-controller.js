const db_connection = {
  host: process.env.KONCRETE_DB_HOST ,
  port: process.env.KONCRETE_DB_PORT,
  user: process.env.KONCRETE_DB_USER, // e.g. 'my-user'
  password: process.env.KONCRETE_DB_PASSWORD, // e.g. 'my-user-password'
  database: process.env.KONCRETE_DB_DATABASE // e.g. 'my-database'
};
const db = require('knex')({
  client: 'mysql',
  connection: db_connection
});

const vidaxlBatchProductSyncInternal = require('../../../services/internal/vidaxl-sync-internal/vidaxl-batch-product-sync.service');

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function vidaxl_sync_product_queue_controller(req, res) {
  try {
    const req_body = JSON.parse(req.body);
    // const req_body = req.body; // For testing purpose
    if (req_body.data.length === 0) {
      return res.status(400).send('No data sent');
    }
    const result = await vidaxlBatchProductSyncInternal(db, req_body.data);
    await sleep(process.env.VIDAXL_BATCH_DELAY);
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500);
  }
}

module.exports = vidaxl_sync_product_queue_controller;
