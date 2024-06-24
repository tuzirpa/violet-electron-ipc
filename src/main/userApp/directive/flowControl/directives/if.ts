import { DirectiveTree, Block } from '../../../types';
import { typeToCode } from '../../convertUtils';

export const directive: DirectiveTree = {
    name: 'flowControl.if',
    displayName: 'IF 条件',
    icon: 'icon-web-create',
    sort: 10,
    isControl: true,
    isControlEnd: false,
    comment: '判断${operand1} ${operator} ${operand2} 是否成立，如果成立，则执行以下操作',
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
            type: 'conditions',
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
    outputs: {},
    async toCode(directive: DirectiveTree, block: Block) {
        const { operand1, operator, operand2 } = directive.inputs;

        return `if (await robotUtil.flowControl.test(${typeToCode(operand1)},'${operator.value}',${typeToCode(operand2)},_block = ${JSON.stringify(block)})) {`;
    }
};

export default directive;
