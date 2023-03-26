const express = require('express');
const bodyParser = require('body-parser');

const octopia_sync_product_queue_controller = require('./octopia-sync-product-queue-controller');

const router = express.Router();

router.use('/', bodyParser.raw({ type: 'application/octet-stream' }));
router.post('/', octopia_sync_product_queue_controller);

// Turn over extract route.

module.exports = router;
