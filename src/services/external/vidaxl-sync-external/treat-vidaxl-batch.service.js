const csv = require('csvtojson');
const fs = require('fs');
const request = require('request');
const formatProductVidaxlToKoncrete = require('../../../api/middlewares/format-vidaxl-product-to-koncrete');
const add_task_in_queue = require('../queues/add_task_in_queue.service');
const readVidaxlMapping = require('./read-vidaxl-mapping.service');

const csv_path = process.env.VIDAXL_FEED_URL ;
const batch = [];
const batch_len_limit = process.env.VIDAXL_BATCH_LIMIT || 500;
let task_body;

const vidaxl_category_mapping = require('../../../config/mapping_categories_vidaxl.json');

const vidaxl_category_id_list = vidaxl_category_mapping.map((a) => a.vidaxl_category_id.toString());

async function treatVidaxlBatch() {
  csv()
    .fromStream(request.get(csv_path))
    .subscribe((product_json) => {
      const mapping_result = readVidaxlMapping(product_json, vidaxl_category_mapping, vidaxl_category_id_list);
      if (!mapping_result.to_be_integrated) {
        return 1;
      }
      const product_json_formated = formatProductVidaxlToKoncrete(product_json);
      product_json_formated.post.status = mapping_result.status;
      product_json_formated.post.categories = [{ id: mapping_result.koncrete_category_id }];
      if (batch.length < batch_len_limit) {
        batch.push(product_json_formated);
      } else {
        task_body = {
          service: 'vidaxl-sync-product-queue',
          data: batch
        };
        add_task_in_queue('vidaxl-sync-product-queue', task_body);
        batch.length = 0;
      }
    });
  console.log('Batch all has been sent with size : ', batch_len_limit);
  return 'done';
}

module.exports = treatVidaxlBatch;
