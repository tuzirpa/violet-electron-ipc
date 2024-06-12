import { DirectiveTree } from '../types';
import { DirectiveConvert } from './DirevtveConvert';
import { FlowControlIfConvert } from './FlowControlIfConvert';
import { FlowControlIfEndConvert } from './FlowControlIfEndConvert';
import { LogPrintConvert } from './LogPrint';

export const directiveConverts: DirectiveConvert[] = [];

directiveConverts.push(new LogPrintConvert());
directiveConverts.push(new FlowControlIfConvert());
directiveConverts.push(new FlowControlIfEndConvert());

export function convertDirective(directive: DirectiveTree): string {
    for (const convert of directiveConverts) {
        if (convert.match(directive.name)) {
            return convert.convert(directive);
        }
    }
    return 'console.log("未提供代码转换器")// 未提供代码转换器';
}
