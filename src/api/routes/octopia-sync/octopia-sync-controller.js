const octopiaProductSyncInternal = require('../../../services/internal/octopia-sync-internal/octopia-sync-internal.service');

async function octopia_sync_controller(req, res) {
  try {
    const promise = await octopiaProductSyncInternal();
    return res.status(200).send(promise);
  } catch (err) {
    return res.status(500).send('Internal server error');
  }
}

module.exports = octopia_sync_controller;
