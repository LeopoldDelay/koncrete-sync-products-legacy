function createPostProduct(product, now_timestamp) {
  const product_object = {
    post_author: 1,
    post_date: now_timestamp,
    post_date_gmt: now_timestamp,
    post_content: product.post.post_content,
    post_title: product.post.post_title,
    post_excerpt: product.post.post_content,
    post_status: 'draft',
    comment_status: 'open',
    ping_status: 'close',
    post_name: product.post.post_name,
    post_modified: now_timestamp,
    post_modified_gmt: now_timestamp,
    post_parent: 0,
    post_type: 'product',
    to_ping: '',
    pinged: '',
    post_content_filtered: ''

  };
  return product_object;
}
module.exports = createPostProduct;