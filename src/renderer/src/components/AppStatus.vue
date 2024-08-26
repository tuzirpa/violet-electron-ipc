<script setup lang="ts">
import { ref } from 'vue';
// 添加逻辑

const statusList = ref<{ name: string, value: string }[]>([]);

window.electron.ipcRenderer.on('app-status', (_event, status: { name: string, value: string }) => {
    console.log('app-status', status);
    const item = statusList.value.find(item => item.name === status.name);
    if (item) {
        item.value = status.value;
    } else {
        statusList.value.push(status);
    }
})


</script>

<template>
    <div class="app-status px-2 flex gap-2">
        <div class="app-status-item flex gap-1" v-for="item in statusList">
            <div class="app-status-item-title">
                {{ item.name }} :
            </div>
            <div>{{ item.value }}</div>
        </div>
    </div>
</template>

<style lang="less" scoped>
// 添加样式
</style>
