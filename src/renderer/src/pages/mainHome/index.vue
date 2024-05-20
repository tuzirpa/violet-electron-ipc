<script setup lang="ts" name="应用编辑">
import TitleBar from '@renderer/components/TitleBar.vue';
import BoxDraggable from '@renderer/components/BoxDraggable.vue';
import { ElButton } from 'element-plus';
import { useElementSize } from '@vueuse/core';
import { ref } from 'vue';


// 定义变量
const directive = ref(null);
const size = useElementSize(directive);



// 添加逻辑
</script>

<template>
    <div class="viewbox flex-col">
        <TitleBar :title="'应用编辑'">
            <div class="btn-group p-1">
                <ElButton link class="non-draggable">返回</ElButton>
                <ElButton link type="primary" class="non-draggable">保存</ElButton>
            </div>
        </TitleBar>
        <div class="viewbox">
            <div class="flex flex-1 flex-row">
                <!-- 指令区 -->
                <BoxDraggable class="left-sidebar border-r" :width="150" :resize-right="true" ref="directive">
                    指令列表
                </BoxDraggable>
                <div class="main-content viewbox flex-1 bg-gray-100">
                    <div class="flow-edit flex-1">
                        流程编辑区
                    </div>
                    <BoxDraggable class="left-sidebar border-t" :height="150" :resize-top="true" ref="directive">
                        运行日志
                    </BoxDraggable>
                </div>
                <BoxDraggable class="border-l viewbox" :width="150" :resize-left="true" ref="directive">
                    <div class="property-edit flex-1">属性编辑区</div>
                    <div class="global-variable">
                        <BoxDraggable class="left-sidebar border-t" :height="200" :resize-top="true" ref="directive">
                            <div class="viewbox">
                                <div class="flex flex-row justify-between p-2">
                                    <div>全局变量</div>
                                    <div class="global-variable-list">
                                        <div class="hover:bg-slate-100" link>搜索</div>
                                        <ElButton link>新增</ElButton>
                                        <ElButton link>菜单</ElButton>
                                    </div>
                                </div>
                            </div>
                        </BoxDraggable>
                    </div>
                </BoxDraggable>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
// 添加样式
</style>
