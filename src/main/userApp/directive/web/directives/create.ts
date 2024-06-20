import { DirectiveTree, Block } from '../../../types';
import { getExeCutablePath } from '../../commonUtils';

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
                // isAdvanced: true,
                options: [
                    {
                        label: '内置浏览器',
                        value: 'tuziChrome'
                    },
                    {
                        label: '谷歌浏览器',
                        value: 'chrome'
                    },
                    {
                        label: 'Edge',
                        value: 'edge'
                    }
                ],
                defaultValue: 'tuziChrome',
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
                defaultValue: 'web_page'
            }
        }
    },
    async toCode(directive: DirectiveTree, block: Block) {
        const inputWebType = directive.inputs.webType;

        const executablePathValue = await getExeCutablePath(inputWebType.value);

        return `var ${directive.outputs.browser.name} = await robotUtil.openBrowser('${inputWebType.value}', '${executablePathValue}' ,'${inputWebType.display}',${JSON.stringify(block)});`;
    }
};

export default directive;
