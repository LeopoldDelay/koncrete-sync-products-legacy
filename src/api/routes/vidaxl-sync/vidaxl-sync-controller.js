const vidaxlProductSyncInternal = require('../../../services/internal/vidaxl-sync-internal/vidaxl-sync-internal.service.js');

async function vidaxl_sync_controller(req, res) {
  try {
    const result = await vidaxlProductSyncInternal();
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500);
  }
}

module.exports = vidaxl_sync_controller;
