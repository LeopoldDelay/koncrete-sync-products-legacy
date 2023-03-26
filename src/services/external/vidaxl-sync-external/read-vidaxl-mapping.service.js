function readVidaxlMapping(product_json, vidaxl_category_mapping, vidaxl_category_id_list) {
  // Check if product category is in map
  // Entry : project_json from vidaxl feed
  // Return object with result of mapping reading
  const index_of = vidaxl_category_id_list.indexOf(product_json.Category_id, 2);
  if (index_of === -1) {
    return {
      to_be_integrated: false
    };
  }
  return {
    to_be_integrated: true,
    koncrete_category_id: vidaxl_category_mapping[index_of].koncrete_id,
    koncrete_category_name: vidaxl_category_mapping[index_of].koncrete_cat,
    status: vidaxl_category_mapping[index_of].status
  };
}

module.exports = readVidaxlMapping;
