import { DirectiveTree, Block } from '../../../types';
import { typeToCode } from '../../convertUtils';

/**
 * {
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
                        type: 'string'
                    },
                    varValue: {
                        name: '变量值',
                        value: '',
                        type: 'string'
                    }
                },
                outputs: {
                    varName: {
                        name: 'variable',
                        required: true,
                        type: 'string',
                        display: '变量名'
                    }
                }
            },
 */
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
                        label: '浏览器对象',
                        value: 'chrome'
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
            name: 'variable',
            required: true,
            type: 'string',
            display: '变量名',
            addConfig: {
                label: '变量名',
                type: 'variable',
                defaultValue: ''
            }
        }
    },
    toCode(directive, block: Block) {
        const name = directive.outputs.varName.name;
        let value = directive.inputs.varValue;
        const varTypeType = directive.inputs.varType.value;
        let valueCode = typeToCode(value);
        if (varTypeType === 'chrome') {
            valueCode = directive.inputs.varValue.value.substring(
                2,
                directive.inputs.varValue.value.length - 1
            );
        }

        return `var ${name} = await robotUtil.dataProcessing.setVariable('${varTypeType}',${valueCode},${JSON.stringify(block)});`;
    }
};

export default directive;
