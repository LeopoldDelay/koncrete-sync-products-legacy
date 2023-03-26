const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;

const WooCommerce = new WooCommerceRestApi({
  url: process.env.WC_REST_API_KONCRETE_URL,
  consumerKey: process.env.WC_REST_API_KONCRETE_KEY ,
  consumerSecret: process.env.WC_REST_API_KONCRETE_SECRET ,
  version: 'wc/v3'
});

async function createProductKoncrete(product_formated) {
  try {
    let res;
    const data = {
      name: product_formated.post.post_title,
      type: product_formated.meta._product_type,
      description: product_formated.post.post_content,
      short_description: product_formated.post.post_content,
      images: product_formated.meta._images,
      sku: product_formated.meta._sku,
      manage_stock: true,
      stock_quantity: product_formated.meta._stock,
      status: product_formated.post.status,
      categories: product_formated.post.categories,
      tags: product_formated.post.tags,
      meta_data: product_formated.meta._woocommerce_meta
    };
    if (product_formated.meta._regular_price) data.regular_price = parseFloat(product_formated.meta._regular_price).toFixed(2).toString();
    if (product_formated.meta._sale_price) data.sale_price = parseFloat(product_formated.meta._sale_price).toFixed(2).toString();
    if (product_formated.meta._stock === 0 || product_formated.meta._stock === '0') data.stock_status = 'outofstock';
    await WooCommerce.post('products', data)
      .then((response) => {
        console.log(`[INFO - PRODUCT CREATED] Product ${response.data.name} created in ${response.data.categories[0].name} with ${response.data.stock_quantity} stock at regular price (HT) :  ${response.data.regular_price}€`);
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
    return res;
  } catch (err) {
    console.log('(create product koncrete) Internal server error : ', err);
    throw err;
  }
}

module.exports = createProductKoncrete;
