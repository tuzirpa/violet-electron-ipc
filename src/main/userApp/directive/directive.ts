import { DirectiveTree } from 'src/main/userApp/types';
import UserApp from '../UserApp';
import { join } from 'path';

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

const systempDirectives = {
    name: '',
    sort: 0,
    displayName: '系统指令',
    icon: 'icon-gugeliulanqi',
    children: directives,
    inputs: {},
    outputs: {}
};

const allDirectives = [systempDirectives];

let loadExtendDirectiveLoaded = false;
function loadExtendDirective() {
    if (loadExtendDirectiveLoaded) {
        return;
    }
    const extendDirective = {
        name: '',
        sort: 0,
        displayName: '扩展指令',
        icon: 'icon-gugeliulanqi',
        children: [] as DirectiveTree[],
        inputs: {},
        outputs: {}
    };

    loadExtendDirectiveLoaded = true;
    const extDirectivesJson = require(join(UserApp.userAppLocalDir, 'extend', 'directive.json'));

    const loadDirevtive = function (directiveGroup: DirectiveTree, directive: any) {
        if (directive.children) {
            const group = {
                name: directive.name,
                sort: 0,
                displayName: directive.name,
                children: [] as DirectiveTree[],
                icon: directive.icon
            } as DirectiveTree;
            directiveGroup.children?.push(group);
            directive.children.forEach((child) => {
                loadDirevtive(group, child);
            });
        } else {
            const directiveModule = require(
                join(UserApp.userAppLocalDir, 'extend', directive.localFile)
            );
            const directiveTree = directiveModule.config as DirectiveTree;
            directiveTree.name = `extend.${directiveTree.name}`;

            directiveGroup.children?.push(directiveTree);
        }
    };
    extDirectivesJson.forEach((directive) => {
        loadDirevtive(extendDirective, directive);
    });
    allDirectives.push(extendDirective);
}
/**
 * 获取一个指令列表
 */
export function useDirective() {
    //加载扩展指令
    loadExtendDirective();

    return allDirectives;
}
