/* eslint-disable no-param-reassign */
const octopia_category_mapping = require('../../../config/mapping_categories_octopia.json');

async function getCategoryIdFromOctopiaProduct(product) {
  try {
    const index = octopia_category_mapping.findIndex((item, i) => item.ID_CATEG_NIV3.toString() === product.post.octopia_category_3_id.toString());
    if (!octopia_category_mapping[index] || octopia_category_mapping[index].ID_CAT_KONCRETE === 0) {
      return false;
    }
    product.post.categories = [{ id: octopia_category_mapping[index].ID_CAT_KONCRETE }];
    // console.log(product);
    return true;
  } catch (err) {
    console.log('(get category octopia product) Internal server error : ', err);
    throw err;
  }
}
module.exports = getCategoryIdFromOctopiaProduct;

