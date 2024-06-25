import { DirectiveTree, Block } from '../../../types';
import { typeToCode } from '../../convertUtils';

export const directive: DirectiveTree = {
    name: 'setVariable',
    displayName: '设置变量',
    isControl: false,
    isControlEnd: false,
    comment: '设置${varType}变量 ${varName} 值为 ${varValue}',
    inputs: {
        varType: {
            name: '变量类型',
            value: '',
            display: '',
            type: 'string',
            addConfig: {
                label: '变量类型',
                type: 'select',
                required: true,
                defaultValue: 'string',
                tip: '选择变量类型',
                options: [
                    {
                        label: '字符串',
                        value: 'string'
                    },
                    {
                        label: '数字',
                        value: 'number'
                    },
                    {
                        label: '任意对象',
                        value: 'any'
                    }
                ]
            }
        },
        varValue: {
            name: '变量值',
            value: '',
            type: 'string',
            addConfig: {
                label: '变量值',
                type: 'string',
                defaultValue: ''
            }
        }
    },
    outputs: {
        varName: {
            name: '',
            type: 'string',
            display: '字符串',
            addConfig: {
                label: '变量名',
                type: 'variable',
                defaultValue: 'variable'
            }
        }
    },
    async toCode(directive, block: string) {
        const name = directive.outputs.varName.name;
        let value = directive.inputs.varValue;
        const varTypeType = directive.inputs.varType.value;
        let valueCode = value.value;
        if (varTypeType === 'number' && varTypeType === 'string') {
            valueCode = typeToCode(value);
        }

        return `var ${name} = await robotUtil.dataProcessing.setVariable('${varTypeType}',${valueCode},${block});`;
    }
};

export default directive;
