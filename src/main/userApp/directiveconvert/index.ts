import Flow from '../Flow';
import { directiveToCodeMap } from '../directive/directive';
import { Block, DirectiveTree } from '../types';
import { DirectiveConvert } from './DirevtveConvert';
import { FlowControlIfConvert } from './impl/FlowControlIfConvert';
import { FlowControlIfEndConvert } from './impl/FlowControlIfEndConvert';
import { LogPrintConvert } from './impl/LogPrint';
import { SetVariableConvert } from './impl/SetVariableConvert';

// export const directiveConverts: DirectiveConvert[] = [];

// directiveConverts.push(new LogPrintConvert());
// directiveConverts.push(new FlowControlIfConvert());
// directiveConverts.push(new FlowControlIfEndConvert());
// directiveConverts.push(new SetVariableConvert());

export function convertDirective(directive: DirectiveTree, index: number, flow: Flow): string {
    const toCode = directiveToCodeMap.get(directive.name);
    if (toCode) {
        const block: Block = {
            blockLine: index + 1,
            flowName: flow.name,
            directiveName: directive.name,
            directiveDisplayName: directive.displayName || directive.name,
            failureStrategy: directive.failureStrategy || 'terminate',
            intervalTime: directive.intervalTime || 0,
            retryCount: directive.retryCount || 0
        };
        return toCode(directive, block) + `//${JSON.stringify(block)}`;
    }

    return 'console.log("未提供代码转换器")// 未提供代码转换器';
}
