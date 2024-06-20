import { Block, DirectiveTree } from 'src/main/userApp/types';

const groups: { [key: string]: { default: DirectiveTree } } = import.meta.glob('./*/index.ts', {
    eager: true
});
console.log(groups, 'groups');

export const directiveToCodeMap = new Map<
    string,
    (directive: DirectiveTree, block: Block) => string
>();

export const directives: DirectiveTree[] = [];

for (const key in groups) {
    if (Object.prototype.hasOwnProperty.call(groups, key)) {
        const module = groups[key];
        directives.push(module.default);

        const groupDirectives = module.default.children;
        if (!groupDirectives) {
            continue;
        }
        for (const directive of groupDirectives) {
            if (directive.toCode) {
                directiveToCodeMap.set(directive.name, directive.toCode);
            }
        }
    }
}
directives.sort((a, b) => {
    const asort = a.sort || 0;
    const bsort = b.sort || 0;
    return bsort - asort;
});

/**
 * 获取一个指令列表
 */
export function useDirective() {
    return directives;
}