import { DirectiveTree } from 'src/main/userApp/types';
import { ref } from 'vue';

type DirectiveTreeError = DirectiveTree & { line: number };
/**
 * 错误指令列表
 */
export const errorDirectives = ref<DirectiveTreeError[]>([]);
