import { DirectiveTree } from '../../../types';

export const directive: DirectiveTree = {
    name: 'flowControl.edit',
    displayName: '终止流程',
    icon: 'icon-web-create',
    sort: 40,
    isControl: false,
    isControlEnd: false,
    comment: '停止流程后续的所有操作并结束',
    inputs: {},
    outputs: {},
    async toCode(_directive: DirectiveTree, block: string) {
        return `await robotUtil.flowControl.exit(${block})`;
    }
};

export default directive;
