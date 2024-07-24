<script setup lang="ts">
import type { DirectiveInput, FlowVariable } from 'src/main/userApp/types';
import { ElInput } from 'element-plus';
import { onMounted, ref, unref } from 'vue';
import { Action } from '@renderer/lib/action'
import { useElementSize } from '@vueuse/core'
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

function varSelectValChange(val: string) {
    console.log(val, cursorPos.value);
    varShow.value = false;
    const tValue = (model.value ?? '');
    model.value = tValue.substring(0, cursorPos.value) + `\${${val}}` + tValue.substring(cursorPos.value);
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

onMounted(() => {
    console.log(valInputRef.value);

});
</script>

<template>
    <div class="relative">
        <div ref="inputRef">
            <div class="flex items-center gap-2" v-if="inputItem.addConfig.type === 'textarea'">
                <el-input ref="valInputRef" type="textarea" v-model="model" :placeholder="inputItem.addConfig?.placeholder">
                </el-input>
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
                </div>
                <div class="viewbox min-h-10 max-h-60 overflow-y-auto">
                    <div class="wrapbox">
                        <template v-for="variable in variables">
                            <div class="hover:bg-gray-100 p-1 cursor-pointer rounded" v-show="varSelectVal.length === 0
                                || variable.name.includes(varSelectVal)
                                || variable.comment?.includes(varSelectVal)
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
    </div>
</template>

<style lang="less" scoped>
// 添加样式
.active {
    z-index: 1000;
}
</style>
