async function updateKoncreteProductTimestamp(db, product_to_update, now_timestamp) {
  try {
    const products_id = product_to_update.map((a) => (a.ID));
    await db('wp_posts').update({ post_modified: now_timestamp })
      .whereIn('ID', products_id);
    // console.log(res);
    return true;
  } catch (err) {
    console.log('(updated koncrete product timestamp) Internal server error ', err);
    throw err;
  }
}
module.exports = updateKoncreteProductTimestamp;
