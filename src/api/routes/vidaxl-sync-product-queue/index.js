const express = require('express');
const bodyParser = require('body-parser');

const vidaxl_sync_product_queue_controller = require('./vidaxl-sync-product-queue-controller');

const router = express.Router();

router.use('/', bodyParser.raw({ type: 'application/octet-stream' }));
router.post('/', vidaxl_sync_product_queue_controller);

// Turn over extract route.

module.exports = router;
