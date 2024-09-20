import { DirectiveInput } from '../types';

export function typeToCode(inputItem: DirectiveInput) {
    if (inputItem.type === 'string' || inputItem.type === 'textarea') {
        return `String(\`${inputItem.value ?? ''}\`)`;
    } else if (inputItem.type === 'number') {
        return `Number(String(\`${inputItem.value ?? ''}\`))`;
    } else if (inputItem.type === 'boolean') {
        return `String(\`${inputItem.value ?? ''}\`).toLowerCase() == 'true'`;
    } else if (inputItem.type === 'object') {
        if (!inputItem.enableExpression) {
            return `String(\`${inputItem.value ?? ''}\`)`;
        }
        return `${inputItem.value ?? ''}`;
    }
    return '';
}
