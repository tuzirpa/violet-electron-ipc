<script setup lang="ts">
// 添加逻辑
defineProps<{
    text?: string;
    icon?: string;
    iconClass?: string;
}>();

</script>

<template>
    <div class="py-0.5 px-2 rounded cursor-pointer hover:bg-slate-400/30">
        <el-tooltip class="box-item" effect="dark" :show-arrow="false" :content="text" placement="bottom-start" v-if="text"
            :show-after="100">
            <div class="non-draggable flex justify-center items-center ">
                <i class="iconfont" :class="[icon, iconClass]" v-if="icon"></i>
                <div class="ml-2" v-if="$slots.default">
                    <slot></slot>
                </div>
            </div>
        </el-tooltip>
        <div class="non-draggable flex justify-center items-center" v-else>
            <i class="iconfont " :class="[icon, iconClass]" v-if="icon"></i>
            <div class="ml-2" v-if="$slots.default">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
// 添加样式
</style>
