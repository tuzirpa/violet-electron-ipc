import { DirectiveTree, Block } from '../../../types';

export const directive: DirectiveTree = {
    name: 'flowControl.else',
    displayName: 'Else',
    icon: 'icon-web-create',
    sort: 11,
    isControl: true,
    isElse: true,
    isControlEnd: false,
    comment: '否则执行以下操作',
    inputs: {},
    outputs: {},
    async toCode(_directive: DirectiveTree, _block: Block) {
        return `} else {`;
    }
};

export default directive;
