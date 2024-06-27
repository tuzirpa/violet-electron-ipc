import { DirectiveTree, Block } from '../../../../../types';

export const directive: DirectiveTree = {
    name: 'web.cssGetElementInfo',
    sort: 2,
    displayName: 'CSS获取元素信息',
    icon: 'icon-web-create',
    isControl: false,
    isControlEnd: false,
    comment: '获取元素信息${selection},超时时间${timeout}秒,并保存到变量${csElementInfo}',
    inputs: {
        browserPage: {
            name: 'browserPage',
            value: '',
            display: '',
            type: 'string',
            addConfig: {
                label: '网页对象',
                type: 'variable',
                filtersType: 'chromePage',
                autoComplete: true
            }
        },
        selection: {
            name: 'selection',
            value: '',
            display: '',
            type: 'string',
            addConfig: {
                label: 'CSS选择器',
                type: 'string'
            }
        },
        timeout: {
            name: 'selection',
            value: '',
            type: 'number',
            addConfig: {
                isAdvanced: true,
                label: '超时时间',
                type: 'number',
                defaultValue: 30
            }
        }
    },

    outputs: {
        csElementInfo: {
            name: 'csElementInfo',
            display: '元素信息',
            type: 'sq.ElementObject',
            addConfig: {
                label: '元素信息',
                type: 'variable',
                defaultValue: 'elementInfo'
            }
        }
    },

    async toCode(directive: DirectiveTree, block: string) {
        const { browserPage, selection, timeout } = directive.inputs;
        return `var ${directive.outputs.csElementInfo.name} = await robotUtil.web.getElementInfoBySelector(${browserPage.value},'${selection.value}',${timeout.value},${block})`;
    }
};

export default directive;
