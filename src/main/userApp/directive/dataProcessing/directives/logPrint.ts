import { DirectiveTree, Block } from '../../../types';
import { typeToCode } from '../../convertUtils';

export const directive: DirectiveTree = {
    name: 'data.logPrint',
    displayName: '输出日志',
    icon: 'icon-web-create',
    isControl: false,
    isControlEnd: false,
    comment: '输出日志 ${content}',
    inputs: {
        content: {
            name: '要输出的内容',
            value: '',
            type: 'string',
            addConfig: {
                label: '输出内容',
                type: 'string',
                defaultValue: 'test',
                tip: '输出内容'
            }
        }
    },
    outputs: {},
    toCode(directive: DirectiveTree, block: Block) {
        return `robotUtil.dataProcessing.log(${typeToCode(directive.inputs.content)},${JSON.stringify(block)});`;
    }
};

export default directive;
