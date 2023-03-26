/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;

const WooCommerce = new WooCommerceRestApi({
  url: process.env.WC_REST_API_KONCRETE_URL ,
  consumerKey: process.env.WC_REST_API_KONCRETE_KEY,
  consumerSecret: process.env.WC_REST_API_KONCRETE_SECRET,
  version: 'wc/v3'
});

async function updateAltImage(products_to_update) {
  try {
    for (const product of products_to_update) {
      const data = {
        images: product.meta._images
      };
      let res;
      await WooCommerce.put(`products/${product.product_db_id}`, data)
        .then((response) => {
          console.log('lat text updated');
          if (response.data.sale_price) console.log(` and sale price (HT) : ${response.data.sale_price}`);
          res = response.data;
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            console.log(`[ERROR] Error ${error.response.data.message}`);
          } else if (typeof error === 'object' && error !== null && 'toString' in error) {
            console.log(error.toString());
          } else {
            console.log('[ERROR] Unknown error : ', error);
          }
          if (error.response && error.response.data && error.response.data.code === 'product_invalid_sku') {
            console.log('[ERROR] Concerned SKU ', data.sku);
          }
          res = error;
        });
    }
    return 'done';
  } catch (error) {
    console.log('(update alt text) Internal server error : ', error);
  }
}
module.exports = updateAltImage;
