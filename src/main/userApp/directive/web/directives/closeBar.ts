import { DirectiveTree, Block } from '../../../types';

export const directive: DirectiveTree = {
    name: 'web.closeBar',
    sort: 2,
    displayName: '关闭浏览器标签页',
    icon: 'icon-web-create',
    isControl: false,
    isControlEnd: false,
    comment: '在浏览器：${webBrowser} 中关闭标签${closePage} ${closeAll}',
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
            display: '关闭指定网页',
            type: 'string',
            // errorHadnler: 'error',
            addConfig: {
                label: '操作',
                type: 'select',
                // isAdvanced: true,
                options: [
                    {
                        label: '关闭指定网页',
                        value: 'closePage'
                    },
                    {
                        label: '关闭所有网页',
                        value: 'closeAll'
                    }
                ],
                defaultValue: 'closePage',
                tip: '关闭网页'
            }
        },

        closePage: {
            name: 'closePage',
            value: '',
            type: 'string',
            // errorHadnler: 'error',
            addConfig: {
                label: '选择关闭网页',
                type: 'variable',
                filters: `this.inputs.browserPage.value === 'closePage'`
            }
        },

        closeAll: {
            name: 'closeAll',
            value: '',
            type: 'string',
            // errorHadnler: 'error',
            addConfig: {
                label: '关闭浏览器',
                type: 'variable',
                filters: `this.inputs.browserPage.value === 'closeAll'`
            }
        }
    },
    outputs: {},

    async toCode(directive: DirectiveTree, block: string) {
        return `await robotUtil.web.closeBrowserPage('${directive.inputs.browserPage.value}',${directive.inputs.webBrowser.value},${directive.inputs.closePage.value},${block});`;
    }
};

export default directive;
