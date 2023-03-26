const treatVidaxlBatch = require('../../external/vidaxl-sync-external/treat-vidaxl-batch.service');

async function vidaxlSyncServiceInternal() {
  const res = await treatVidaxlBatch();
  return {
    status: 200,
    message: res
  };
}
module.exports = vidaxlSyncServiceInternal;
