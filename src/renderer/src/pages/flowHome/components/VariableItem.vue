<script setup lang="ts">
import type { FlowVariable } from 'src/main/userApp/types';
import TypeDetails from './TypeDetails.vue';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';

// 添加逻辑
const props = defineProps<{
    variable: FlowVariable;
    isGlobal?: boolean;
}>();

const emit = defineEmits<{
    (e: 'varSelectValChange', variable: FlowVariable, keys: string[]): void;
}>();



const typeDetailsOpen = ref(false);

function varSelectValChange(variable: FlowVariable, keys: string[]) {
    if (!variable.before && !props.isGlobal) {
        ElMessage.warning({ message: '不可用在指令之前' });
    }
    emit('varSelectValChange', variable, keys);
}


</script>

<template>
    <div :class="{ 'text-gray-300': !variable.before && !isGlobal }">
        <div class="p-1  flex items-center gap-2 hover:bg-gray-100" @click="varSelectValChange(variable, [])">
            <div class="subattribute" @click.stop="typeDetailsOpen = !typeDetailsOpen"
                v-if="variable.typeDetails && variable.typeDetails.length > 0">
                <div class="w-6 h-6 flex justify-center items-center hover:bg-gray-200">
                    <el-icon>
                        <ArrowRight v-if="!typeDetailsOpen" />
                        <ArrowDown v-else />
                    </el-icon>
                </div>
            </div>
            <div class="item  p-1" v-if="variable.before || isGlobal">
                {{ variable.name }}
                ({{ variable.display ? variable.display : '未提供备注' }})
            </div>
            <div class="item" v-else>
                {{ variable.name }}
                ({{ variable.display ? variable.display : '未提供备注' }}) - <span class="text-red-500">不可用在指令之后</span>
            </div>
        </div>
        <TypeDetails @selectType="varSelectValChange(variable, $event)"
            v-if="variable.typeDetails && variable.typeDetails.length > 0 && typeDetailsOpen"
            :typeDetails="variable.typeDetails" :parent-key="''">
        </TypeDetails>
    </div>
</template>

<style lang="less" scoped>
// 添加样式
</style>
