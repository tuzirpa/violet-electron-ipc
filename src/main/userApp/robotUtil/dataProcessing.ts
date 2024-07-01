import { Block } from '../types';
import { sendLog } from './log';

const dataProcessing = {
    async log(content: string, block: Block) {
        sendLog('info', content, block);
    },

    async setVariable(type: string, value: any, _block: Block) {
        //{"type":"number","value":"123213sdfa${ffd}adsfa"}
        if (type === 'number') {
            return Number(value);
        }
        return value;
    }
};

export default dataProcessing;
