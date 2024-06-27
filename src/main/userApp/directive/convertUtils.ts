import { DirectiveInput } from '../types';

export function typeToCode(inputItem: DirectiveInput) {
    if (inputItem.type === 'string') {
        return `String(\`${inputItem.value}\`)`;
    } else if (inputItem.type === 'number') {
        return `Number(String(\`${inputItem.value}\`))`;
    }
    return '';
}
