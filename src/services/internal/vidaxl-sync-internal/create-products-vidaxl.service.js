/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const createProductExternal = require('../../external/octopia-sync-external/create-product-koncrete-external.service');
const getCategoryIdFromOctopiaProduct = require('../../external/octopia-sync-external/get-category-product-octopia.service');

async function createProductsVidaxlInternal(products_to_create) {
  const response_list = [];
  for (const product of products_to_create) {
    const response = await createProductExternal(product);
    response_list.push(response);
  }
  return response_list;
}

module.exports = createProductsVidaxlInternal;
