/* eslint-disable func-names */

async function getKoncreteProductsBySKU(db, product_json) {
  try {
    const sku_list = product_json.map((a) => `"${a.meta._sku.toString()}"`);
    const res = await db.raw(`select wp_posts.*, meta_sku.meta_value as "_sku", meta_stock.meta_value as "_stock", meta_reg_price.meta_value as "_regular_price"
     from wp_posts 
     join wp_postmeta as meta_sku on wp_posts.ID = meta_sku.post_id and meta_sku.meta_key="_sku" 
     join wp_postmeta as meta_stock on wp_posts.ID = meta_stock.post_id and meta_stock.meta_key="_stock" 
     join wp_postmeta as meta_reg_price on wp_posts.ID = meta_reg_price.post_id and meta_reg_price.meta_key="_regular_price" 
     where meta_sku.meta_value in (${sku_list}) `);
    return res[0];
  } catch (err) {
    console.log('(get koncrete product from db by sku) Internal server error :', err);
    throw err;
  }
}

module.exports = getKoncreteProductsBySKU;
