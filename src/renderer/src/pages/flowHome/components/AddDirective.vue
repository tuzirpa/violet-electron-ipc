<script setup lang="ts">
import type { DirectiveInput, DirectiveTree, FlowVariable } from 'src/main/userApp/types';
import InputValueVar from './InputValueVar.vue';
import OutputValueVar from './OutputValueVar.vue';
import InputValueVarVariable from './InputValueVarVariable.vue';
import { getCurrentInstance, onMounted, ref } from 'vue';
import { ElSelect, ElTooltip } from 'element-plus';

// 添加逻辑
const props = defineProps<{
    directive: DirectiveTree;
    variables: FlowVariable[];
}>();

const _directive = ref(props.directive);
const _variables = ref(props.variables);

_directive.value.failureStrategy = _directive.value.failureStrategy || 'terminate';

const groups = ref([
    { name: '常规', active: false },
    { name: '高级', active: false },
    { name: '错误处理', active: false }
]);
groups.value[0].active = true;
function groupClick(group: any) {
    groups.value.forEach((g) => (g.active = false));
    group.active = true;
}

const advancedNum = ref(0);
for (const key in _directive.value.inputs) {
    if (Object.prototype.hasOwnProperty.call(_directive.value.inputs, key)) {
        const input = _directive.value.inputs[key];
        input.value = input.value || input.addConfig?.defaultValue;
        if (input.addConfig?.isAdvanced) {
            advancedNum.value++;
        }
    }
}

console.log(advancedNum.value, '高级参数数量');

function optionChange(e: string, inputItem: DirectiveInput) {
    console.log(inputItem.value, '选择的值');
    if (!inputItem.addConfig) {
        return;
    }
    if (inputItem.addConfig.type !== 'select') {
        return;
    }
    console.log(e, '选择的值', inputItem.addConfig.options);

    inputItem.display = inputItem.addConfig.options?.find((item) => item.value === e)?.label;
    console.log(inputItem.display);
}

function handleFailureStrategy(e: string) {
    if (e === 'retry') {
        _directive.value.intervalTime = _directive.value.intervalTime || 1;
        _directive.value.retryCount = _directive.value.retryCount || 1;
    }
}

function filePathSelect(e, inputItem: DirectiveInput) {
    console.log('选择文件');
    const input = document.createElement('input');
    input.type = 'file';
    //exe 文件类型
    input.accept = '.exe';
    input.onchange = (e: any) => {
        const file = e.target.files[0];
        console.log(file);
        inputItem.value = file.path;
    };

    input.click();
}

function inputItemFilters(directive: DirectiveTree, inputItem: DirectiveInput) {
    if (inputItem.addConfig?.filters) {
        const fun = new Function('return ' + inputItem.addConfig.filters);
        return fun.apply(directive);
    }
    return true;
}

const curInstance = getCurrentInstance();
onMounted(() => {
    console.log(curInstance);
});
</script>

