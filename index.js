const path = require('node:path');
const { Worker, Queue } = require('bullmq');

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const options = {
    connection: {
        host: 'localhost',
        port: 6379,
        db: 0,
    },
};

const queueSandboxed = new Queue('sandboxedWorker', options);
const processorFile = path.join(__dirname, 'processor.js');
const sandboxedWorker = new Worker('sandboxedWorker', processorFile, options);
sandboxedWorker.on('error', (err) => console.error(err));

const queue = new Queue('inlineWorker', options);
const inlineWorker = new Worker('inlineWorker', () => console.log('completed inline worker'), options);
inlineWorker.on('error', (err) => console.error(err));

(async () => {
    await queueSandboxed.add('task', { foo: 'bar' }, options );
    await queue.add('task', { foo: 'bar' }, options );
    await sleep(1000);
    const sandboxedCounts = await queueSandboxed.getJobCounts('wait', 'completed', 'failed', 'active');
    const notSandboxedCounts = await queue.getJobCounts('wait', 'completed', 'failed', 'active');

    console.log({ sandboxedCounts });
    console.log({ notSandboxedCounts });
    process.exit(0)
})();



