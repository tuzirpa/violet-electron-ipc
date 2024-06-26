<script setup lang="ts">
import type { DirectiveInput, FlowVariable } from 'src/main/userApp/types';
import { ElInput } from 'element-plus';
import { ref } from 'vue';
// import { typeDisplay } from '../directiveConfig';

// 添加逻辑
defineProps<{
    inputItem: DirectiveInput;
    variables: FlowVariable[];
}>();

const model = defineModel<string>({ required: true });

const varSelectVal = ref('');

const variableSelect = ref();
const varShow = ref(false);

function varClick() {
    varShow.value = !varShow.value;
}

function varSelectValChange(val: string) {
    console.log(val);
    varShow.value = false;
    model.value = (model.value ?? '') + `\${${val}}`;
}
</script>

<template>
    <div class="relative">
        <div class="flex items-center gap-2" v-if="inputItem.addConfig.type === 'textarea'">
            <el-input type="textarea" v-model="model" :placeholder="inputItem.addConfig?.placeholder">
            </el-input>
            <div class="text-blue-500 text-sm cursor-pointer w-20" @click="varClick">使用变量</div>
        </div>
        <el-input v-else v-model="model" :placeholder="inputItem.addConfig?.placeholder">
            <template #append>
                <div class="text-gray-500 text-sm cursor-pointer" @click="varClick">使用变量</div>
            </template>
        </el-input>
        <div ref="variableSelect" v-if="varShow" filterable tabindex="-1" @blur="varShow = false"
            class="absolute active flex flex-col gap-2 mt-1 left-0 p-1 bg-white text-gray-500 text-sm border border-gray-200 border-solid rounded-md w-full">
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
    </div>
</template>

<style lang="less" scoped>
// 添加样式
.active {
    z-index: 1000;
}
</style>
