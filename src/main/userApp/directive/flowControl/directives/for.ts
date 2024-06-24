import { DirectiveTree, Block } from '../../../types';

export const directive: DirectiveTree = {
    name: 'flowControl.for',
    displayName: 'For 循环',
    icon: 'icon-web-create',
    sort: 20,
    isControl: true,
    isControlEnd: false,
    comment: '从${startIndex}开始循环到${endIndex}结束，步长为${step}，循环位置保存至${index}',
    inputs: {
        startIndex: {
            name: '开始数值',
            value: '1',
            type: 'number',
            addConfig: {
                required: true,
                type: 'variable',
                label: '开始数值',
                defaultValue: 1
            }
        },
        endIndex: {
            name: '结束数值',
            value: '',
            type: 'number',
            addConfig: {
                type: 'variable',
                label: '结束数值',
                required: true
            }
        },
        step: {
            name: '增长值（步长）',
            value: '',
            type: 'number',
            addConfig: {
                required: true,
                type: 'variable',
                label: '增长值（步长）',
                defaultValue: 1
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
    async toCode(directive: DirectiveTree, block: Block) {
        const { startIndex, endIndex, step } = directive.inputs;
        const { index } = directive.outputs;
        return `for (let ${index.name} of await robotUtil.flowControl.rangeIterator(${startIndex.value}, ${endIndex.value}, ${step.value},_block = ${JSON.stringify(block)})) {`;
    }
};

export default directive;
