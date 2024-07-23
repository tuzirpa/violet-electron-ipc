import { Action } from '@renderer/lib/action';
import { ElLoading } from 'element-plus';
import type { DirectiveTree } from 'src/main/userApp/types';
import { ref } from 'vue';

const directives = ref<Partial<DirectiveTree>[]>([]);

directives.value = [];

/**
 * 服务器加载的指令列表
 */
async function loadDirective() {
    const loading = ElLoading.service({
        lock: true,
        text: '指令加载中',
        background: 'rgba(0, 0, 0, 0.7)'
    });
    directives.value = await Action.getDirectives();
    loading.close();
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
    loadDirective();
}
