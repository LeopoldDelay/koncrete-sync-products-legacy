async function updateMissingProductsStock(db, limit_timestamp, seller_tag_id) {
  try {
    const postIdList = await db('wp_posts as posts').select('ID', 'post_modified')
      .join('wp_term_relationships AS term_relation', 'term_relation.object_id', 'posts.ID')
      .join('wp_postmeta as postmeta', 'postmeta.post_id', 'posts.ID')
      .where('posts.post_type', 'product')
      .andWhere('posts.post_modified', '<', limit_timestamp)
      .andWhere('term_relation.term_taxonomy_id', seller_tag_id)
      .andWhere('postmeta.meta_key', '_stock')
      .andWhere('postmeta.meta_value', '>', 0);
    const postIdListFormated = postIdList.map((a) => a.ID);
    await db('wp_postmeta').update({ meta_value: 0 }).whereIn('post_id', postIdListFormated).andWhere({ meta_key: '_stock' });
    await db('wp_postmeta').update({ meta_value: 'outofstock' }).whereIn('post_id', postIdListFormated).andWhere({ meta_key: '_stock_status' });
    return true;
  } catch (err) {
    console.log('(update missing products stock) Internal server error ', err);
    throw err;
  }
}
module.exports = updateMissingProductsStock;
