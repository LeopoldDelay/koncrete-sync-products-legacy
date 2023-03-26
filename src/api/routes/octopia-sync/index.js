const express = require('express');

const octopia_sync_controller = require('./octopia-sync-controller');

const router = express.Router();

router.get('/', octopia_sync_controller);

// Turn over extract route.

module.exports = router;
