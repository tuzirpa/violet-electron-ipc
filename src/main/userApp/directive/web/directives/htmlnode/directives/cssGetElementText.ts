import { DirectiveTree, Block } from '../../../../../types';

export const directive: DirectiveTree = {
    name: 'web.cssGetElementText',
    sort: 2,
    displayName: 'CSS获取文本内容',
    icon: 'icon-web-create',
    isControl: false,
    isControlEnd: false,
    comment: '获取元素信息${selection},超时时间${timeout}秒,并保存到变量${csText}',
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
        csText: {
            name: 'csText',
            display: '元素文本内容',
            type: 'sq.ElementText',
            addConfig: {
                label: '文本内容',
                type: 'variable',
                defaultValue: 'elementInfo'
            }
        }
    },

    async toCode(directive: DirectiveTree, block: string) {
        const { browserPage, selection, timeout } = directive.inputs;
        return `var ${directive.outputs.csText.name} = await robotUtil.web.getElementTextByCss(${browserPage.value},'${selection.value}',${timeout.value},${block})`;
    }
};

export default directive;