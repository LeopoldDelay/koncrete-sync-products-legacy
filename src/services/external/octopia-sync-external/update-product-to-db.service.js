async function updateKoncreteProducts(db, products_to_update) {
  // For now, just editing meta, since the post is not expeteted to change
  // It will allow to avoid errors for now
  try {
    products_to_update.forEach(async (product) => {
      const product_id = product.product_db_id;
      // Updating stock value
      await db('wp_postmeta').update({ meta_value: product.meta._stock })
        .where({ meta_key: '_stock', post_id: product_id });
      // Updating stock status if stock is null
      if (product.meta._stock === 0 || product.meta._stock === '0') {
        await db('wp_postmeta').update({ meta_value: 'outofstock' })
          .where({ meta_key: '_stock_status', post_id: product_id });
      } else {
        await db('wp_postmeta').update({ meta_value: 'instock' })
          .where({ meta_key: '_stock_status', post_id: product_id });
      }
      // Updating price
      await db('wp_postmeta').update({ meta_value: parseFloat(product.meta._regular_price).toFixed(2) })
        .where({ meta_key: '_regular_price', post_id: product_id });
      if (product.meta._sale_price) {
        try {
          await db('wp_postmeta').update({ meta_value: parseFloat(product.meta._sale_price).toFixed(2) })
            .where({ meta_key: '_sale_price', post_id: product_id });
        } catch (err) {
          await db('wp_postmeta').insert({ meta_value: parseFloat(product._sale_price).toFixed(2), meta_key: '_sale_price', post_id: product_id });
        }
      }
      // console.log(`Product updated ${product.post.post_title} is now -> Stock : ${product.meta._stock} and Regular Price (HT) : ${product.meta._regular_price}, Sale price (HT) : ${product.meta._sale_price}`);
    });
    return {
      status: 200,
      message: `${products_to_update.lenght} products updated`
    };
  } catch (err) {
    console.log(`(update product to db by sku external) Internal server error ${err}`);
    throw err;
  }
}

module.exports = updateKoncreteProducts;
