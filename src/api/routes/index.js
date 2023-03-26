/* eslint-disable no-multiple-empty-lines */
/* eslint-disable linebreak-style */
// where we specify the road for the functions

const express = require('express');


const octopia_sync = require('./octopia-sync');
const octopia_sync_product_queue = require('./octopia-sync-product-queue');

const vidaxl_sync = require('./vidaxl-sync');
const vidaxl_sync_product_queue = require('./vidaxl-sync-product-queue');

// You can use it with router.use('/route', is_auth, router)

const router = express.Router();

// definition of the paths (route.use('path,constant that leads to the path))

// Turn over extract route.
router.use('/octopia-sync', octopia_sync);
router.use('/octopia-sync-product-queue', octopia_sync_product_queue);

router.use('/vidaxl-sync', vidaxl_sync);
router.use('/vidaxl-sync-product-queue', vidaxl_sync_product_queue);




module.exports = router;
