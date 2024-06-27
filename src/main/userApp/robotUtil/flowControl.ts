import { Block } from '../types';
import { sendLog } from './robotUtil';

export default {
    test: async function (operand1: any, operator: string, operand2: any, _block: Block) {
        /**
         * 
            { value: 'in', label: '包含' },
            { value: 'notin', label: '不包含' },
            { value: 'isTrue', label: '等于true' },
            { value: 'noTrue', label: '不等true' },
            { value: 'isNull', label: '是空值' },
            { value: 'noNull', label: '不是空值' }
         */
        if (operator === 'isNull') {
            return operand1 === null;
        } else if (operator === 'noNull') {
            return operand1 !== null;
        } else if (operator === 'isTrue') {
            return operand1 === true;
        } else if (operator === 'noTrue') {
            return operand1 !== true;
        } else if (operator === 'in') {
            return operand1.includes(operand2);
        } else if (operator === 'notin') {
            return !operand1.includes(operand2);
        }
        const result = eval(`${operand1}${operator}${operand2}`);
        return !!result;
    },
    rangeIterator: async function (start: number, end: number, step: number, block: Block) {
        const result: number[] = [];
        for (let i = start; i <= end; i += step) {
            result.push(i);
        }
        sendLog('info', `生成循环数成功: [${start},${end}],步长${step}，结果：${result}`, block);
        return result;
    },
    exit: async function (block: Block) {
        sendLog('info', '终止流程', block);
        process.exit();
    }
};
