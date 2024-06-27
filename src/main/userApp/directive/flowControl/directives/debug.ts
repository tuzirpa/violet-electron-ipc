import { DirectiveTree } from '../../../types';

export const directive: DirectiveTree = {
    name: 'flowControl.debugger',
    displayName: '暂停流程',
    icon: 'icon-web-create',
    sort: 41,
    isControl: false,
    isControlEnd: false,
    comment: '暂停流程,进入调试模式',
    inputs: {},
    outputs: {},
    async toCode(_directive: DirectiveTree, _block: string) {
        return `debugger;`;
    }
};

export default directive;
