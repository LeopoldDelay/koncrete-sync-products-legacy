/* eslint-disable no-param-reassign */
const getKoncreteProductsBySKU = require('../../external/octopia-sync-external/get-product-from-db.service');
const updateMissingProductsStock = require('../../external/octopia-sync-external/update-missing-products-stock.service');
const updateKoncreteProductTimestamp = require('../../external/octopia-sync-external/update-product-koncrete-timestamp.service');
const updateKoncreteProducts = require('../../external/octopia-sync-external/update-product-to-db.service');
const createProductsVidaxlInternal = require('./create-products-vidaxl.service');

const now_timestamp = new Date();
const seller_tag_id = process.env.VIDAXL_SELLER_TAG_ID || 1142;

async function vidaxlBatchProductSyncInternal(db, products_json) {
  try {
    const products_to_create = [];
    const products_not_to_update = [];
    const products_to_update = [];
    const products_on_db = await getKoncreteProductsBySKU(db, products_json);
    products_json.forEach((product) => {
      // Need to check if the product is already in db
      let is_product_on_db = false;
      let does_product_need_update = true;
      products_on_db.every((product_on_db) => {
        if (product_on_db._sku === product.meta._sku) {
          is_product_on_db = true;
          product.product_db_id = product_on_db.ID;
          if (product_on_db._stock.toString() === product.meta._stock.toString() && product_on_db._regular_price.toString() === product.meta._regular_price.toString()) {
            does_product_need_update = false;
            products_not_to_update.push(product);
          } else {
            products_to_update.push(product);
          }
          return false;
        }
        return true;
      });
      if (!is_product_on_db) {
        products_to_create.push(product);
      }
    });
    // Then mark all products as updated in post (product_to_update + product_not_to_update)
    await updateKoncreteProducts(db, products_to_update);
    await updateKoncreteProductTimestamp(db, products_on_db, now_timestamp);
    console.log(`[INFO] ${products_on_db.length} product's timestamps have been updated`);
    // Then create products that are not on koncrete db yet
    await createProductsVidaxlInternal(products_to_create);
    // Then mark all products that have not been updated since 2 cycles as stock = 0
    const limit_timestamp = new Date();
    limit_timestamp.setDate(limit_timestamp.getDate() - process.env.OCTOPIA_DAY_LIMIT_NO_PRODUCT);
    limit_timestamp.toISOString();
    await updateMissingProductsStock(db, limit_timestamp, seller_tag_id);
    console.log('[BATCH INFO] Product created : ', products_to_create.length, ' | Product updated : ', products_to_update.length, ' | Product not updated : ', products_not_to_update.length);
    return { status: 200, message: 'Product have all been updated' };
  } catch (err) {
    console.log('(Octopia single product sync internal) Internal server error :', err);
    throw err;
  }
}

module.exports = vidaxlBatchProductSyncInternal;
