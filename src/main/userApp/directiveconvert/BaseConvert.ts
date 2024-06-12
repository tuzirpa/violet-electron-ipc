import { DirectiveInput, DirectiveTree } from '../types';
import { DirectiveConvert } from './DirevtveConvert';

export abstract class BaseConvert implements DirectiveConvert {
    constructor() {}

    abstract convert(directive: DirectiveTree): string;

    abstract match(divrctiveName: string): boolean;

    typeToCode(inputItem: DirectiveInput) {
        if (inputItem.type === 'string') {
            return `String(\`${inputItem.value}\`)`;
        } else if (inputItem.type === 'conditions') {
            return `${inputItem.value}`;
        }
        return '';
    }
}
