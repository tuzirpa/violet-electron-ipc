import type { DirectiveTree } from 'src/main/userApp/types';
import { ref } from 'vue';
import { OpenFile } from './types';

type DirectiveTreeError = { directive: DirectiveTree; file: OpenFile; line: number };
/**
 * 错误指令列表
 */
export const errorDirectives = ref<DirectiveTreeError[]>([]);
