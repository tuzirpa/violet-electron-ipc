import { Worker } from 'node:worker_threads';
import workerPath from './worker?modulePath';
import FlowCommand from './FlowCommand';
import { uuid } from '@shared/Utils';

export class FlowControl {
    private worker: Worker;

    static flowControls: Map<string, FlowControl> = new Map();

    static get(id: string) {
        return FlowControl.flowControls.get(id);
    }

    constructor(public id: string) {
        this.worker = new Worker(workerPath, {});

        FlowControl.flowControls.set(id, this);
    }

    executeTask(task: string) {
        return new Promise<{ res: 'ok' | 'error'; data: any }>((resolve, reject) => {
            const id = uuid();
            const command = FlowCommand.newTask(id, task);
            setTimeout(() => {
                this.worker.off('message', callback);
                reject(new Error('指令执行超时'));
            }, 30000);
            const callback = (message) => {
                console.log(message);
                if (message.type === 'executeTaskResult' && message.id === id) {
                    this.worker.off('message', callback);
                    resolve(message.result);
                }
            };
            this.worker.on('message', callback);
            this.worker.postMessage(command);
        });
    }
}
