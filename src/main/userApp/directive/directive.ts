import { DirectiveTree } from 'src/main/userApp/types';

const groups: { [key: string]: { default: DirectiveTree } } = import.meta.glob('./*/index.ts', {
    eager: true
});

export const directiveToCodeMap = new Map<
    string,
    (directive: DirectiveTree, block: string) => Promise<string>
>();

export const directives: DirectiveTree[] = [];

function toCode2Map(children: DirectiveTree[]) {
    if (children.length === 0) {
        return;
    }
    children.forEach((child) => {
        if (child.toCode) {
            directiveToCodeMap.set(child.name, child.toCode);
        } else {
            toCode2Map(child.children || []);
        }
    });
}

for (const key in groups) {
    if (Object.prototype.hasOwnProperty.call(groups, key)) {
        const module = groups[key];
        directives.push(module.default);

        const groupDirectives = module.default.children;
        if (!groupDirectives) {
            continue;
        }
        toCode2Map(groupDirectives);
    }
}

directives.sort((a, b) => {
    const asort = a.sort || 0;
    const bsort = b.sort || 0;
    return asort - bsort;
});

/**
 * 获取一个指令列表
 */
export function useDirective() {
    return directives;
}
