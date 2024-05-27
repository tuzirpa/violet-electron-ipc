<script setup lang="ts">
import { DirectiveTree } from '@renderer/types/DirectiveTree';
import { DirectiveConfig, getDirectiveConfig } from '../directiveConfig';
import { ref, watch } from 'vue';
import { ElTooltip } from 'element-plus';

// 添加逻辑
const props = defineProps<{
    directive: DirectiveTree
}>();

const _directive = ref(props.directive);
const directiveConfig = ref<DirectiveConfig>();
console.log(999);

watch(props, () => {
    console.log(666);

    _directive.value = props.directive;
    directiveConfig.value = getDirectiveConfig(props.directive.id);
}, {
    immediate: true,
});


</script>

<template>
    <div class="add-directive-container viewbox gap-3">
        <template v-if="directiveConfig">
            <div class="directive-header flex justify-between items-center">
                <div class="left flex gap-3">
                    <div class="directive-icon">
                        <i class="iconfont text-3xl" :class="_directive.icon"></i>
                    </div>
                    <div class="directive-info">
                        <div class="directive-name text-gray-950 font-bold">{{ directiveConfig.name }}</div>
                        <div class="directive-description text-gray-500 text-sm">{{ directiveConfig.description }}</div>
                    </div>
                </div>
                <div class="right text-blue-500">
                    使用说明
                </div>
            </div>
            <div class="directive-body viewbox gap-3">
                <div class="group flex gap-2">
                    <div class="group-item px-2 border-b-2 border-red-600">高级</div>
                    <div class="group-item px-2 ">常规</div>
                    <div class="group-item px-2 ">错误处理</div>
                </div>
                <div class="directive-params-container viewbox gap-8">
                    <div class="directive-params viewbox gap-2">
                        <div class="param-title flex items-center gap-4">
                            <div class="text-gray-950 font-bold">指令输入</div>
                            <div class="w-full flex-1 border-b border-gray-400 border-dashed"></div>
                        </div>
                        <div class="param-content viewbox gap-2">
                            <div class="param-item flex gap-4 items-center" v-for="inputItem in _directive.inputs">
                                <div class="param-name">{{ directiveConfig.inputs[inputItem.name].label }}：</div>
                                <div class="param-value flex-1">
                                    <el-input v-if="directiveConfig.inputs[inputItem.name].type === 'text'"
                                        v-model="inputItem.value" :placeholder="inputItem.placeholder"></el-input>
                                    <el-select v-else-if="directiveConfig.inputs[inputItem.name].type === 'select'"
                                        v-model="inputItem.value" placeholder="请选择">
                                        <el-option v-for="option in directiveConfig.inputs[inputItem.name].options"
                                            :key="option.value" :label="option.label" :value="option.value"></el-option>
                                    </el-select>
                                    <el-checkbox v-if="directiveConfig.inputs[inputItem.name].type === 'boolean'"
                                        v-model="inputItem.value" :placeholder="inputItem.placeholder"></el-checkbox>
                                    <el-input-number v-if="directiveConfig.inputs[inputItem.name].type === 'number'"
                                        v-model="inputItem.value" :placeholder="inputItem.placeholder"></el-input-number>
                                </div>
                                <div class="param-desc text-gray-500 text-sm"
                                    v-if="directiveConfig.inputs[inputItem.name].tip">
                                    <ElTooltip :content="directiveConfig.inputs[inputItem.name].tip">
                                        <i class="iconfont icon-xinxi text-gray-500 "></i>
                                    </ElTooltip>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="directive-params viewbox gap-2">
                        <div class="param-title flex items-center gap-4">
                            <div class="text-gray-950 font-bold">指令输出</div>
                            <div class="w-full flex-1 border-b border-gray-400 border-dashed"></div>
                        </div>
                        <div class="param-content viewbox gap-2">
                            <div class="param-item flex gap-4 items-center" v-for="(outputItem, key) of _directive.outputs">
                                <div class="param-name">{{ directiveConfig.outputs[key].label }}：</div>
                                <div class="param-value flex-1">
                                    <el-input v-if="directiveConfig.outputs[key].type === 'variable'"
                                        v-model="outputItem.name" :placeholder="outputItem.placeholder"></el-input>
                                </div>
                                <div class="param-desc text-gray-500 text-sm" v-if="directiveConfig.outputs[key].tip">
                                    <ElTooltip :content="directiveConfig.outputs[key].tip">
                                        <i class="iconfont icon-xinxi text-gray-500 "></i>
                                    </ElTooltip>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="text-gray-500 text-center">
                暂无该指令配置信息
            </div>
        </template>
    </div>
</template>

<style lang="less" scoped>
// 添加样式
</style>
