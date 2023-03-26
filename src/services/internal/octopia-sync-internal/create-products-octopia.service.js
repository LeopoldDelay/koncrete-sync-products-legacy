/* eslint-disable import/order */
const createProductExternal = require('../../external/octopia-sync-external/create-product-koncrete-external.service');
const getCategoryIdFromOctopiaProduct = require('../../external/octopia-sync-external/get-category-product-octopia.service');

async function createProductsOctopiaInternal(products_to_create) {
  const response_list = [];
  products_to_create.forEach(async (product) => {
    const isCatDefined = await getCategoryIdFromOctopiaProduct(product);
    if (!product.post.categories || product.post.categories[0].id === 0 || !isCatDefined) {
      console.log(`Product ${product.post.post_title} is to be not categorised. Octopia cat id is ${product.post.octopia_category_3_id} => Creation cancelled`);
    } else {
      const response = await createProductExternal(product);
      response_list.push(response);
    }
  });
  return response_list;
}

module.exports = createProductsOctopiaInternal;
