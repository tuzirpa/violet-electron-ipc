<script setup lang="ts">
// 添加逻辑
import { Action } from '@renderer/lib/action';

defineProps({
    title: {
        type: String,
        default: ''
    },
    dynamic: {
        type: String,
        default: '动态'
    }
});

</script>

<template>
    <div class="title-bar draggable border-b">
        <div class="title-bar-description">
            <slot>
                <template v-if="title">
                    <div>{{ title }}</div>
                    <!-- <div class="title-bar-description-dynamic"> 动态：{{ dynamic }}</div> -->
                </template>
            </slot>
        </div>
        <div class="title-bar-buttons non-draggable m-1">
            <!-- <div class="title-bar-button">
                <i class="iconfont icon-zuixiaohua"></i>
            </div> -->
            <div class="flex flex-col justify-center items-center w-8 h-8 rounded hover:bg-slate-400/30"
                @click="Action.windowMinimize('login')">
                <i class="iconfont icon-zuixiaohua"></i>
            </div>
            <div class="flex flex-col justify-center items-center w-8 h-8 rounded hover:bg-slate-400/30"
                @click="Action.windowMaximize('login')">
                <i class="iconfont icon-zuidahua"></i>
            </div>
            <div class="flex flex-col justify-center items-center w-8 h-8 rounded hover:bg-red-400 hover:text-white guanbi"
                @click="Action.windowClose('login')">
                <i class="iconfont icon-guanbi"></i>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
// 添加样式
.title-bar {

    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;



    .title-bar-description {
        margin-left: 10px;
        font-size: 14px;
        font-weight: bold;
        color: #333333;
        flex: 1;
        display: flex;
        align-items: center;
        height: 100%;
        gap: 20px;

        .title-bar-description-dynamic {
            color: #999999;
            font-size: 12px;

        }
    }

    .title-bar-buttons {
        display: flex;
        align-items: center;
        justify-content: space-around;

        .title-bar-button {
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            width: 30px;

            i {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 25px;
                height: 25px;
            }



            &.guanbi {
                width: 30px;

                &:hover {
                    background-color: #ff4d4d;
                }
            }
        }

    }
}
</style>
