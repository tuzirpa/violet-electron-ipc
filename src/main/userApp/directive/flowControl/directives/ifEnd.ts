import { DirectiveTree, Block } from '../../../types';

export const directive: DirectiveTree = {
    name: 'flowControl.if.end',
    displayName: 'END IF',
    icon: 'icon-web-create',
    isControl: false,
    sort: 12,
    isControlEnd: true,
    comment: '结束条件',
    inputs: {},
    outputs: {},
    async toCode(_directive: DirectiveTree, _block: string) {
        return `}`;
    }
};

export default directive;
