import { Flow } from './Flow';
import { parentPort } from 'worker_threads';
import { FlowCommand } from './FlowCommand';

const flow = new Flow();

parentPort?.on('message', (message: FlowCommand) => {
    console.log('worker received message:', message);
    if (message.type === 'flowControl') {
        if (message.action === 'start') {
            flow.start();
        } else if (message.action === 'pause') {
            flow.pause();
        } else if (message.action === 'resume') {
            flow.resume();
        } else if (message.action === 'stop') {
            flow.stop();
        }
    } else if (message.type === 'executeTask') {
        const result = flow.exeCode(message.task);
        parentPort?.postMessage({ id: message.id, type: 'executeTaskResult', result });
    }
});
