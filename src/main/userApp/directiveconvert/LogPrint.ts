import { DirectiveTree } from '../types';
import { BaseConvert } from './BaseConvert';

export class LogPrintConvert extends BaseConvert {
    public match(directiveName: string): boolean {
        return directiveName === 'log.out';
    }

    public convert(directive: DirectiveTree) {
        const code = this.typeToCode(directive.inputs.content);
        return `console.log(${code})`;
    }
}
