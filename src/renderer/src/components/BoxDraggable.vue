<template>
    <div class="draggable-box" ref="box">
        <!-- 边框用于调整大小 -->
        <div class="resize-handle top" v-show="props.resizeTop" @mousedown.prevent="initDrag('top', $event)"></div>
        <div class="resize-handle right" v-show="props.resizeRight" @mousedown.prevent="initDrag('right', $event)"></div>
        <div class="resize-handle bottom" v-show="props.resizeBottom" @mousedown.prevent="initDrag('bottom', $event)"></div>
        <div class="resize-handle left" v-show="props.resizeLeft" @mousedown.prevent="initDrag('left', $event)"></div>

        <!-- 默认插槽，用于插入任何传入的内容 -->
        <slot></slot>
    </div>
</template>
  
<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    height?: number;
    minHeight?: number;
    maxHeight?: number;
    resizeLeft?: boolean;
    resizeRight?: boolean;
    resizeTop?: boolean;
    resizeBottom?: boolean;
}>();

const box = ref<HTMLElement>();

const styleWidth = ref(props.width || '100%');
const styleHeight = ref(props.height || '100%');

watch(() => props.width, (newVal) => {
    if (newVal) {
        styleWidth.value = newVal + 'px';
    }
});

const width = ref(props.width);
const minWidth = ref((props.minWidth || props.width) ?? 0);
const maxWidth = ref((width.value ?? 0) * 2);


if (props.width) {
    styleWidth.value = props.width + 'px';
}

const height = ref(props.height);
const minHeight = ref((props.minHeight || props.height) ?? 0);
const maxHeight = ref((height.value ?? 0) * 2);
if (props.height) {
    styleHeight.value = props.height + 'px';
}
console.log(height.value, minHeight.value, maxHeight.value);


let startX = 0;
let startWidth = 0;
let startY = 0;
let startHeight = 0;

// 初始化拖动操作的函数
function initDrag(side: string, event: MouseEvent) {
    // 记录初始鼠标位置
    startX = event.clientX;
    startY = event.clientY;
    startHeight = box.value ? box.value.offsetHeight : 0;

    // 获取目标元素的初始宽度和高度
    startWidth = box.value ? box.value.offsetWidth : 0;

    // 拖动时执行的函数
    const doDrag = (e: MouseEvent) => {
        // 计算鼠标移动的距离
        let dx = e.clientX - startX;
        let dy = e.clientY - startY;

        // 根据拖动的方向调整元素的尺寸
        if (side === "right" && props.resizeRight) {
            // 向右拖动时，增加宽度
            const dWidth = startWidth + dx;
            if (dWidth <= minWidth.value) {
                width.value = minWidth.value;
            } else if (dWidth >= maxWidth.value) {
                width.value = maxWidth.value;
            } else {
                width.value = dWidth;
            }
            styleWidth.value = width.value + 'px';
        } else if (side === "left" && props.resizeLeft) {
            // 向左拖动时，减少宽度并调整元素的左边界位置
            const dWidth = startWidth - dx;
            if (dWidth <= minWidth.value) {
                width.value = minWidth.value;
            } else if (dWidth >= maxWidth.value) {
                width.value = maxWidth.value;
            } else {
                width.value = dWidth;
            }
            styleWidth.value = width.value + 'px';
        } else if (side === "bottom" && props.resizeBottom) {
            // 向下拖动时，增加高度


            const dHeight = startHeight + dy;
            if (dHeight <= minHeight.value) {
                height.value = minHeight.value;
            } else if (dHeight >= maxHeight.value) {
                height.value = maxHeight.value;
            } else {
                height.value = dHeight;
            }
            styleHeight.value = height.value + 'px';
        } else if (side === "top" && props.resizeTop) {
            // 向上拖动时，减少高度并调整元素的上边界位置
            const dHeight = startHeight - dy;
            if (dHeight <= minHeight.value) {
                height.value = minHeight.value;
            } else if (dHeight >= maxHeight.value) {
                height.value = maxHeight.value;
            } else {
                height.value = dHeight;
            }
            styleHeight.value = height.value + 'px';
        }
    };

    // 结束拖动时执行的函数
    const stopDrag = () => {
        // 移除鼠标移动和鼠标释放时的事件监听
        document.removeEventListener("mousemove", doDrag);
        document.removeEventListener("mouseup", stopDrag);
    };

    // 添加事件监听器，用于响应鼠标移动和鼠标释放事件
    document.addEventListener("mousemove", doDrag);
    document.addEventListener("mouseup", stopDrag);
}
</script>
  
<style scoped>
.draggable-box {
    position: relative;
    width: v-bind(styleWidth);
    height: v-bind(styleHeight);
    --draggable-height: v-bind(styleHeight);
    /* background-color: #3d3d3d; */
}

.resize-handle {
    position: absolute;
    z-index: 1;
    /* background: rgba(0, 0, 0, 0); */
}

.resize-handle.top,
.resize-handle.bottom {
    left: 0;
    right: 0;
    height: 5px;
    cursor: ns-resize;
}

.resize-handle.right,
.resize-handle.left {
    top: 0;
    bottom: 0;
    width: 5px;
    cursor: ew-resize;
}

.resize-handle.top {
    top: 0;
}

.resize-handle.right {
    right: 0;
}

.resize-handle.bottom {
    bottom: 0;
}

.resize-handle.left {
    left: 0;
}

.resize-handle:hover {
    background-color: rgba(255, 255, 255, 0.5);
    /* 当鼠标悬停时改变背景颜色 */
}
</style>