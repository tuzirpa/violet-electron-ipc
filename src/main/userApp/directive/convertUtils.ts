import { DirectiveInput } from '../types';

export function typeToCode(inputItem: DirectiveInput) {
    if (inputItem.type === 'string') {
        return `String(\`${inputItem.value}\`)`;
    }
    return '';
}
