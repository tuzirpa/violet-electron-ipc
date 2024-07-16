<template>
  <div>
    <div class="update" v-if="progress">
      <div class="update-text">程序更新下载进度:</div>
      <el-progress class="progress" :percentage="Math.floor(progress.percent)" />
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';

const progress = ref<{
  percent: number
}>(); // 更新信息

window.electron.ipcRenderer.on('downloadProgress',(_e,tProgress:any) => {
  progress.value = tProgress;
});


</script>

<style lang="less" scoped>
.update {
  padding: 10px;
  background: rgba(105, 206, 102);
  position: sticky;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  width: 100%;
  .update-text {
    color: #262626;
  }
  .progress {
    flex: 1;
    margin-left: 20px;
  }
}
</style>