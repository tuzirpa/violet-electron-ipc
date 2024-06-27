import Flow from '../Flow';
import { typeToCode } from '../directive/convertUtils';
import { directiveToCodeMap } from '../directive/directive';
import { Block, DirectiveTree } from '../types';

const defaultToCode = (directive: DirectiveTree, blockCode: string) => {
    let jsCode = '';

    let params = '';
    //拼写参数列表
    const inputKeys = Object.keys(directive.inputs);
    if (inputKeys.length === 0) {
        params = '{}';
    } else {
        const paramArr: string[] = [];
        paramArr.push('{');
        const inputValueArr: string[] = [];
        inputKeys.forEach((key) => {
            const input = directive.inputs[key];
            const type = input.type;
            const types = ['number', 'string'];
            let codeValue = '';
            if (types.includes(type)) {
                codeValue = typeToCode(input);
            } else if (input.addConfig.type === 'variable') {
                codeValue = input.value;
            }
            inputValueArr.push(`"${key}":${codeValue}`);
        });
        paramArr.push(inputValueArr.join(','));
        paramArr.push('}');
        params = paramArr.join('');
    }
    console.log(params);

    let returnVal = '';
    const outputKeys = Object.keys(directive.outputs);
    if (outputKeys.length === 0) {
        returnVal = '';
    } else {
        const paramArr: string[] = [];
        paramArr.push('{');
        const outputValueArr: string[] = [];
        outputKeys.forEach((key) => {
            const output = directive.outputs[key];
            outputValueArr.push(`"${key}":${output.name}`);
        });
        paramArr.push(outputValueArr.join(','));
        paramArr.push('}');
        returnVal = paramArr.join('');
    }
    const returnString = `var ${returnVal} = `;
    jsCode = `${returnVal ? returnString : ''}await robotUtil.${directive.name}(${params},${blockCode});`;
    return jsCode;
};

export async function convertDirective(directive: DirectiveTree, index: number, flow: Flow) {
    const toCode = directiveToCodeMap.get(directive.name);
    const block: Block = {
        blockLine: index + 1,
        flowName: flow.name,
        directiveName: directive.name,
        directiveDisplayName: directive.displayName || directive.name,
        failureStrategy: directive.failureStrategy || 'terminate',
        intervalTime: directive.intervalTime || 0,
        retryCount: directive.retryCount || 0
    };
    const {
        blockLine,
        flowName,
        directiveName,
        directiveDisplayName,
        failureStrategy,
        intervalTime,
        retryCount
    } = block;
    const blockCode = `_block = generateBlock(${blockLine}, "${flowName}", "${directiveName}", "${directiveDisplayName}", "${failureStrategy}", ${intervalTime}, ${retryCount})`;
    if (toCode) {
        return await toCode(directive, blockCode);
    } else {
        //统一生成代码逻辑 根据指令名生成代码
        return defaultToCode(directive, blockCode);
    }
}
