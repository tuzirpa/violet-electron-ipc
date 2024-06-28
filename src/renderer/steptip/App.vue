<script setup lang="tsx">
import type { Block } from 'src/main/userApp/types';
import { computed, ref } from 'vue';

// 添加逻辑

const steps = ref<Block[]>([]);

const stepBlock = computed(() => {
    if(steps.value.length === 0) {
        return { data:{blockLine: '0', directiveDisplayName: '流程开始'} };
    }
    const step = steps.value[steps.value.length - 1];
    return step;
});

function runStep(_event: any, step: any) {
    console.log('run step', step);
    
    steps.value.push(step);
}

window.electron.ipcRenderer.on('run-step', runStep);

</script>

<template>
    <div>
        <div class="step-tip" v-if="steps.length > 0">
            运行步骤：{{ stepBlock.data.blockLine }}、 {{ stepBlock.directiveDisplayName }}
        </div>
    </div>
</template>

<style lang="less" scoped>
// 添加样式
</style>
