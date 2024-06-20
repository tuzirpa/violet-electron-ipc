import { DirectiveTree } from '../../../types';

export const directive: DirectiveTree = {
    name: 'web.openBar',
    sort: 2,
    displayName: '打开浏览器标签页',
    icon: 'icon-web-create',
    isControl: false,
    isControlEnd: false,
    comment: '打开${url},保存至：${pageBar}',
    inputs: {
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
            type: 'any',
            required: false,
            addConfig: {
                label: '浏览器对象',
                type: 'variable',
                defaultValue: 'page'
            }
        }
    },
    toCode(directive: DirectiveTree) {
        return `var ${directive.outputs.pageBar.name} = await robotUtil.openBrowserPage('${directive.inputs.url.value}');`;
    }
};

export default directive;
