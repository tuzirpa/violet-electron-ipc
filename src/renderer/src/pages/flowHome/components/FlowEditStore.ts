import type { FlowError } from 'src/main/userApp/types';
import { ref } from 'vue';

/**
 * 错误指令列表
 */
export const curFlowErrors = ref<FlowError[]>([]);
