import { DirectiveTree } from 'src/main/userApp/types';
import UserApp from '../UserApp';
import { join } from 'path';

export const directiveToCodeMap = new Map<
    string,
    (directive: DirectiveTree, block: string) => Promise<string>
>();

let allDirectives: DirectiveTree[] = [];

let loadSystemDirectiveLoaded = false;
function loadSystemDirective() {
    if (loadSystemDirectiveLoaded) {
        return;
    }
    const extendDirective = {
        name: '',
        sort: 0,
        displayName: '系统指令',
        icon: 'icon-gugeliulanqi',
        children: [] as DirectiveTree[],
        inputs: {},
        outputs: {}
    };

    loadSystemDirectiveLoaded = true;

    const directiveJsonPath = join(UserApp.userAppLocalDir, 'system', 'directive.json');
    delete require.cache[directiveJsonPath];
    const extDirectivesJson = require(directiveJsonPath);

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
            let directiveModule;
            try {
                const modulePath = join(UserApp.userAppLocalDir, 'system', directive.localFile);
                delete require.cache[modulePath];
                directiveModule = require(modulePath);
            } catch (error: any) {
                throw new Error(`系统指令${directive.localFile}加载失败：${error.message}`);
            }
            const directiveTree = directiveModule.config;
            directiveTree.key = directiveTree.key || directiveTree.name;
            directiveTree.key = `system.${directiveTree.key}`;
            if (directiveTree.toCode) {
                directiveToCodeMap.set(directiveTree.name, directiveTree.toCode);
                console.log(directiveTree.name + ' 有自己的toCode ' + directiveTree.key);
            }

            directiveGroup.children?.push(directiveTree);
        }
    };
    extDirectivesJson.forEach((directive) => {
        loadDirevtive(extendDirective, directive);
    });
    allDirectives.push(extendDirective);
}

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
    const directiveJsonPath = join(UserApp.userAppLocalDir, 'extend', 'directive.json');
    delete require.cache[directiveJsonPath];
    const extDirectivesJson = require(directiveJsonPath);

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
            let directiveModule;
            try {
                const modulePath = join(UserApp.userAppLocalDir, 'extend', directive.localFile);
                delete require.cache[modulePath];
                directiveModule = require(modulePath);
            } catch (error: any) {
                throw new Error(`扩展指令${directive.name}加载失败：${error.message}`);
            }
            const directiveTree = directiveModule.config as DirectiveTree;
            directiveTree.name = `extend.${directiveTree.name}`;
            if (directiveTree.toCode) {
                directiveToCodeMap.set(directiveTree.name, directiveTree.toCode);
                console.log(directiveTree.name + ' 有自己的toCode ');
            }

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
export function reloadDirective() {
    //清空指令列表
    allDirectives = [];
    loadSystemDirectiveLoaded = false;
    loadExtendDirectiveLoaded = false;

    //加载系统指令
    loadSystemDirective();

    //加载扩展指令
    loadExtendDirective();
}

/**
 * 获取一个指令列表
 */
export function useDirective() {
    if (allDirectives.length === 0) {
        reloadDirective();
    }
    return allDirectives;
}
