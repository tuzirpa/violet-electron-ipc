<script setup lang="ts">
import type { DirectiveTree, FlowVariable } from 'src/main/userApp/types';
import { DirectiveConfig, getDirectiveConfig } from '../directiveConfig';
import InputValueVar from './InputValueVar.vue';
import OutputValueVar from './OutputValueVar.vue';
import { getCurrentInstance, onMounted, ref } from 'vue';
import { ElSelect, ElTooltip } from 'element-plus';

// 添加逻辑
const props = defineProps<{
    directive: DirectiveTree,
    variables: FlowVariable[],
}>();

const _directive = ref(props.directive);
const directiveConfig = ref<DirectiveConfig>();
const _variables = ref(props.variables);
directiveConfig.value = getDirectiveConfig(props.directive.name);

if (directiveConfig.value) {
    Object.keys(_directive.value.inputs).forEach(key => {
        if (directiveConfig.value) {
            const input = directiveConfig.value.inputs[key];
            if (input.default) {
                _directive.value.inputs[key].value = input.default;
            }
        }
    });
}

const groups = ref([{ name: '常规', active: false }, { name: '高级', active: false }, { name: '错误处理', active: false }]);
groups.value[0].active = true;
function groupClick(group: any) {
    groups.value.forEach(g => g.active = false);
    group.active = true;
}


const curInstance = getCurrentInstance();
onMounted(() => {
    console.log(curInstance);

})

</script>

<template>
    <div class="add-directive-container flex flex-col gap-3">
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
            <div class="directive-body flex flex-col gap-3">
                <div class="group flex gap-2">
                    <div class="group-item px-2 cursor-pointer" v-for="group in groups"
                        :class="[group.active ? 'border-b-2 border-red-600' : '']" @click="groupClick(group)">
                        {{ group.name }}</div>
                </div>
                <div class="directive-params-container flex flex-col gap-8">
                    <div class="directive-params flex flex-col gap-2">
                        <div class="param-title flex items-center gap-4">
                            <div class="text-gray-950 font-bold">指令输入</div>
                            <div class="w-full flex-1 border-b border-gray-400 border-dashed"></div>
                        </div>
                        <div class="param-content flex flex-col gap-2">
                            <div class="param-item flex gap-4 items-center" v-for="(inputItem, key) of _directive.inputs"
                                v-if="Object.keys(directiveConfig.inputs).length > 0">
                                <div class="param-name">{{ directiveConfig.inputs[key].label }}：</div>
                                <div class="param-value flex-1">
                                    <div class="relative" v-if="directiveConfig.inputs[key].type === 'string'">
                                        <InputValueVar v-model="inputItem.value" :inputItem="inputItem"
                                            :variables="_variables">
                                        </InputValueVar>
                                        <!-- <div v-if="directiveConfig.inputs[inputItem.name].openVariableSelect"
                                            class="absolute top-10 left-0 text-gray-500 text-sm border border-blue-500 border-solid rounded-md z-10 w-full">
                                            <div class="variable-select-content flex flex-col gap-2">
                                                <div class="variable-select-item flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-300/30"
                                                    v-for="(variable, key) of variables" :key="key">
                                                    <div class="variable-select-name">{{ variable.name }}</div>
                                                    <div class="variable-select-comment">{{ variable.comment }}</div>
                                                </div>
                                            </div>
                                        </div> -->
                                    </div>
                                    <div class="relative" v-else-if="directiveConfig.inputs[key].type === 'textarea'">
                                        <InputValueVar v-model="inputItem.value" :inputItem="inputItem"
                                            :variables="_variables">
                                        </InputValueVar>
                                    </div>
                                    <el-select v-else-if="directiveConfig.inputs[key].type === 'select'"
                                        v-model="inputItem.value" placeholder="请选择">
                                        <el-option v-for="option in directiveConfig.inputs[key].options" :key="option.value"
                                            :label="option.label" :value="option.value"></el-option>
                                    </el-select>
                                    <el-checkbox v-if="directiveConfig.inputs[key].type === 'boolean'"
                                        v-model="inputItem.value" :placeholder="inputItem.placeholder"></el-checkbox>
                                    <el-input-number v-if="directiveConfig.inputs[key].type === 'number'"
                                        v-model="inputItem.value" :placeholder="inputItem.placeholder"></el-input-number>
                                </div>
                                <div class="param-desc text-gray-500 text-sm" v-if="directiveConfig.inputs[key].tip">
                                    <ElTooltip :content="directiveConfig.inputs[key].tip">
                                        <i class="iconfont icon-xinxi text-gray-500 "></i>
                                    </ElTooltip>
                                </div>
                            </div>
                            <div v-else>
                                没有输入参数
                            </div>
                        </div>
                    </div>
                    <div class="directive-params viewbox gap-2">
                        <div class="param-title flex items-center gap-4">
                            <div class="text-gray-950 font-bold">指令输出</div>
                            <div class="w-full flex-1 border-b border-gray-400 border-dashed"></div>
                        </div>
                        <div class="param-content viewbox gap-2">
                            <template v-if="Object.keys(_directive.outputs).length > 0">
                                <div class="param-item flex gap-4 items-center" v-if="directiveConfig.outputs"
                                    v-for="(outputItem, key) of _directive.outputs">
                                    <div class="param-name">{{ directiveConfig.outputs[key].label }}：</div>
                                    <div class="param-value flex-1">
                                        <!-- <el-input v-if="directiveConfig.outputs[key].type === 'variable'"
                                            v-model="outputItem.name" :placeholder="outputItem.placeholder"></el-input> -->
                                        <OutputValueVar v-if="directiveConfig.outputs[key].type === 'variable'"
                                            :output-item="outputItem" :variables="_variables"></OutputValueVar>
                                    </div>
                                    <div class="param-desc text-gray-500 text-sm" v-if="directiveConfig.outputs[key].tip">
                                        <ElTooltip :content="directiveConfig.outputs[key].tip">
                                            <i class="iconfont icon-xinxi text-gray-500 "></i>
                                        </ElTooltip>
                                    </div>
                                </div>
                            </template>

                            <div v-else>
                                没有输出参数
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
.open {
    .el-select-dropdown {
        display: block !important;
    }

}
</style>
