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
import type { IBreakpoint } from 'src/main/userApp/devuserapp/DevNodeJs';
import { typeDisplay } from './directiveConfig';
import type { LogLevel, Block } from 'src/main/userApp/types';

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

const breakpointData = ref<IBreakpoint>({
    line: 0,
    url: ''
});

const breakpointCallback = async (_event, data: IBreakpoint) => {
    console.log(data, 'breakpoint');
    breakpointData.value = data;

    //获取断点变量列表
    if (
        userAppDetail.value?.id &&
        breakpointData.value.scopeChain &&
        breakpointData.value.scopeChain.length > 0
    ) {
        const scopeChain = breakpointData.value.scopeChain[0].object.objectId;
        const res = await Action.devGetProperties(userAppDetail.value?.id, scopeChain);
        console.log(res.result);
        devVariableData.value = res.result.map((item) => {
            const name = item.name;
            return {
                type: item.value.type ? typeDisplay[item.value.type] : '未初始化',
                name,
                val: item.value.value
            };
        });
    }
};

const devRunEndCallback = (_event) => {
    isDev.value = false;
    window.electron.ipcRenderer.removeAllListeners('breakpoint');
    window.electron.ipcRenderer.removeAllListeners('devRunEnd');
    breakpointData.value = { line: 0, url: '' };
    devVariableData.value = [];
};

async function devRun() {
    if (userAppDetail.value?.id) {
        await Action.userAppDevRun(userAppDetail.value?.id);
        isDev.value = true;
        bottomTabsActiveName.value = 'dev-variable';
        window.electron.ipcRenderer.on('breakpoint', breakpointCallback);
        window.electron.ipcRenderer.on('devRunEnd', devRunEndCallback);
    }
}
async function devStepOver() {
    if (userAppDetail.value?.id) {
        await Action.devStepOver(userAppDetail.value?.id);
    }
}
async function devStop() {
    if (userAppDetail.value?.id) {
        await Action.devStop(userAppDetail.value?.id);
    }
}

async function devResume() {
    if (userAppDetail.value?.id) {
        await Action.devResume(userAppDetail.value?.id);
        breakpointData.value = { line: 0, url: '' };
    }
}

const runLogs = ref<{ level: LogLevel, message: string, time: number, data: Block }[]>([]);
window.electron.ipcRenderer.on('run-logs', (_event, log) => {
    console.log(log, 'run-logs');
    log.time = new Date(log.time).toLocaleString();
    runLogs.value.unshift(log);
});

/**
 * 底部tab激活状态
 */
const bottomTabsActiveName = ref('run-logs');
/**
 * 调试变量列表
 */
const devVariableData = ref([]);

/**
 * 是否处于调试状态
 */
const isDev = ref(false);

const historys = ref<{
    curIndex: number;
    historys: { saveName: string; data: any[] }[];
    isRedo: boolean;
    isUndo: boolean;
}>({
    curIndex: 0,
    historys: [],
    isRedo: false,
    isUndo: false
});
const flowEditRef = ref<InstanceType<typeof FlowEdit>>();

function runLogsRowClassName({
    row
}) {
    return row.level;
}

// 添加逻辑
</script>

