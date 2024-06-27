import { DirectiveTree } from '../../../types';

export const directive: DirectiveTree = {
    name: 'web.create2',
    sort: 1,
    displayName: '启动浏览器2',
    icon: 'icon-web-create',
    isControl: false,
    isControlEnd: false,
    comment: '启动${webType},保存至：${browser}',

    inputs: {
        webType: {
            name: 'webType',
            value: '',
            display: '内置浏览器',
            type: 'string',
            // errorHadnler: 'error',
            addConfig: {
                required: true,
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
        },
        url: {
            name: 'url',
            value: '',
            type: 'string',
            // errorHadnler: 'error',
            addConfig: {
                label: '地址',
                type: 'string',
                required: true,
                defaultValue: 'https://',
                tip: '打开的地址'
            }
        },
        loadTimeout: {
            name: 'timeout',
            value: '30',
            type: 'number',
            addConfig: {
                label: '超时',
                type: 'string',
                isAdvanced: true,
                required: true,
                defaultValue: '30',
                tip: '超时时间，单位：秒'
            }
        }
    },
    outputs: {
        browser: {
            name: '',
            display: 'SQ-Web浏览器',
            type: 'sq.chrome',
            addConfig: {
                label: '浏览器对象',
                type: 'variable',
                defaultValue: 'web_page'
            }
        }
    }
};

export default directive;
