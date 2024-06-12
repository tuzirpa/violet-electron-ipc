import { DirectiveTree } from '../types';
import { BaseConvert } from './BaseConvert';

export class FlowControlIfConvert extends BaseConvert {
    convert(directive: DirectiveTree): string {
        const ifstr: string[] = [];
        for (const key in directive.inputs) {
            const input = directive.inputs[key];
            ifstr.push(this.typeToCode(input));
        }

        return `if(${ifstr.join('')}) {`;
    }
    match(divrctiveName: string): boolean {
        return divrctiveName === 'flowControls.if';
    }
}
