import { DirectiveTree, Block } from '../../../../../types';
import element from '../../element';

export const directive: DirectiveTree = {
    name: 'web.clickElement',
    sort: 2,
    displayName: '点击元素',
    icon: 'icon-web-create',
    isControl: false,
    isControlEnd: false,
    comment: '在浏览器：${webBrowser} ${tag} 标签中点击元素${element} ',
    inputs: {
        webBrowser: {
            name: 'webBrowser',
            value: '',
            display: '',
            type: 'string',
            // errorHadnler: 'error',
            addConfig: {
                label: '选择要操作的浏览器',
                type: 'variable'
            }
        },

        browserPage: {
            name: 'browserPage',
            value: '',
            display: '',
            type: 'string',
            // errorHadnler: 'error',
            addConfig: {
                label: '选择需要操作的标签页',
                type: 'variable'
            }
        },

        element: {
            name: 'element',
            value: '',
            type: 'string',
            // errorHadnler: 'error',
            addConfig: {
                label: '输入点击元素',
                type: 'string'
            }
        }
    },
    outputs: {},

    async toCode(directive: DirectiveTree, block: string) {
        let { browserPage, webBrowser, closePage } = directive.inputs;
        return `await robotUtil.web.closeBrowserPage('${browserPage.value}',${webBrowser.value},${closePage.value},${block});`;
    }
};

export default directive;
