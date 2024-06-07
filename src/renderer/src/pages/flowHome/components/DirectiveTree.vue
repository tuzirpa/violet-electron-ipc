<script setup lang="tsx">
import BtnTip from '@renderer/components/BtnTip.vue';
import { ElInput, ElTree } from 'element-plus';
import { ref, watch } from 'vue';
import { DirectiveTree } from 'src/main/userApp/types';
import { dragData } from '../dragVar';
import { useDirective } from '../directive';
import { FilterValue, TreeNodeData } from 'element-plus/es/components/tree/src/tree.type';
import Node from 'element-plus/es/components/tree/src/model/node';

const handleNodeClick = (data: DirectiveTree) => {
    console.log(data)
}

const data = useDirective();

const defaultProps = {
    children: 'children',
    label: 'name',
}

const searchValue = ref('');
const searchIcon = <i class="iconfont icon-sousuo"></i>

const treeRef = ref<InstanceType<typeof ElTree>>()

watch(searchValue, (val) => {
    treeRef.value!.filter(val)
})


const filterNode = (value: FilterValue, data: TreeNodeData, _node: Node): boolean => {
    if (!value) return true
    return data.paretObjName.includes(value)
}

function handleDragStart(_event: DragEvent, data: DirectiveTree) {
    dragData.value = { add: true, data }
}

</script>

<template>
    <div class="tree-container viewbox text-xs font-sans">
        <div class="px-2 py-1 viewbox gap-4">
            <div class="header flex justify-between items-center mt-2 gap-1">
                <div class="w-8 font-bold text-sm">指令</div>
                <div class="flex-1">
                    <ElInput class="h-6 overflow-hidden" :prefix-icon="searchIcon" v-model="searchValue" placeholder="搜索指令"
                        clearable />
                </div>
                <BtnTip :icon="'icon-zhankai'" text="展开全部指令" class="px-0.5 py-0.5 text-xs text-gray-400" />
                <BtnTip :icon="'icon-fanhui'" text="隐藏" class="px-0.5 p-0.5 text-xs text-gray-400" />
            </div>
            <div class="wrapbox">

                <el-tree ref="treeRef" style="--el-tree-node-content-height:34px;" :data="data" :props="defaultProps"
                    @node-click="handleNodeClick" :filterNodeMethod="filterNode">
                    <template #default="{ node, data }">
                        <template v-if="node.isLeaf">
                            <div class="flex-1 flex justify-between items-center" draggable="true"
                                @dragstart="handleDragStart($event, data)">
                                <div class="tree-node py-2 flex items-center gap-1 align-middle">
                                    <i class="iconfont text-xl" :class="data.icon"></i>
                                    <span>{{ data.displayName }}</span>
                                </div>
                                <div v-if="node.isLeaf" @click.stop="$emit('addSubTask', data)">
                                    <i class="iconfont icon-tianjia mr-1"></i>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="flex-1 flex justify-between items-center">
                                <div class="tree-node py-2 flex items-center gap-1 align-middle">
                                    <i class="iconfont text-xl" :class="data.icon"></i>
                                    <span>{{ data.displayName }}</span>
                                </div>
                                <div v-if="node.isLeaf">
                                    <i class="iconfont icon-tianjia mr-1"></i>
                                </div>
                            </div>
                        </template>

                    </template>
                </el-tree>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
// 添加样式

:deep(.el-tree-node__label) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

:deep(.el-tree-node) {
    border-radius: 6px;
    overflow: hidden;
}
</style>
