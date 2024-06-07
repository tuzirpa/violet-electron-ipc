<script setup lang="ts">

import { DirectiveOutput, FlowVariable } from 'src/main/userApp/types';
import { ref } from 'vue';

// 添加逻辑
defineProps<{
    outputItem: DirectiveOutput,
    variables: FlowVariable[]
}>()


const variableSelect = ref();

function varClick() {
    variableSelect.value.toggleMenu();
}



</script>

<template>
    <div class="relative">
        <el-input v-model="outputItem.name" :placeholder="outputItem.placeholder">
            <template #append>
                <div class="text-gray-500 text-sm cursor-pointer" @click="varClick">
                    fx</div>
            </template>
        </el-input>
        <ElSelect ref="variableSelect"
            class="absolute top-0 left-0 -z-10 text-gray-500 text-sm border border-blue-500 border-solid rounded-md w-full"
            v-model="outputItem.name" placeholder="请选择">
            <el-option v-for="variable in variables" :key="variable.name" :label="`${variable.name} (${variable.comment})`"
                :value="variable.name"></el-option>
        </ElSelect>

    </div>
</template>

<style lang="less" scoped>
// 添加样式
</style>
