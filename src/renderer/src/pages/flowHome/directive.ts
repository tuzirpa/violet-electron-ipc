import { Action } from '@renderer/lib/action';
import type { DirectiveTree } from 'src/main/userApp/types';
import { ref } from 'vue';

const directives = ref<Partial<DirectiveTree>[]>([]);

directives.value = [];

/**
 * 加载指令列表的loading状态
 */
export const directiveLoading = ref(false);

/**
 * 服务器加载的指令列表
 */
async function loadDirective() {
    directiveLoading.value = true;
    directives.value = await Action.getDirectives();
    directiveLoading.value = false;
    console.log(directives.value, 'directives');
}

/**
 * 获取一个指令列表
 * @returns {Array}
 */
export function useDirective() {
    loadDirective();
    return directives;
}

/**
 * 重新加载指令列表
 */
export async function reloadDirective() {
    await Action.reloadDirective();
    await loadDirective();
}
