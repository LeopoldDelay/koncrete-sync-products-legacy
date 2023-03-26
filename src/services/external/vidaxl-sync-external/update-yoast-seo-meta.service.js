async function updateYoastProductMetadata(db, products_to_update) {
  // Only fire once to update all the yoast seo meta from vidaxl, then they will be fixed on creation of the rp
  try {
    await products_to_update.forEach(async (product) => {
      const product_id = product.product_db_id;
      await db('wp_postmeta').insert([{
        post_id: product_id,
        meta_key: '_yoast_wpseo_focuskw',
        meta_value: product.post.post_title.split(' ').slice(0, 7).join(' ')
          .trim()
      }]);
    });
    return {
      status: 200,
      message: 'product meta seo updated'
    };
  } catch (error) {
    console.log('(update yoast seo metadata product) Internal server error : ', error);
    throw error;
  }
}
module.exports = updateYoastProductMetadata;
