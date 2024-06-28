<script setup lang="tsx">
import { Action } from '@renderer/lib/action';
import type UserApp from 'src/main/userApp/UserApp';
import type { Block, LogMessage } from 'src/main/userApp/types';

import { computed, ref } from 'vue';

//获取地址栏参数
const params = new URLSearchParams(window.location.search);
const userAppId = params.get('userAppId');
console.log(userAppId, 'userAppId');

const userAppDetail = ref<UserApp>();

if (userAppId) {
    Action.getUserApp(userAppId).then((res) => {
        userAppDetail.value = res;
    })
}

const steps = ref<LogMessage[]>([]);

const stepBlock = computed(() => {
    if (steps.value.length === 0) {
        const data: Block = {
            blockLine: 0,
            flowName: '',
            directiveName: '',
            directiveDisplayName: '开始运行',
            failureStrategy: 'terminate',
            intervalTime: 0,
            retryCount: 0
        };
        return { data };
    }
    const step = steps.value[steps.value.length - 1];
    return step;
});

const runTime = ref(0);
let runTimeSt: any;
function runStep(_event: any, step: LogMessage) {
    console.log('run step', step);
    if (step.data?.directiveName === 'runStart') {
        steps.value = [];
        clearInterval(runTimeSt);
        //开始计时
        runTimeSt = setInterval(() => {
            runTime.value++;
        }, 1000);
    }
    steps.value.push(step);
}

window.electron.ipcRenderer.on('run-step', runStep);

</script>

<template>
    <div class="step-container">
        <div>应用：{{ userAppDetail?.name }}</div>
        <div class="step-tip" v-if="steps.length > 0">
            {{ stepBlock.data?.flowName }} ：{{ stepBlock.data?.blockLine }}、 {{ stepBlock.data?.directiveDisplayName }}
        </div>
        <div>{{ runTime }}</div>
    </div>
</template>

<style lang="less" scoped>
// 添加样式
.step-container {
    display: flex;
    flex-direction: column;

}
</style>
