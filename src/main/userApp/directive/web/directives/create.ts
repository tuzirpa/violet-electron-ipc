import { DirectiveTree } from '../../../types';

export const directive: DirectiveTree = {
    name: 'web.create',
    sort: 1,
    displayName: '启动浏览器',
    icon: 'icon-web-create',
    isControl: false,
    isControlEnd: false,
    comment: '启动${webType},保存至：${browser}',
    inputs: {
        webType: {
            name: 'webType',
            value: '',
            type: 'string',
            // errorHadnler: 'error',
            addConfig: {
                label: '浏览器类型',
                type: 'select',
                // isHide: true,
                options: [
                    {
                        label: 'Chrome',
                        value: 'chrome'
                    },
                    {
                        label: 'Firefox',
                        value: 'firefox'
                    },
                    {
                        label: 'Edge',
                        value: 'edge'
                    },
                    {
                        label: 'Safari',
                        value: 'safari'
                    }
                ],
                defaultValue: 'chrome',
                tip: '选择浏览器类型'
            }
        }
    },
    outputs: {
        browser: {
            name: 'web_page',
            display: '浏览器对象',
            type: 'chrome',
            required: false,
            addConfig: {
                label: '浏览器对象',
                type: 'variable',
                defaultValue: ''
            }
        }
    },
    toCode(directive: DirectiveTree) {
        return `var ${directive.outputs.browser.name} = robotUtil.openBrowser('${directive.inputs.webType.value}');`;
    }
};

export default directive;
