import { DirectiveTree } from '../../../types';
export const directive: DirectiveTree = {
    name: 'flowControl.for.end',
    displayName: '循环结束标记',
    icon: 'icon-web-create',
    isControl: false,
    sort: 21,
    isControlEnd: true,
    comment: '表示循环区域的尾部',
    inputs: {},
    outputs: {},
    async toCode(_directive: DirectiveTree, _block: string) {
        return `}`;
    }
};

export default directive;
