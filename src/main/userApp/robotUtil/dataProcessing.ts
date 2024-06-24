import { Block } from '../types';
import { sendLog } from './robotUtil.template';

const dataProcessing = {
    async log(content: string, block: Block) {
        sendLog('info', content, block);
    },

    async setVariable(type: string, value: any, block: Block) {
        //{"type":"number","value":"123213sdfa${ffd}adsfa"}
        if (type === 'number') {
            return Number(value);
        }
        return value;
    }
};

export default dataProcessing;
