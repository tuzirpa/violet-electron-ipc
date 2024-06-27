import { DirectiveTree } from '../../../types';
import { typeToCode } from '../../convertUtils';

export const directive: DirectiveTree = {
    name: 'wait.delay',
    displayName: '延时等待',
    icon: 'icon-web-create',
    isControl: false,
    isControlEnd: false,
    comment: '等待 ${time} 秒后执行后续指令',
    inputs: {
        time: {
            name: '等待时长',
            value: '',
            type: 'string',
            addConfig: {
                label: '等待时长',
                type: 'string',
                defaultValue: '5',
                tip: '等待时长，单位为秒'
            }
        }
    },
    outputs: {},
    async toCode(directive: DirectiveTree, block: string) {
        return `await robotUtil.wait.delay(Number(${typeToCode(directive.inputs.time)}),${block});`;
    }
};

export default directive;
