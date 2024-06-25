import { DirectiveTree } from '../../../types';

export const directive: DirectiveTree = {
    name: 'flowControl.break',
    displayName: '退出循环',
    icon: 'icon-web-create',
    isControl: false,
    sort: 31,
    isControlEnd: false,
    comment: '仅在循环中有效，用于退出循环',
    inputs: {},
    outputs: {},
    async toCode(_directive: DirectiveTree, _block: string) {
        return `break;`;
    }
};

export default directive;
