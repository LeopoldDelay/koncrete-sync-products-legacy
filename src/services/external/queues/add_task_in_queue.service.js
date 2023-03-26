const { CloudTasksClient } = require('@google-cloud/tasks');

const client = new CloudTasksClient();
const project = process.env.GCLOUD_QUEUE_PROJECT ;
const location = process.env.GCLOUD_QUEUE_LOCATION;

async function add_task_in_queue(queue_name, task_body) {
  try {
    const parent = client.queuePath(project, location, queue_name);
    const task = {
      appEngineHttpRequest: {
        httpMethod: 'POST',
        relativeUri: `/${queue_name}`, // The url needs to be the same as the queue name on ggtasks
        body: Buffer.from(JSON.stringify(task_body)).toString('base64')
      }
    };
    // Send create task request.
    const request = { parent, task };
    const [response] = await client.createTask(request);
    const { name } = response;

    return response;
  } catch (err) {
    console.log(`(External add task in queue) Internal server error : ${err}`);
    return err;
  }
}

module.exports = add_task_in_queue;
