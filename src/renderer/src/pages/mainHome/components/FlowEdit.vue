<script setup lang="ts">
import { ref } from 'vue';
import draggable from 'vuedraggable';

// 添加逻辑

const openFiles = ref([
    {
        name: '主流程.ts',
        blocks: Array.from({ length: 5 }, (_, i) => {
            return { name: `操作${i + 1}`, id: i }
        }),
        id: 1
    },

    {
        name: '子流程.ts',
        blocks: Array.from({ length: 20 }, (_, i) => {
            return { name: `操作${i + 1}`, id: i }
        }),
        id: 2
    }
])

const curOpenFile = ref(openFiles.value[0]);

const curBlock = ref(curOpenFile.value.blocks[0]);


</script>

<template>
    <div class="viewbox rounded bg-white flex-1">
        <div class="header bg-gray-100">
            <div class="files flex items-center">
                <div class="file py-2 px-4 cursor-pointer hover:bg-white/60" v-for="(file) in openFiles" :key="file.id"
                    :class="{ 'bg-white': file.id === curOpenFile.id }" @click="curOpenFile = file">{{
                        file.name
                    }}
                </div>
            </div>
        </div>
        <div class="viewbox relative">
            <div class="flex flex-col flex-1 overflow-auto pt-2">
                <draggable class="speech-form-content-edit-list" :list="curOpenFile.blocks" animation="300">
                    <template #item="{ element, index }">
                        <div class="row flex items-center pl-4 gap-6">
                            <div class="row-number pr-2 ">
                                {{ index + 1 }}
                            </div>
                            <div class="row-content pl-3 border-gray-300 hover:bg-gray-100 flex-1"
                                :class="{ 'bg-gray-200 hover:bg-gray-200': curBlock.id === element.id }"
                                @click="curBlock = element">
                                <div class="py-2">
                                    <div class="operation flex items-center gap-1">
                                        <i class="iconfont icon-gugeliulanqi text-xl"></i>
                                        <div class="font-bold ">{{ element.name }}</div>
                                    </div>
                                    <div class="description ml-6 text-xs text-gray-400">
                                        在网页<variable>web_page</variable>中，点击<color>button_name</color>按钮，跳转到<color>
                                            target_page
                                        </color>
                                        页面。
                                    </div>
                                </div>
                                <div>

                                </div>
                            </div>
                        </div>
                    </template>
                </draggable>

            </div>
            <div class="absolute top-2 h-full left-14 w-0.5  border-l border-gray-300"></div>
        </div>

    </div>
</template>

<style lang="less" scoped>
// 添加样式
color,
variable {
    color: #0c89ff;
}

variable {
    border-radius: 9999px;
    background-color: #f0f0f0;
    padding: 2px 4px;
}
</style>
