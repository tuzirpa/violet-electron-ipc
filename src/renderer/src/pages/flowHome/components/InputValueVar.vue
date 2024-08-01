<script setup lang="ts">
import type { AppVariable, DirectiveInput, FlowVariable } from 'src/main/userApp/types';
import { ElInput } from 'element-plus';
import { ref, unref } from 'vue';
import { Action } from '@renderer/lib/action'
import { useElementSize } from '@vueuse/core'
import { curUserApp } from '../indexvue';
// import { typeDisplay } from '../directiveConfig';

// 添加逻辑
const props = defineProps<{
    inputItem: DirectiveInput;
    variables: FlowVariable[];
}>();

const emit = defineEmits<{
    (e: 'inputValueChange', value: any, inputItem: DirectiveInput): void;
}>();

const model = defineModel<string>({ required: true });

const varSelectVal = ref('');

const variableSelect = ref();
const varShow = ref(false);
const cursorPos = ref(0);

function varClick() {
    const input = valInputRef?.value?.ref;
    if (input) {
        cursorPos.value = input.selectionStart ?? 0;
    }
    unref(popoverRef).popperRef?.delayHide?.()
}

function varSelectValChange(val: AppVariable, isGlobal: boolean = false) {
    console.log(val, cursorPos.value);
    varShow.value = false;
    let valName = isGlobal ? `_GLOBAL_${val.name}` : val.name;
    const tValue = (model.value ?? '');

    if (props.inputItem.enableExpression) {
        valName = `${valName}`;
    } else {
        valName = `\${${valName}}`;
    }
    model.value = tValue.substring(0, cursorPos.value) + valName + tValue.substring(cursorPos.value);
    popoverRef.value.hide();
    // model.value = (model.value ?? '') + `\${${val}}`;
    emit('inputValueChange', model.value, props.inputItem);
}

async function filePathSelect(_e: any, inputItem: DirectiveInput) {
    console.log('选择文件');
    const files = await Action.selectFileOrFolder(inputItem.addConfig.openDirectory ?? false, inputItem.addConfig.extensions ?? ["*"]);
    if (files.length === 0) {
        return;
    }
    const file = files[0];
    model.value = file.replace(/\\/g, '/');
}

const buttonRef = ref();
const popoverRef = ref();

const inputRef = ref();
const valInputRef = ref<any>();
const { width: varWidth } = useElementSize(inputRef);
const variableFilter = ref(['global', 'local']);

function localVariablesFilter(variable: FlowVariable) {
    let show = variableFilter.value.includes('local')
    if (!variable.before) {
        show = show && variableFilter.value.includes('notusable')
    }
    if (variableFilter.value.includes('recommended')) {
        show = show && props.inputItem.addConfig.filtersType === variable.type;
    }
    console.log(varSelectVal.value, variable.name, variable.comment);

    return show &&
        (varSelectVal.value.length === 0
            || variable.name.includes(varSelectVal.value)
            || variable.comment?.includes(varSelectVal.value));;
}

function enableExpressionToggle() {
    props.inputItem.enableExpression = !props.inputItem.enableExpression;
    if (props.inputItem.enableExpression) {
        model.value = (model.value ?? '').replace(/^\${/g, '').replace(/}$/g, '');
    } else {
        model.value = `\${${model.value}}`;
    }
}

</script>

<template>
    <div class="relative flex gap-1 items-center">
        <el-popover placement="top-start" title="点击切换模式" :width="400" trigger="hover" v-if="inputItem.type === 'object'">
            <div class="flex flex-col gap-2 text-xs">
                <div class="flex items-center gap-2">
                    <el-tag :type="`info`">
                        ex
                    </el-tag>
                    <div>
                        文本模式，支持文本、变量混合输入 最终结果会被解析为文本
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <el-tag :type="`primary`">
                        ex
                    </el-tag>
                    <div>
                        表达式模式，支持JS表达式输入 最终结果会被解析为表达式
                    </div>
                </div>
            </div>
            <template #reference>
                <el-tag @click="enableExpressionToggle" :type="`${inputItem.enableExpression ? 'primary' : 'info'}`">
                    ex
                </el-tag>
            </template>
        </el-popover>


        <div ref="inputRef" class="flex-1">
            <div class="flex items-center gap-2" v-if="inputItem.addConfig.type === 'textarea'">
                <el-input ref="valInputRef" type="textarea" v-model="model"
                    :placeholder="inputItem.addConfig?.placeholder"></el-input>
                <div class="text-blue-500 text-sm cursor-pointer w-20" ref="buttonRef" @click="varClick">使用变量</div>
            </div>
            <el-input ref="valInputRef" v-else v-model="model" :placeholder="inputItem.addConfig?.placeholder">
                <template #append>
                    <div class="flex items-center gap-2">
                        <div class="text-gray-500 text-sm cursor-pointer hover:text-blue-500"
                            v-if="inputItem.addConfig.type === 'filePath'" @click="filePathSelect($event, inputItem)">
                            {{ inputItem.addConfig.openDirectory ? '选择文件夹' : '选择文件' }}</div>
                        <div class="text-gray-500 text-sm cursor-pointer hover:text-blue-500" ref="buttonRef"
                            @click="varClick">
                            使用变量</div>
                    </div>
                </template>
            </el-input>
        </div>

        <el-popover ref="popoverRef" :virtual-ref="buttonRef" placement="bottom-end" :width="varWidth" trigger="click">
            <div ref="variableSelect" filterable tabindex="-1"
                class="active flex flex-col gap-2 mt-1 left-0 p-1 bg-white text-gray-500 text-sm border border-gray-200 border-solid rounded-md w-full">
                <div>
                    <ElInput v-model="varSelectVal" placeholder="搜索变量"></ElInput>
                    <div class="flex justify-end flex-1">
                        <ElCheckboxGroup v-model="variableFilter">
                            <ElCheckbox label="全局" value="global" />
                            <ElCheckbox label="局部" value="local" />
                            <ElCheckbox label="不可用" value="notusable" />
                            <ElCheckbox label="推荐" value="recommended" />
                        </ElCheckboxGroup>
                    </div>
                </div>
                <div class="viewbox min-h-10 max-h-60 overflow-y-auto">
                    <div class="wrapbox">
                        <template v-for="variable in variables">
                            <div class="hover:bg-gray-100 p-1 cursor-pointer rounded"
                                v-show="localVariablesFilter(variable)">
                                <div class="item" @click="varSelectValChange(variable)" v-if="variable.before">
                                    {{ variable.name }}
                                    ({{ variable.comment }})
                                </div>
                                <div class="item text-gray-300" v-else>
                                    {{ variable.name }}
                                    ({{ variable.comment }}) - <span class="text-red-500">不可用在指令之后</span>
                                </div>
                            </div>
                        </template>
                        <template v-for="variable in curUserApp.globalVariables">
                            <div class="hover:bg-gray-100 p-1 cursor-pointer rounded" v-show="variableFilter.includes('global') &&
                                (varSelectVal.length === 0
                                    || variable.name.includes(varSelectVal)
                                    || variable.comment?.includes(varSelectVal))
                                ">
                                <div class="item" @click="varSelectValChange(variable, true)">
                                    {{ variable.name }}
                                    ({{ variable.comment }})
                                    <el-tag type="primary">全局变量</el-tag>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </el-popover>
    </div>
</template>

<style lang="less" scoped>
// 添加样式
.active {
    z-index: 1000;
}
</style>
