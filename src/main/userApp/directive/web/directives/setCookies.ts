import { DirectiveTree, Block } from '../../../types';
import { typeToCode } from '../../convertUtils';

export const directive: DirectiveTree = {
    name: 'web.setCookies',
    sort: 2,
    displayName: '设置Cookie',
    icon: 'icon-web-create',
    isControl: false,
    isControlEnd: false,
    comment: '在网页对象：${browserPage} 设置cookie ${cookiles}',
    inputs: {
        browserPage: {
            name: 'browserPage',
            value: '',
            display: '网页对象',
            type: 'string',
            // errorHadnler: 'error',
            addConfig: {
                label: '选择网页对象',
                required: true,
                type: 'variable'
            }
        },

        domain: {
            name: 'domain',
            value: '',
            type: 'string',
            addConfig: {
                label: 'domain',
                type: 'string',
                tip: '设置cookie的域名'
            }
        },

        cookiles: {
            name: 'cookiles',
            value: '',
            type: 'string',
            // errorHadnler: 'error',
            addConfig: {
                label: '设置cookie',
                required: true,
                type: 'textarea',
                tip: 'cookie信息'
            }
        }
    },
    outputs: {},

    async toCode(directive: DirectiveTree, block: string) {
        const { browserPage, cookiles, domain } = directive.inputs;
        return `await robotUtil.web.setCookies(${browserPage.value},${typeToCode(cookiles)},'${domain.value}',${block});`;
    }
};

export default directive;
