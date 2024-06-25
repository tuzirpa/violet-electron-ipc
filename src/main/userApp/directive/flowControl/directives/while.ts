import { DirectiveTree, Block } from '../../../types';
import { typeToCode } from '../../convertUtils';

export const directive: DirectiveTree = {
    name: 'flowControl.while',
    displayName: 'while 循环',
    icon: 'icon-web-create',
    sort: 30,
    isControl: true,
    isControlEnd: false,
    comment: '从${startIndex}开始循环到${endIndex}结束，步长为${step}，循环位置保存至${index}',
    inputs: {
        operand1: {
            name: '条件操作数1',
            value: '',
            type: 'string',
            addConfig: {
                required: true,
                type: 'string',
                label: '对象1'
            }
        },
        operator: {
            name: '关系',
            value: '==',
            display: '等于',
            type: 'string',
            addConfig: {
                type: 'select',
                label: '关系',
                required: true,
                options: [
                    { value: '==', label: '等于' },
                    { value: '!=', label: '不等于' },
                    { value: '>', label: '大于' },
                    { value: '<', label: '小于' },
                    { value: '>=', label: '大于等于' },
                    { value: '<=', label: '小于等于' },
                    { value: 'in', label: '包含' },
                    { value: 'notin', label: '不包含' },
                    { value: 'isTrue', label: '等于true' },
                    { value: 'noTrue', label: '不等true' },
                    { value: 'isNull', label: '是空值' },
                    { value: 'noNull', label: '不是空值' }
                ],
                defaultValue: '=='
            }
        },
        operand2: {
            name: '条件操作数2',
            value: '',
            type: 'string',
            addConfig: {
                required: true,
                type: 'string',
                label: '对象2'
            }
        }
    },
    outputs: {
        index: {
            name: 'loop_index',
            type: 'number',
            addConfig: {
                required: true,
                type: 'variable',
                label: '循环位置保存至'
            }
        }
    },
    async toCode(directive: DirectiveTree, block: string) {
        const { operand1, operator, operand2 } = directive.inputs;
        return `while (await robotUtil.flowControl.test(${typeToCode(operand1)},'${operator.value}',${typeToCode(operand2)},${block})) {`;
    }
};

export default directive;
