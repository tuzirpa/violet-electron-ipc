import { Action } from '@renderer/lib/action';
import type { DirectiveTree } from 'src/main/userApp/types';
import { ref } from 'vue';

const directives = ref<Partial<DirectiveTree>[]>([]);

directives.value = [];

/**
 * 服务器加载的指令列表
 */
async function loadDirective() {
    directives.value = await Action.getDirectives();
    console.log(directives.value, 'directives');
}

loadDirective();

/**
 * 获取一个指令列表
 * @returns {Array}
 */
export function useDirective() {
    return directives;
}

/**
 * 重新加载指令列表
 */
export async function reloadDirective() {
    await Action.reloadDirective();
    loadDirective();
}
