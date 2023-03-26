/* eslint-disable no-underscore-dangle */
async function compareProductOctopia(product_json_octopia, product_json_koncrete) {
  try {
    // Compare stock and price
    if (product_json_koncrete._stock === product_json_octopia.meta._stock && product_json_koncrete._regular_price.toString() === product_json_octopia.meta._regular_price.toString()) {
      console.log('No changes');
      return false;
    }
    console.log('Product need to be updated');
    return true;
  } catch (err) {
    console.log('(compare product octopia external) Internal server error ', err);
    throw err;
  }
}
module.exports = compareProductOctopia;
