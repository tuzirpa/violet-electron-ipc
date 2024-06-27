import { DirectiveTree, Block } from '../../../types';

export const directive: DirectiveTree = {
    name: 'web.closeBrowser',
    sort: 2,
    displayName: '关闭浏览器',
    icon: 'icon-web-create',
    isControl: false,
    isControlEnd: false,
    comment: '关闭浏览器：${closeBrowser}',
    inputs: {
        closeBrowser: {
            name: 'closeBrowser',
            value: '',
            display: '',
            type: 'variable',
            // errorHadnler: 'error',
            addConfig: {
                label: '选择要关闭的浏览器',
                type: 'variable',
                filtersType: 'sq.chrome',
                autoComplete: true
            }
        },
        closeaaa: {
            name: 'closeBrowser',
            value: '',
            display: '',
            type: 'boolean',
            // errorHadnler: 'error',
            addConfig: {
                label: '强制',
                type: 'string'
            }
        }
    },
    outputs: {}
};

export default directive;
