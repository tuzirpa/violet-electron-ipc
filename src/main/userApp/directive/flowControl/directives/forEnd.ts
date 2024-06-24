import { DirectiveTree, Block } from '../../../types';

export const directive: DirectiveTree = {
    name: 'flowControl.for.end',
    displayName: 'For 循环结束',
    icon: 'icon-web-create',
    isControl: false,
    sort: 21,
    isControlEnd: true,
    comment: '表示循环区域的尾部',
    inputs: {},
    outputs: {},
    async toCode(_directive: DirectiveTree, _block: Block) {
        return `}`;
    }
};

export default directive;
