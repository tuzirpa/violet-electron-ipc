<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
// 添加逻辑

const route = useRoute();

</script>

<template>
    <div class="app viewbox">
        <router-view v-slot="{ Component }">
            <!-- 使用任何自定义过渡和回退到 `fade` -->
            <transition name="custom-classes">
                <component :is="Component" />
            </transition>
        </router-view>
    </div>
</template>

<style lang="less" scoped></style>
