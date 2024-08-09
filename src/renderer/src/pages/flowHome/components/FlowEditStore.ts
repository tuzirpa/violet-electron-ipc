import type { FlowError } from 'src/main/userApp/types';
import { ref, computed } from 'vue';

/**
 * 错误指令列表
 */
export const curFlowErrors = ref<FlowError[]>([]);

export const curShowFlowErrors = computed(() => {
    const errors = curFlowErrors.value.filter((error) =>
        curFlowErrorsFilter.value.includes(error.errorLevel)
    );
    return errors;
});

export const curFlowErrorsFilter = ref<string[]>(['error']);
