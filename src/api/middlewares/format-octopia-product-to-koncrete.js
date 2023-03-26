const margin = process.env.VIDAXL_MARGIN || '0.05';
const slug = require('slug');

// TODO : Use sharp to transform image into webp format
function formatProductOctopiaToKoncrete(product_json) {
  try {
    // TODO : Add images check
    if (!product_json['Libellé'] || !product_json['Prix achat HT (avec ecotaxes)']) {
      const res = { status: 400, message: '(Format product octopia to Koncrete) Bad request : no product title or price' };
      console.log(res.message);
      return res;
    }
    const meta_json_formated = {
      _stock: product_json['Indication stock'],
      _regular_price: parseFloat(product_json['Prix achat HT (avec ecotaxes)'].replace(',', '.')) * (1 + parseFloat(margin)),
      _sku: product_json.Sku,
      _images: [{ src: product_json['Image 1'], alt: product_json['Libellé'].toString() }],
      _product_type: 'simple', // Hardcode but won't change
      _woocommerce_meta: [
        {
          key: '_per_product_shipping',
          value: 'yes'
        },
        {
          key: '_yoast_wpseo_focuskw',
          // Get only 6 first words
          value: product_json['Libellé'].toString().split(' ').slice(0, 7).join(' ')
            .trim()
        } /* ,
        {
          key: '_yoast_wpseo_metadesc',
          value: product_json.Description.toString()
        } */
      ]
    };
    if (product_json['Image 2']) { meta_json_formated._images.push({ src: product_json['Image 2'], alt: product_json['Libellé'].toString() }); }
    if (product_json['Image 3']) { meta_json_formated._images.push({ src: product_json['Image 3'], alt: product_json['Libellé'].toString() }); }
    if (product_json['Image 4']) { meta_json_formated._images.push({ src: product_json['Image 4'], alt: product_json['Libellé'].toString() }); }
    if (product_json['Image 5']) { meta_json_formated._images.push({ src: product_json['Image 5'], alt: product_json['Libellé'].toString() }); }
    if (product_json['Image 6']) { meta_json_formated._images.push({ src: product_json['Image 6'], alt: product_json['Libellé'].toString() }); }
    if (product_json['Prix barré HT'] && parseFloat(product_json['Prix barré HT']) > 0 && parseFloat(product_json['Prix barré HT']) > parseFloat(product_json['Prix achat HT (avec ecotaxes)'])) {
      meta_json_formated._sale_price = parseFloat(product_json['Prix achat HT (avec ecotaxes)'].replace(',', '.')) * (1 + parseFloat(margin));
      meta_json_formated._regular_price = parseFloat(product_json['Prix barré HT'].replace(',', '.')) * (1 + parseFloat(margin));
    }
    const post_json_formated = {
      post_title: product_json['Libellé'].toString(),
      post_content: product_json.Description.toString(),
      post_name: slug(product_json['Libellé']),
      status: process.env.OCTOPIA_CREATED_PRODUCT_STATUS || 'draft',
      tags: [
        { id: process.env.OCTOPIA_SELLER_TAG_ID }
      ],
      octopia_category_3_id: product_json['Id Catégorie 3']
    };
    return { meta: meta_json_formated, post: post_json_formated };
  } catch (err) {
    console.log('(format octopia bubble middleware) Internal server error : ', err);
    return err.sendStatus(400).message(err);
  }
}

module.exports = formatProductOctopiaToKoncrete;
