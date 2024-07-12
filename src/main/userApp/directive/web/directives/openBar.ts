import { DirectiveTree } from '@main/userApp/types';

export const directive: DirectiveTree = {
    name: 'web.openBar',
    sort: 2,
    displayName: '在新标签页打开网址',
    icon: 'icon-web-create',
    isControl: false,
    isControlEnd: false,
    comment: '在${webBrowser},打开${url},保存至：${pageBar}',
    inputs: {
        webBrowser: {
            name: 'url',
            value: '',
            type: 'string',
            // errorHadnler: 'error',
            addConfig: {
                label: '已打开的浏览器对象',
                type: 'variable'
            }
        },
        url: {
            name: 'url',
            value: '',
            type: 'string',
            // errorHadnler: 'error',
            addConfig: {
                label: '地址',
                type: 'string',
                // isHide: true,
                defaultValue: 'https://',
                tip: '打开的地址'
            }
        }
    },
    outputs: {
        pageBar: {
            name: 'page',
            display: '浏览器标签对象',
            type: 'chromePage',
            addConfig: {
                label: '浏览器对象',
                type: 'variable',
                defaultValue: 'page'
            }
        }
    },
    async toCode(directive: DirectiveTree, block: string) {
        const webBrowserValue = directive.inputs.webBrowser.value;
        const webUrl = directive.inputs.url.value;

        return `var ${directive.outputs.pageBar.name} = await robotUtil.web.openBrowserPage(${webBrowserValue},'${webUrl}',${block});`;
    }
};

export default directive;
