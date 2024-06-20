import Flow from '../Flow';
import { directiveToCodeMap } from '../directive/directive';
import { Block, DirectiveTree } from '../types';

export async function convertDirective(directive: DirectiveTree, index: number, flow: Flow) {
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
        return await toCode(directive, block);
    }

    return 'console.log("未提供代码转换器")// 未提供代码转换器';
}
