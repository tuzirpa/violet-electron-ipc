<script setup lang="ts">
import { RouterView } from 'vue-router';
import Update from './components/Update.vue';
// 添加逻辑


</script>

<template>
    <div class="app viewbox">
        <router-view v-slot="{ Component }">
            <!-- 使用任何自定义过渡和回退到 `fade` -->
            <transition name="custom-classes">
                <component :is="Component" />
            </transition>
        </router-view>
        <Update></Update>
    </div>
</template>

<style lang="less" scoped></style>
