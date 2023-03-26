/* eslint-disable no-mixed-operators */
const margin = process.env.VIDAXL_MARGIN || '0.08';
const remove_vidaxl_brand = process.env.REMOVE_VIDAXL_FROM_TITLE || 'yes';
const TVA = 1.2;

const slug = require('slug');

// TODO : Use sharp to transform image into webp format
function formatProductVidaxlToKoncrete(product_json) {
  try {
    // TODO : Add images check
    if (!product_json.Title || !product_json['B2B price'] || !product_json.Description) {
      const res = { status: 400, message: '(Format product octopia to Koncrete) Bad request : no product title or price' };
      console.log(res.message);
      return res;
    }
    const post_json_formated = {
      post_title: product_json.Title.toString(),
      post_content: product_json.Description.toString(),
      post_name: slug(product_json.Title),
      tags: [
        { id: process.env.VIDAXL_SELLER_TAG_ID }
      ]
    };

    if (remove_vidaxl_brand === 'yes' && post_json_formated.post_title.substring(0, 6) && post_json_formated.post_title.substring(0, 6).toLowerCase() === 'vidaxl') {
      post_json_formated.post_title = post_json_formated.post_title.substring(7);
      post_json_formated.post_name = slug(post_json_formated.post_title);
    }
    const meta_json_formated = {
      _stock: product_json.Stock,
      _regular_price: parseFloat(product_json['B2B price'] / TVA * (1 + parseFloat(margin))),
      _sku: product_json.SKU,
      _images: [{ src: product_json['Image 1'], alt: post_json_formated.post_title }],
      _product_type: 'simple', // Hardcode but won't change
      _woocommerce_meta: [
        {
          key: '_per_product_shipping',
          value: 'yes'
        },
        {
          key: '_yoast_wpseo_focuskw',
          value: post_json_formated.post_title.toString()
            .split(' ')
            .slice(0, 7)
            .join(' ')
            .trim()
        }/* ,
        {
          key: '_yoast_wpseo_metadesc',
          value: product_json.Description.toString()
        } */
      ]
    };
    if (product_json['Image 2']) { meta_json_formated._images.push({ src: product_json['Image 2'], alt: post_json_formated.post_title }); }
    if (product_json['Image 3']) { meta_json_formated._images.push({ src: product_json['Image 3'], alt: post_json_formated.post_title }); }
    if (product_json['Image 4']) { meta_json_formated._images.push({ src: product_json['Image 4'], alt: post_json_formated.post_title }); }
    if (product_json['Image 5']) { meta_json_formated._images.push({ src: product_json['Image 5'], alt: post_json_formated.post_title }); }
    if (product_json['Image 6']) { meta_json_formated._images.push({ src: product_json['Image 6'], alt: post_json_formated.post_title }); }
    if (product_json['Image 7']) { meta_json_formated._images.push({ src: product_json['Image 7'], alt: post_json_formated.post_title }); }
    if (product_json['Image 8']) { meta_json_formated._images.push({ src: product_json['Image 8'], alt: post_json_formated.post_title }); }
    if (product_json['Image 9']) { meta_json_formated._images.push({ src: product_json['Image 9'], alt: post_json_formated.post_title }); }
    if (product_json['Image 10']) { meta_json_formated._images.push({ src: product_json['Image 10'], alt: post_json_formated.post_title }); }
    if (product_json['Image 11']) { meta_json_formated._images.push({ src: product_json['Image 11'], alt: post_json_formated.post_title }); }

    return { meta: meta_json_formated, post: post_json_formated };
  } catch (err) {
    console.log('(format vidaxl middleware) Internal server error : ', err);
    return err.sendStatus(400).message(err);
  }
}

module.exports = formatProductVidaxlToKoncrete;

const product_json = {
  Title: 'vidaXL Mur en gabion avec couvercle',
  'B2B price': 5,
  Description: 'test'
};
// console.log(formatProductVidaxlToKoncrete(product_json));
