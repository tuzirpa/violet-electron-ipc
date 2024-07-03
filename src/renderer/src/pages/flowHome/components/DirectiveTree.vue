<script setup lang="tsx">
import BtnTip from '@renderer/components/BtnTip.vue';
import { ElInput, ElTree } from 'element-plus';
import { ref, watch } from 'vue';
import type { DirectiveTree } from 'src/main/userApp/types';
import { dragData } from '../dragVar';
import { useDirective, reloadDirective } from '../directive';
import { FilterValue, TreeNodeData } from 'element-plus/es/components/tree/src/tree.type';
import Node from 'element-plus/es/components/tree/src/model/node';
import { useElementSize } from '@vueuse/core';

const emit = defineEmits<{
    (e: 'addDirective', data: DirectiveTree): void;
    (e: 'hideDirectiveTree', hideDirectiveTree: boolean): void;
}>();

const handleNodeClick = (data: DirectiveTree) => {
    console.log(data);
};

const el = ref(null)
const { width } = useElementSize(el)
watch(width, (newVal) => {
    if (newVal > 100) {
        hideDirectiveTree.value = false
    }
    if (newVal < 100) {
        hideDirectiveTree.value = true
    }
})

const data = useDirective();

const defaultProps = {
    children: 'children',
    label: 'name'
};

const hideDirectiveTree = ref(false);

watch(hideDirectiveTree, (newVal) => {
    emit('hideDirectiveTree', newVal);
})

const expandAll = ref(false);
function expandAllNodes() {
    expandAll.value = !expandAll.value;
    Object.values(treeRef.value!.store.nodesMap).forEach((node) => {
        if (!expandAll.value) {
            node.collapse();
        } else {
            node.expand();
        }
    });
}

const searchValue = ref('');
const searchIcon = <i class="iconfont icon-sousuo"></i>;

const treeRef = ref<InstanceType<typeof ElTree>>();

watch(searchValue, (val) => {
    treeRef.value!.filter(val);
});

const filterNode = (value: FilterValue, data: TreeNodeData, _node: Node): boolean => {
    if (!value) return true;
    return data.displayName.includes(value);
};

function handleDragStart(_event: DragEvent, data: DirectiveTree) {
    dragData.value = { add: true, data };
}



</script>

<template>
    <div class="tree-container viewbox text-xs font-sans" ref="el">
        <div class="px-2 py-1 viewbox gap-4">
            <div class="header flex justify-between items-center mt-2 gap-1">
                <template v-if="!hideDirectiveTree">
                    <div class="w-8 font-bold text-sm">指令</div>
                    <div class="flex-1">
                        <ElInput class="h-6 overflow-hidden" :prefix-icon="searchIcon" v-model="searchValue"
                            placeholder="搜索指令" clearable />
                    </div>
                    <BtnTip :icon="'icon-zhankai'" :class="{ '-scale-y-100': expandAll }" text="展开/收缩全部指令"
                        @click="expandAllNodes" class="px-0.5 py-0.5 text-xs text-gray-400" />
                    <BtnTip :class="{ '-scale-x-100': hideDirectiveTree }" text="重载指令" @click="reloadDirective"
                        class="text-xs p-0">重载</BtnTip>
                </template>
                <BtnTip :icon="'icon-fanhui'" text="隐藏" v-if="!hideDirectiveTree" @click="hideDirectiveTree = true"
                    class="px-0.5 p-0.5 text-xs text-gray-400" />
                <BtnTip :icon="'icon-fanhui'" :class="{ '-scale-x-100': hideDirectiveTree }" text="指令" v-else
                    @click="hideDirectiveTree = false" class="px-0.5 p-0.5 text-xs text-gray-400" />

            </div>
            <div class="wrapbox" v-show="!hideDirectiveTree">
                <el-tree ref="treeRef" style="--el-tree-node-content-height: 34px" :data="data" :props="defaultProps"
                    @node-click="handleNodeClick" :filterNodeMethod="filterNode" :default-expand-all="expandAll">
                    <template #default="{ node, data }">
                        <template v-if="node.isLeaf">
                            <div class="flex-1 flex justify-between items-center" draggable="true"
                                @dblclick="emit('addDirective', data)" @dragstart="handleDragStart($event, data)">
                                <div class="tree-node py-2 flex items-center gap-1 align-middle">
                                    <i class="iconfont text-xl" :class="data.icon"></i>
                                    <span>{{ data.displayName }}</span>
                                </div>
                                <div v-if="node.isLeaf" @click.stop="emit('addDirective', data)">
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