<template>
    <div class="viewbox flex-col">
        <TitleBar :title="'应用编辑'">
            <div class="viewbox flex flex-1 flex-row justify-between items-center">
                <div class="viewbox flex flex-row justify-end items-center gap-2">
                    <div class="btn-group flex justify-end items-center p-1 gap-2 text-gray-900">
                        <el-tooltip class="box-item" effect="dark" content="返回" placement="bottom">
                            <div @click="$router.go(-1)"
                                class="btn-item non-draggable flex justify-center items-center rounded py-1 px-2 cursor-pointer hover:bg-slate-400/30">
                                <i class="iconfont icon-fanhui"></i>
                            </div>
                        </el-tooltip>

                        <el-tooltip class="box-item" effect="dark" content="编辑应用信息" placement="bottom-start"
                            :show-after="100">
                            <div
                                class="btn-item group non-draggable flex justify-center items-center gap-2 rounded py-1 px-2 pr-8 cursor-pointer hover:bg-slate-400/30">
                                <i class="iconfont icon-yingyongming"></i>
                                <div>应用名称</div>
                                <i class="iconfont icon-bianji opacity-30 group-hover:opacity-100"></i>
                            </div>
                        </el-tooltip>
                        <BtnTip class="btn-item" :icon="'icon-baocun'" :text="'保存'"></BtnTip>
                        <div class="border-r border-gray-200 border-solid w-1 py-3"></div>
                    </div>
                    <div class="btn-group flex justify-end items-center p-1 gap-2 text-gray-900">
                        <BtnTip class="btn-item text-gray-400" :class="{ 'text-gray-800': historys.isUndo }"
                            :icon="'icon-chexiao'" :text="'撤销'" @click="flowEditRef?.undo()"></BtnTip>
                        <BtnTip class="btn-item text-gray-400 chongzuo" :class="{ 'text-gray-800': historys.isRedo }"
                            :icon="'icon-chexiao'" :text="'重做'" @click="flowEditRef?.redo()">
                        </BtnTip>

                        <BtnTip :icon="'icon-zhedie'" :text="'折叠'"></BtnTip>
                        <template v-if="!isDev">
                            <BtnTip class="bg-slate-400/20 rounded" :icon-class="'text-green-500'" :icon="'icon-tiaoshi'"
                                :text="'安装依赖包'" @click="installPackage">
                                安装包
                            </BtnTip>
                            <BtnTip class="bg-slate-400/20 rounded" :icon-class="'text-green-500'" :icon="'icon-yunxing'"
                                :text="'运行流程'" @click="run">
                                运行
                            </BtnTip>
                            <BtnTip class="bg-slate-400/20 rounded" :icon-class="'text-green-500'" :icon="'icon-tiaoshi'"
                                :text="'调试流程'" @click="devRun">
                                调试
                            </BtnTip>
                        </template>
                        <template v-else>
                            <BtnTip class="bg-slate-400/20 rounded" :icon-class="'text-green-500'" :icon="'icon-yunxing'"
                                :text="'运行到下一个断点'" @click="devResume">
                                继续
                            </BtnTip>
                            <BtnTip class="bg-slate-400/20 rounded" :icon-class="'text-green-500'" :text="'下一步'"
                                :icon="'icon-nextstep'" @click="devStepOver">
                                下一步
                            </BtnTip>
                            <BtnTip class="bg-slate-400/20 rounded" :icon-class="'text-green-500'" :icon="'icon-stop'"
                                :text="'停止调试'" @click="devStop">
                                停止
                            </BtnTip>
                        </template>
                    </div>
                </div>
                <div class="viewbox flex flex-row justify-end items-center gap-2">
                    <BtnTip class="bg-slate-400/15 rounded" :icon="'icon-wenhao'" :text="'帮助、教程、学习资料'">
                        学习中心
                    </BtnTip>
                    <BtnTip :icon="'icon-tongzhi'" :text="'消息通知'"> </BtnTip>
                    <BtnTip :icon="'icon-sandian'" :text="'插件、交流、分享'"> </BtnTip>
                    <div class="border-r border-gray-200 border-solid w-1 py-3"></div>
                </div>
            </div>
        </TitleBar>
        <div class="viewbox">
            <div class="flex flex-1 flex-row viewbox">
                <!-- 指令区 -->
                <BoxDraggable class="viewbox left-sidebar border-r" :width="250" :resize-right="true">
                    <DirectiveTree class="directive-edit flex-1 wrapbox p-1" @add-directive="flowEditRef?.addBlock($event)">
                    </DirectiveTree>
                </BoxDraggable>
                <div class="main-content viewbox flex-1 bg-gray-100">
                    <div class="flow-edit flex-1 viewbox p-2">
                        <FlowEdit v-if="userAppDetail" :app-info="userAppDetail" :flows="userAppDetail?.flows"
                            @history-change="(e) => {
                                console.log(e);
                                historys = e;
                            }
                                " ref="flowEditRef" :breakpointData="breakpointData"
                            :curActiveFlowIndex="curActiveFlowIndex">
                        </FlowEdit>
                    </div>
                    <BoxDraggable class="viewbox left-sidebar border-t" :height="270" :resize-top="true">
                        <el-tabs v-model="bottomTabsActiveName" :size="'small'" class="viewbox flex-1">
                            <el-tab-pane label="运行日志" name="run-logs">
                                <el-table :data="runLogs" :border="true" :row-class-name="runLogsRowClassName" style="width: 100%;
                                        height: calc(var(--draggable-height) - 60px);
                                    ">
                                    <el-table-column prop="level" label="消息类型" width="100" />
                                    <el-table-column prop="time" label="时间" width="180" />
                                    <el-table-column prop="message" label="内容" />
                                    <el-table-column label="流程名" width="100">
                                        <template #default="scope">
                                            {{ scope.row.data?.flowName }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="行号" width="60">
                                        <template #default="scope">
                                            <a class="cursor-pointer underline decoration-1 text-blue-500"
                                                @click="flowEditRef?.scrollIntoRow(scope.row.data?.blockLine)">{{
                                                    scope.row.data?.blockLine }}</a>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                            <el-tab-pane label="调试变量" name="dev-variable">
                                <el-table :data="devVariableData" style="
                                        width: 100%;
                                        height: calc(var(--draggable-height) - 60px);
                                    ">
                                    <el-table-column prop="name" label="变量名" width="180" />
                                    <el-table-column prop="val" label="变量值" width="180" />
                                    <el-table-column prop="type" label="变量类型" />
                                </el-table>
                            </el-tab-pane>
                        </el-tabs>
                    </BoxDraggable>
                </div>
                <BoxDraggable class="border-l viewbox" :width="250" :resize-left="true">
                    <div class="property-edit flex-1 p-2">
                        <div>流程</div>
                        <div class="flow-list flex flex-1" v-for="(flow, index) in userAppDetail?.flows" :key="index">
                            <div class="flow-item flex-1 pl-6 p-2 rounded hover:bg-slate-200"
                                :class="{ 'bg-slate-100': curActiveFlowIndex === index }">
                                {{ flow.name }}
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


::v-deep(.el-table .error) {
    color: red;
}

::v-deep(.el-table .info) {
    color: blue;
}

::v-deep(.el-tabs__content) {
    overflow: auto;
    margin-bottom: 4px;
    margin-left: 4px;
    margin-right: 4px;
}

::v-deep(.el-tabs__header) {
    background-color: #fff;
    margin-bottom: 4px;
}

::v-deep(.el-tabs--top .el-tabs__item.is-top:nth-child(2)) {
    padding-left: 4px;
}
</style>