<template>
    <div class="add-directive-container flex flex-col gap-3">
        <div class="directive-header flex justify-between items-center">
            <div class="left flex gap-3">
                <div class="directive-icon">
                    <i class="iconfont text-3xl" :class="_directive.icon"></i>
                </div>
                <div class="directive-info">
                    <div class="directive-name text-gray-950 font-bold">
                        {{ _directive.displayName ?? _directive.name }}
                    </div>
                    <div class="directive-description text-gray-500 text-sm">
                        {{ _directive.description }}
                    </div>
                </div>
            </div>
            <div class="right text-blue-500">使用说明</div>
        </div>
        <div class="directive-body flex flex-col gap-3">
            <div class="group flex gap-2">
                <template v-for="(group, index) in groups">
                    <div
                        class="group-item px-2 cursor-pointer"
                        v-show="index !== 1 || (advancedNum > 0 && index === 1)"
                        :class="[group.active ? 'border-b-2 border-red-600' : '']"
                        @click="groupClick(group)"
                    >
                        {{ group.name }}
                    </div>
                </template>
            </div>
            <div class="directive-params-container flex flex-col gap-8" v-show="groups[0].active">
                <div class="directive-params flex flex-col gap-2">
                    <div class="param-title flex items-center gap-4">
                        <div class="text-gray-950 font-bold">指令输入</div>
                        <div class="w-full flex-1 border-b border-gray-400 border-dashed"></div>
                    </div>
                    <div class="param-content flex flex-col gap-2">
                        <div
                            class="param-item flex gap-4 items-center"
                            v-for="inputItem of _directive.inputs"
                            v-if="Object.keys(_directive.inputs).length > 0"
                        >
                            <template
                                v-if="
                                    inputItem.addConfig &&
                                    !inputItem.addConfig.isAdvanced &&
                                    inputItemFilters(_directive, inputItem)
                                "
                            >
                                <div class="param-name">{{ inputItem.addConfig.label }}：</div>
                                <div class="param-value flex-1">
                                    <div
                                        class="relative"
                                        v-if="inputItem.addConfig.type === 'string'"
                                    >
                                        <InputValueVar
                                            v-model="inputItem.value"
                                            :variables="_variables"
                                            :inputItem="inputItem"
                                        >
                                        </InputValueVar>
                                    </div>
                                    <div
                                        class="relative"
                                        v-if="inputItem.addConfig.type === 'variable'"
                                    >
                                        <InputValueVarVariable
                                            v-model="inputItem.value"
                                            :variables="_variables"
                                            :inputItem="inputItem"
                                        >
                                        </InputValueVarVariable>
                                    </div>
                                    <div
                                        class="relative"
                                        v-else-if="inputItem.addConfig.type === 'textarea'"
                                    >
                                        <InputValueVar
                                            v-model="inputItem.value"
                                            :inputItem="inputItem"
                                            :variables="_variables"
                                        >
                                        </InputValueVar>
                                    </div>
                                    <el-select
                                        v-else-if="inputItem.addConfig.type === 'select'"
                                        v-model="inputItem.value"
                                        placeholder="请选择"
                                        @change="optionChange($event, inputItem)"
                                    >
                                        <el-option
                                            v-for="option in inputItem.addConfig.options"
                                            :key="option.value"
                                            :label="option.label"
                                            :value="option.value"
                                        ></el-option>
                                    </el-select>
                                    <el-checkbox
                                        v-if="inputItem.addConfig.type === 'boolean'"
                                        v-model="inputItem.value"
                                        :placeholder="inputItem.addConfig.placeholder"
                                    ></el-checkbox>
                                    <el-input-number
                                        v-if="inputItem.addConfig.type === 'number'"
                                        v-model="inputItem.value"
                                        :placeholder="inputItem.addConfig.placeholder"
                                    ></el-input-number>
                                    <el-input
                                        v-if="inputItem.addConfig.type === 'filePath'"
                                        v-model="inputItem.value"
                                        :placeholder="inputItem.addConfig.placeholder"
                                    >
                                        <template #append>
                                            <div
                                                class="text-gray-500 text-sm cursor-pointer"
                                                @click="filePathSelect($event, inputItem)"
                                            >
                                                选择文件
                                            </div>
                                        </template>
                                    </el-input>
                                </div>
                                <div
                                    class="param-desc text-gray-500 text-sm"
                                    v-if="inputItem.addConfig.tip"
                                >
                                    <ElTooltip :content="inputItem.addConfig.tip">
                                        <i class="iconfont icon-xinxi text-gray-500"></i>
                                    </ElTooltip>
                                </div>
                            </template>
                        </div>
                        <div v-else>没有输入参数</div>
                    </div>
                </div>
                <div class="directive-params viewbox gap-2">
                    <div class="param-title flex items-center gap-4">
                        <div class="text-gray-950 font-bold">指令输出</div>
                        <div class="w-full flex-1 border-b border-gray-400 border-dashed"></div>
                    </div>
                    <div class="param-content viewbox gap-2">
                        <template v-if="Object.keys(_directive.outputs).length > 0">
                            <div
                                class="param-item flex gap-4 items-center"
                                v-if="_directive.outputs"
                                v-for="outputItem of _directive.outputs"
                            >
                                <template v-if="outputItem.addConfig">
                                    <div class="param-name">{{ outputItem.addConfig.label }}：</div>
                                    <div class="param-value flex-1">
                                        <!-- <el-input v-if="directiveConfig.outputs[key].type === 'variable'"
                                            v-model="outputItem.name" :placeholder="outputItem.placeholder"></el-input> -->
                                        <OutputValueVar
                                            v-if="outputItem.addConfig.type === 'variable'"
                                            :output-item="outputItem"
                                            :variables="_variables"
                                        ></OutputValueVar>
                                    </div>
                                    <div
                                        class="param-desc text-gray-500 text-sm"
                                        v-if="outputItem.addConfig.tip"
                                    >
                                        <ElTooltip :content="outputItem.addConfig.tip">
                                            <i class="iconfont icon-xinxi text-gray-500"></i>
                                        </ElTooltip>
                                    </div>
                                </template>
                            </div>
                        </template>

                        <div v-else>没有输出参数</div>
                    </div>
                </div>
            </div>
            <div
                class="directive-params-container flex flex-col gap-8"
                v-show="groups[1].active && advancedNum > 0"
            >
                <div class="directive-params flex flex-col gap-2">
                    <div class="param-content flex flex-col gap-2">
                        <div
                            class="param-item flex gap-4 items-center"
                            v-for="inputItem of _directive.inputs"
                            v-if="Object.keys(_directive.inputs).length > 0"
                        >
                            <template v-if="inputItem.addConfig && inputItem.addConfig.isAdvanced">
                                <div class="param-name">{{ inputItem.addConfig.label }}：</div>
                                <div class="param-value flex-1">
                                    <div
                                        class="relative"
                                        v-if="inputItem.addConfig.type === 'string'"
                                    >
                                        <InputValueVar
                                            v-model="inputItem.value"
                                            :variables="_variables"
                                            :inputItem="inputItem"
                                        >
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
                                    <div
                                        class="relative"
                                        v-else-if="inputItem.addConfig.type === 'textarea'"
                                    >
                                        <InputValueVar
                                            v-model="inputItem.value"
                                            :inputItem="inputItem"
                                            :variables="_variables"
                                        >
                                        </InputValueVar>
                                    </div>
                                    <el-select
                                        v-else-if="inputItem.addConfig.type === 'select'"
                                        v-model="inputItem.value"
                                        placeholder="请选择"
                                        @change="optionChange($event, inputItem)"
                                    >
                                        <el-option
                                            v-for="option in inputItem.addConfig.options"
                                            :key="option.value"
                                            :label="option.label"
                                            :value="option.value"
                                        ></el-option>
                                    </el-select>
                                    <el-checkbox
                                        v-if="inputItem.addConfig.type === 'boolean'"
                                        v-model="inputItem.value"
                                        :placeholder="inputItem.addConfig.placeholder"
                                    ></el-checkbox>
                                    <el-input-number
                                        v-if="inputItem.addConfig.type === 'number'"
                                        v-model="inputItem.value"
                                        :placeholder="inputItem.addConfig.placeholder"
                                    ></el-input-number>
                                </div>
                                <div
                                    class="param-desc text-gray-500 text-sm"
                                    v-if="inputItem.addConfig.tip"
                                >
                                    <ElTooltip :content="inputItem.addConfig.tip">
                                        <i class="iconfont icon-xinxi text-gray-500"></i>
                                    </ElTooltip>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
            <div class="directive-params-container flex flex-col gap-8" v-show="groups[2].active">
                <div class="directive-params flex flex-col gap-2">
                    <div class="param-content flex flex-col gap-2">
                        <div class="param-item flex gap-4 items-center">
                            <div class="param-name">失败处理：</div>
                            <div class="param-value flex-1">
                                <el-select
                                    v-model="_directive.failureStrategy"
                                    @change="handleFailureStrategy"
                                >
                                    <el-option label="终止流程" value="terminate"></el-option>
                                    <el-option label="忽略并继续执行" value="ignore"></el-option>
                                    <el-option label="重试此指令" value="retry"></el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                    <div v-show="_directive.failureStrategy === 'retry'">
                        <div class="param-content flex flex-col gap-2">
                            <div class="param-item flex gap-4 items-center">
                                <div class="param-name">重试间隔：</div>
                                <div class="param-value flex-1">
                                    <el-input-number
                                        v-model="_directive.intervalTime"
                                        :min="1"
                                        :max="10"
                                        :step="1"
                                    ></el-input-number>
                                    秒
                                </div>
                            </div>
                            <div class="param-item flex gap-4 items-center">
                                <div class="param-name">重试次数：</div>
                                <div class="param-value flex-1">
                                    <el-input-number
                                        v-model="_directive.retryCount"
                                        :min="1"
                                        :max="10"
                                        :step="1"
                                    ></el-input-number>
                                    次
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
