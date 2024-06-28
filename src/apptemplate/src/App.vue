<script setup lang="ts">


//获取地址栏参数
const params = new URLSearchParams(window.location.search);
const userAppId = params.get('userAppId');
console.log(userAppId, 'userAppId');


</script>

<template>
    <div class="step-container">
        <div>应用</div>

    </div>
</template>

<style scoped>
.step-container {
    display: flex;
    flex-direction: column;

}
</style>
