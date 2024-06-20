import { DirectiveTree } from '../../../types';

export const directive: DirectiveTree = {
    name: 'web.openBarClose',
    sort: 2,
    displayName: '关闭浏览器标签页',
    icon: 'icon-web-create',
    isControl: false,
    isControlEnd: false,
    comment: '关闭标签页：${browserPage}',
    inputs: {
        browserPage: {
            name: 'browserPage',
            value: '',
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
        }
    },
    outputs: {},

    async toCode(directive: DirectiveTree) {
        const webBrowserValue = directive.inputs.browserPage.value;

        return `await robotUtil.web.closeBrowserPage('${directive.inputs.url.value}');`;
    }
};

export default directive;
