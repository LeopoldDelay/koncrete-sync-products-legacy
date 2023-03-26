const express = require('express');

const vidaxl_sync_controller = require('./vidaxl-sync-controller');

const router = express.Router();

router.get('/', vidaxl_sync_controller);

// Turn over extract route.

module.exports = router;
