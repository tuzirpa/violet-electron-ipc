import { DirectiveTree, Block } from '../../../types';

export const directive: DirectiveTree = {
    name: 'flowControl.while',
    displayName: 'while 循环',
    icon: 'icon-web-create',
    sort: 20,
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
                    { value: '<=', label: '小于等于' }
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
        const { startIndex, endIndex, step } = directive.inputs;
        const { index } = directive.outputs;
        return `for (let ${index.name} of await robotUtil.flowControl.rangeIterator(${startIndex.value}, ${endIndex.value}, ${step.value},_block = ${JSON.stringify(block)})) {`;
    }
};

export default directive;
