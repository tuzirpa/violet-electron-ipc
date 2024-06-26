import { Block } from '../types';
import { sendLog } from './robotUtil.template';

export default {
    delay(time: number, block: Block) {
        sendLog('info', `等待${time}秒`, block);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, time * 1000);
        });
    }
};
