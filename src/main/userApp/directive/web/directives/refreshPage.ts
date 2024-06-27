import { DirectiveTree } from '../../../types';

export const directive: DirectiveTree = {
    name: 'web.refreshPage',
    sort: 2,
    displayName: '刷新网页',
    icon: 'icon-web-create',
    isControl: false,
    isControlEnd: false,
    comment: '在网页对象：${browserPage} 刷新网页',
    inputs: {
        browserPage: {
            name: 'browserPage',
            value: '',
            display: '',
            type: 'string',
            // errorHadnler: 'error',
            addConfig: {
                label: '选择网页对象',
                type: 'variable'
            }
        }
    },

    outputs: {},

    async toCode(directive: DirectiveTree, block: string) {
        const { browserPage } = directive.inputs;
        return `await robotUtil.web.refreshPage(${browserPage.value},${block});`;
    }
};

export default directive;
