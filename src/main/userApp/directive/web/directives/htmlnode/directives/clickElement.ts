import { DirectiveTree, Block } from '../../../../../types';
import element from '../../element';

export const directive: DirectiveTree = {
    name: 'web.clickElement',
    sort: 2,
    displayName: '点击元素',
    icon: 'icon-web-create',
    isControl: false,
    isControlEnd: false,
    comment: '点击元素${element} ',
    inputs: {
        element: {
            name: 'element',
            value: '',
            type: 'string',
            // errorHadnler: 'error',
            addConfig: {
                label: '选择需要点击的元素',
                type: 'variable'
            }
        }
    },
    outputs: {},

    async toCode(directive: DirectiveTree, block: string) {
        let { element } = directive.inputs;
        return `await robotUtil.web.clickElement(${element.value},${block});`;
    }
};

export default directive;
