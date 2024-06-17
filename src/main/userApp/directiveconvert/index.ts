import { directiveToCodeMap } from '../directive/directive';
import { DirectiveTree } from '../types';
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

export function convertDirective(directive: DirectiveTree): string {
    const toCode = directiveToCodeMap.get(directive.name);
    if (toCode) {
        return toCode(directive);
    }

    return 'console.log("未提供代码转换器")// 未提供代码转换器';
}
