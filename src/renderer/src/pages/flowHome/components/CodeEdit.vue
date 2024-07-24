<script setup lang="ts">
import { javascript } from '@codemirror/lang-javascript';
import { Codemirror } from 'vue-codemirror';
import { ref, shallowRef, watchEffect } from "vue";
import { ElMessage } from 'element-plus';

const props = defineProps<{
  code?: string;
}>();

const emit = defineEmits<{
  (e: 'save', code: string): void;
}>();

const code = ref(
)

watchEffect(() => {
  if (props.code) {
    code.value = props.code
  } else {
    code.value =
      ``
  }
})

const extensions = [javascript()]

// Codemirror EditorView instance ref
const view = shallowRef()

const handleReady = (payload) => {
  view.value = payload.view
}

function jsonFomat() {
  if (code.value.trim() === '') {
    return
  }
  //判断是否是json格式

  try {
    const json = JSON.parse(code.value)
    const jsonStr = JSON.stringify(json, null, 2)
    code.value = jsonStr
  } catch (e) {
    ElMessage.error('不是json格式');
  }

}

// Status is available at all times via Codemirror EditorView
// const getCodemirrorStates = () => {
//   const state = view.value.state
//   const ranges = state.selection.ranges
//   const selected = ranges.reduce((r, range) => r + range.to - range.from, 0)
//   const cursor = ranges[0].anchor
//   const length = state.doc.length
//   const lines = state.doc.lines
//   // more state info ...
//   // return ...
// }


// const saveCode = () => {
//   emit('save', code.value);
// }
// function fullscreen(element) {
//   if (document.mozFullScreenEnabled) {
//     return Promise.reject(new Error("全屏模式被禁用"));
//   }
//   let result = null;
//   if (element.requestFullscreen) {
//     result = element.requestFullscreen();
//   } else if (element.mozRequestFullScreen) {
//     result = element.mozRequestFullScreen();
//   } else if (element.msRequestFullscreen) {
//     result = element.msRequestFullscreen();
//   } else if (element.webkitRequestFullscreen) {
//     result = element.webkitRequestFullScreen();
//   }
//   return result || Promise.reject(new Error("不支持全屏"));
// }

</script>

<template>
  <view>
    <view class="save-test">
      <el-button @click="jsonFomat">json格式化</el-button>
    </view>
    <codemirror v-model="code" placeholder="这边输入代码" :style="{ width: '100%', height: '500px' }" :autofocus="true"
      :indent-with-tab="true" :tab-size="2" :options="{ lineNumbers: true, lineWrapping: true }" :extensions="extensions"
      @ready="handleReady" />
  </view>
</template>

<style scoped lang="less">
.save-test {
  margin: 10rpx 0;
  display: flex;
  justify-content: flex-end;
}
</style>
