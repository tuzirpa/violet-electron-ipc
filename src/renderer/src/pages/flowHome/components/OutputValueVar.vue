<script setup lang="ts">

import type { DirectiveOutput, FlowVariable } from 'src/main/userApp/types';
import { ref, unref } from 'vue';
import { useElementSize } from '@vueuse/core';

// 添加逻辑
const props = defineProps<{
    outputItem: DirectiveOutput,
    variables: FlowVariable[]
}>()


const varSelectVal = ref('');

const varShow = ref(true);
function varSelectValChange(val: string) {
    console.log(val);
    props.outputItem.name = val;
    popoverRef.value.hide();
    // emit('inputValueChange', model.value, props.inputItem);
}

const buttonRef = ref()
const popoverRef = ref()
const varClick = () => {
    unref(popoverRef).popperRef?.delayHide?.()
}


const inputRef = ref();
const { width: varWidth } = useElementSize(inputRef);

</script>

<template>
    <div class="relative">
        <div ref="inputRef">
            <el-input v-model="outputItem.name" :placeholder="outputItem.addConfig?.placeholder">
                <template #append>
                    <div ref="buttonRef" class="text-gray-500 text-sm cursor-pointer" @click="varClick">
                        使用变量</div>
                </template>
            </el-input>
        </div>

        <el-popover ref="popoverRef" :virtual-ref="buttonRef" placement="bottom-end" :width="varWidth" trigger="click">
            <div ref="variableSelect" v-if="varShow" filterable tabindex="-1"
                class="active flex flex-col gap-2 mt-1 left-0 p-1 bg-white text-gray-500 text-sm border border-gray-200 border-solid rounded-md w-full">
                <div>
                    <ElInput v-model="varSelectVal" placeholder="搜索变量"></ElInput>
                </div>
                <div class="viewbox min-h-10 max-h-60 overflow-y-auto">
                    <div class="wrapbox">
                        <template v-for="variable in variables">
                            <div class="hover:bg-gray-100 p-1 cursor-pointer rounded" v-show="varSelectVal.length === 0 || variable.name.includes(varSelectVal)
                                ">
                                <div class="item" @click="varSelectValChange(variable.name)" v-if="variable.before">
                                    {{ variable.name }}
                                    ({{ variable.comment }})
                                </div>
                                <div class="item text-gray-300" v-else>
                                    {{ variable.name }}
                                    ({{ variable.comment }}) - <span class="text-red-500">不可用在指令之后</span>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </el-popover>
        <!-- 
        <ElSelect ref="variableSelect"
            class="absolute top-0 left-0 -z-10 text-gray-500 text-sm border border-blue-500 border-solid rounded-md w-full"
            v-model="outputItem.name" placeholder="请选择">
            <el-option v-for="variable in variables" :key="variable.name" :label="`${variable.name} (${variable.comment})`"
                :value="variable.name"></el-option>
        </ElSelect> -->

    </div>
</template>

<style lang="less" scoped>
// 添加样式
</style>
