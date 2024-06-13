import { DirectiveTree } from '../../types';
import { BaseConvert } from '../BaseConvert';

export class FlowControlIfEndConvert extends BaseConvert {
    convert(_directive: DirectiveTree): string {
        return '}';
    }
    match(divrctiveName: string): boolean {
        return divrctiveName === 'flowControls.if.end';
    }
}
