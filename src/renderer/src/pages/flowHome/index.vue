<script setup lang="ts" name="应用编辑">
import TitleBar from '@renderer/components/TitleBar.vue';
import BoxDraggable from '@renderer/components/BoxDraggable.vue';
import DirectiveTree from './components/DirectiveTree.vue';
import FlowEdit from './components/FlowEdit.vue';
import BtnTip from '@renderer/components/BtnTip.vue';
import { ElButton } from 'element-plus';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { Action } from '@renderer/lib/action';
import type UserApp from 'src/main/userApp/UserApp';
import { electron } from 'process';

const route = useRoute();
const id = route.query.appId as string;

// 定义变量
const userAppDetail = ref<UserApp>();

async function getAppDetail() {
    // 获取应用详情
    // 这里应该调用后端接口获取应用详情
    const res = await Action.getUserApp(id);
    userAppDetail.value = res;
    console.log(userAppDetail.value, 'userAppDetail');
    if (userAppDetail.value?.flows && userAppDetail.value.flows.length > 0) {
        curActiveFlowIndex.value = 0;
    }
}

const curActiveFlowIndex = ref(-1);

getAppDetail();

async function installPackage() {
    if (userAppDetail.value?.id) {
        await Action.installPackage(userAppDetail.value?.id);
    }
}

async function run() {
    if (userAppDetail.value?.id) {
        await Action.userAppRun(userAppDetail.value?.id);
    }
}

async function devRun() {
    if (userAppDetail.value?.id) {
        await Action.userAppDevRun(userAppDetail.value?.id);
    }
}

const runLogs = ref('加载应用完成');
window.electron.ipcRenderer.on('run-logs', (_event, logs) => {
    runLogs.value += logs;
});

// 添加逻辑
</script>

<template>
    <div class="viewbox flex-col">
        <TitleBar :title="'应用编辑'">
            <div class="viewbox flex flex-1 flex-row justify-between items-center">
                <div class="viewbox flex flex-row justify-end items-center gap-2">
                    <div class="btn-group flex justify-end items-center p-1 gap-2 text-gray-900">
                        <el-tooltip class="box-item" effect="dark" content="返回" placement="bottom">
                            <div
                                class="btn-item non-draggable flex justify-center items-center rounded py-1 px-2 cursor-pointer hover:bg-slate-400/30">
                                <i class="iconfont icon-fanhui"></i>
                            </div>
                        </el-tooltip>

                        <el-tooltip class="box-item" effect="dark" content="编辑应用信息" placement="bottom-start"
                            :show-after="100">
                            <div class="btn-item group non-draggable flex justify-center items-center 
                    gap-2 rounded py-1 px-2 pr-8 cursor-pointer hover:bg-slate-400/30
                    ">
                                <i class="iconfont icon-yingyongming"></i>
                                <div>应用名称</div>
                                <i class="iconfont icon-bianji opacity-30 group-hover:opacity-100"></i>
                            </div>
                        </el-tooltip>
                        <BtnTip class="btn-item" :icon="'icon-baocun'" :text="'保存'"></BtnTip>
                        <div class="border-r border-gray-200 border-solid w-1 py-3"></div>
                    </div>
                    <div class="btn-group flex justify-end items-center p-1 gap-2 text-gray-900">
                        <BtnTip class="btn-item" :icon="'icon-chexiao'" :text="'撤销'"></BtnTip>
                        <BtnTip class="btn-item chongzuo" :icon="'icon-chexiao'" :text="'重做'"></BtnTip>
                        <BtnTip :icon="'icon-zhedie'" :text="'折叠'"></BtnTip>
                        <BtnTip class="bg-slate-400/20 rounded" :icon-class="'text-green-500'" :icon="'icon-tiaoshi'"
                            :text="'安装依赖包'" @click="installPackage">
                            安装包
                        </BtnTip>
                        <BtnTip class="bg-slate-400/20 rounded" :icon-class="'text-green-500'" :icon="'icon-tiaoshi'"
                            :text="'调试流程'" @click="devRun">
                            调试
                        </BtnTip>
                        <BtnTip class="bg-slate-400/20 rounded" :icon-class="'text-green-500'" :icon="'icon-yunxing'"
                            :text="'运行流程'" @click="run">
                            运行
                        </BtnTip>
                    </div>
                </div>
                <div class="viewbox flex flex-row justify-end items-center gap-2">
                    <BtnTip class="bg-slate-400/15 rounded" :icon="'icon-wenhao'" :text="'帮助、教程、学习资料'">
                        学习中心
                    </BtnTip>
                    <BtnTip :icon="'icon-tongzhi'" :text="'消息通知'">
                    </BtnTip>
                    <BtnTip :icon="'icon-sandian'" :text="'插件、交流、分享'">
                    </BtnTip>
                    <div class="border-r border-gray-200 border-solid w-1 py-3"></div>
                </div>
            </div>
        </TitleBar>
        <div class="viewbox">
            <div class="flex flex-1 flex-row viewbox">
                <!-- 指令区 -->
                <BoxDraggable class=" viewbox left-sidebar border-r" :width="250" :resize-right="true">
                    <DirectiveTree class="directive-edit flex-1 wrapbox p-1"></DirectiveTree>
                </BoxDraggable>
                <div class="main-content viewbox flex-1 bg-gray-100">
                    <div class="flow-edit flex-1 viewbox p-2 ">
                        <FlowEdit v-if="userAppDetail" :app-info="userAppDetail" :flows="userAppDetail?.flows"></FlowEdit>
                    </div>
                    <BoxDraggable class="viewbox p-2 left-sidebar border-t" :height="270" :resize-top="true">
                        <div class="run-logs whitespace-pre select-text overflow-y-auto">
                            {{ runLogs }}
                        </div>
                    </BoxDraggable>
                </div>
                <BoxDraggable class="border-l viewbox" :width="250" :resize-left="true">
                    <div class="property-edit flex-1 p-2">
                        <div>流程</div>
                        <div class="flow-list flex flex-1" v-for="(flow, index) in userAppDetail?.flows" :key="index">
                            <div class="flow-item flex-1 pl-6 p-2 rounded hover:bg-slate-200"
                                :class="{ 'bg-slate-100': curActiveFlowIndex === index }">{{ flow.name }}
                            </div>
                        </div>
                    </div>
                    <BoxDraggable class="left-sidebar border-t" :height="400" :resize-top="true">
                        <div class="viewbox">
                            <div class="flex flex-row justify-between p-2">
                                <div>全局变量</div>
                                <div class="global-variable-list">
                                    <div class="hover:bg-slate-100" link>搜索</div>
                                    <ElButton link>新增</ElButton>
                                    <ElButton link>菜单</ElButton>
                                </div>
                            </div>
                        </div>
                    </BoxDraggable>
                </BoxDraggable>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
// 添加样式
.chongzuo {
    transform: scaleX(-1);
}
</style>
