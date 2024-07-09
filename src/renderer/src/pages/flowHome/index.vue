<script setup lang="tsx">
import TitleBar from '@renderer/components/TitleBar.vue';
import BoxDraggable from '@renderer/components/BoxDraggable.vue';
import DirectiveTree from './components/DirectiveTree.vue';
import FlowEdit from './components/FlowEdit.vue';
import BtnTip from '@renderer/components/BtnTip.vue';
import { Column, ElAutoResizer, ElButton, ElMessage, ElMessageBox, ElTable, ElTableColumn, ElTableV2 } from 'element-plus';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { Action } from '@renderer/lib/action';
import type UserApp from 'src/main/userApp/UserApp';
import type { IBreakpoint } from 'src/main/userApp/devuserapp/DevNodeJs';
import { errorDirectives } from './components/FlowEditStore';
import { handleRunLogsContextMenu, runLogs } from './indexvue';
import { Alignment } from 'element-plus/es/components/table-v2/src/constants';

runLogs.value.push(
    {
        level: 'info',
        message: '1231',
        time: 0,
        data: {
            blockLine: 0,
            flowName: '',
            directiveName: '',
            directiveDisplayName: '',
            failureStrategy: 'terminate',
            intervalTime: 0,
            retryCount: 0
        }
    },
    {
        level: 'info',
        message: '1231',
        time: 0,
        data: {
            blockLine: 0,
            flowName: '',
            directiveName: '',
            directiveDisplayName: '',
            failureStrategy: 'terminate',
            intervalTime: 0,
            retryCount: 0
        }
    }
);

const route = useRoute();
const id = route.query.appId as string;

// 定义变量
const userAppDetail = ref<UserApp>();


async function getAppDetail() {
    // 获取应用详情
    // 这里应该调用后端接口获取应用详情
    const res = await Action.getUserApp(id);
    userAppDetail.value = res;
    runLogs.value = [];
    console.log(userAppDetail.value, 'userAppDetail');
    if (userAppDetail.value?.flows && userAppDetail.value.flows.length > 0) {
        curActiveFlowIndex.value = 0;
    }
}

function newSubFlow() {
    getAppDetail();
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
        if (isDev.value || isRun.value) {
            ElMessage.info('正在运行中...');
            return;
        }
        await Action.userAppRun(userAppDetail.value?.id);
        isRun.value = true;
        window.electron.ipcRenderer.on('breakpoint', breakpointCallback);
        window.electron.ipcRenderer.on('devRunEnd', devRunEndCallback);
    }
}

const breakpointData = ref<IBreakpoint>({
    line: 0,
    url: ''
});

const breakpointCallback = async (_event: any, data: IBreakpoint) => {
    console.log(data, 'breakpoint');
    breakpointData.value = data;
    isDev.value = true;

    //获取断点变量列表
    if (
        userAppDetail.value?.id &&
        breakpointData.value.scopeChain &&
        breakpointData.value.scopeChain.length > 0
    ) {
        const scopeChain = breakpointData.value.scopeChain[0].object.objectId;
        const res = await Action.devGetProperties(userAppDetail.value?.id, scopeChain);
        console.log(res.result);
        devVariableData.value = res.result.map((item: { name: any; value: { type: any; value: any; }; }) => {
            const name = item.name;
            return {
                type: item.value.type ?? '未初始化',
                name,
                val: item.value.value
            };
        });
    }
};

const devRunEndCallback = (_event: any) => {
    isDev.value = false;
    isRun.value = false;
    window.electron.ipcRenderer.removeAllListeners('breakpoint');
    window.electron.ipcRenderer.removeAllListeners('devRunEnd');
    breakpointData.value = { line: 0, url: '' };
    devVariableData.value = [];
};

async function devRun() {
    if (userAppDetail.value?.id) {
        if (isDev.value || isRun.value) {
            ElMessage.info('正在运行中...');
            return;
        }
        await Action.userAppDevRun(userAppDetail.value?.id);
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
const isRun = ref(false);

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

/**
 * 日志行样式
 * @param param0 
 */
function runLogsRowClassName(row: { rowData: { level: any; }; }) {
    return row.rowData.level;
}

function handleRowEvent(..._args: any[]) {
    console.log(_args, 'handleRowEvent');
}

async function clickUserAppName() {
    if (!userAppDetail.value) {
        return;
    }
    const { value } = await ElMessageBox.prompt('请输入应用名称', '修改应用名称', {
        inputValue: userAppDetail.value?.name,
        inputType: 'text',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
    });
    if (value) {
        await Action.updateUserAppName(userAppDetail.value.id, value);
        userAppDetail.value.name = value;
    }
}
const hideDirective = ref(false);
const hideDirectiveTree = (e: boolean) => {
    hideDirective.value = e;
    directiveWidth.value = e ? 60 : 250;
};
const directiveWidth = ref(250);


const runLogsColumns: Column<any>[] = [
    {
        key: 'rowIndex',
        title: '序号',
        width: 50,
        align: 'center',
        cellRenderer: ({ rowIndex }) => (
            <>
                {runLogs.value.length - rowIndex}
            </>
        )
    },
    {
        key: 'level',
        title: '消息类型',
        dataKey: 'level',
        width: 80,
        align: 'center',
        cellRenderer: ({ cellData: level }) => (
            <>
                {level}
            </>
        )
    },
    {
        key: 'time',
        title: '时间',
        dataKey: 'time',
        width: 150,
        align: Alignment.CENTER,
        cellRenderer: ({ cellData: time }) => (
            <>
                {time}
            </>
        )
    },
    {
        key: 'message',
        title: '内容',
        dataKey: 'message',
        class: 'log-message',
        headerClass: 'log-message',
        width: 150,
        align: Alignment.CENTER,
        cellRenderer: ({ cellData: message, rowData }) => (
            <div class="flex justify-center items-center h-full w-full" onContextmenu={(e: MouseEvent) => { handleRunLogsContextMenu(rowData, 4, e) }}>
                <span class="truncate flex-1 w-0">{message}</span>
            </div>
        )
    },
    {
        key: 'data',
        title: '流程名',
        dataKey: 'data',
        width: 150,
        maxWidth: 500,
        align: Alignment.CENTER,
        cellRenderer: ({ cellData: data }) => {
            /**
             * <el-auto-resizer>
                                        <template #default="{ height, width }">
             */
            // const slotsDefault = ({ height, width }) => {

            // }
            return (<>
                {data?.flowName}
            </>)
        }
    },
    {
        key: 'line',
        title: '行号',
        dataKey: 'data',
        width: 80,
        align: Alignment.CENTER,
        cellRenderer: ({ cellData: data }) => (
            <div class="cursor-pointer underline decoration-1" onclick={() => {
                flowEditRef.value?.scrollIntoRow(data?.flowName, data?.blockLine)
            }}>
                {data?.blockLine}
            </div>
        )
    },
];


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
                            <div @click="clickUserAppName"
                                class="btn-item group non-draggable flex justify-center items-center gap-2 rounded py-1 px-2 pr-8 cursor-pointer hover:bg-slate-400/30">
                                <i class="iconfont icon-yingyongming"></i>
                                <div class="w-20 truncate group-hover:text-gray-800">{{ userAppDetail?.name }}</div>
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

                        <!-- <BtnTip :icon="'icon-zhedie'" :text="'折叠'"></BtnTip> -->
                        <template v-if="!isDev">
                            <BtnTip class="bg-slate-400/20 rounded" :icon-class="'text-green-500'" :icon="'icon-tiaoshi'"
                                :text="'安装依赖包'" @click="installPackage">
                                安装包
                            </BtnTip>
                            <BtnTip class="bg-slate-400/20 rounded" :class="{ 'text-gray-300': isRun || isDev }"
                                :icon-class="'text-green-500'" :icon="'icon-yunxing'" :text="'运行流程'" @click="run">
                                运行
                            </BtnTip>
                            <BtnTip class="bg-slate-400/20 rounded" :class="{ 'text-gray-300': isRun || isDev }"
                                :icon-class="'text-green-500'" :icon="'icon-tiaoshi'" :text="'调试流程'" @click="devRun">
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
                        </template>
                        <BtnTip class="bg-slate-400/20 rounded text-gray-300" :icon-class="'text-green-500'"
                            :icon="'icon-stop'" :text="'停止'" @click="devStop" :class="{ 'text-red-600 ': isDev || isRun }">
                            停止
                        </BtnTip>
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
                <BoxDraggable class="viewbox left-sidebar border-r" :width="directiveWidth" :min-width="60"
                    :resize-right="true">
                    <DirectiveTree @hide-directive-tree="hideDirectiveTree" class="directive-edit flex-1 wrapbox p-1"
                        @add-directive="flowEditRef?.addBlock($event)">
                    </DirectiveTree>
                </BoxDraggable>

                <div class="main-content viewbox flex-1 bg-gray-100">
                    <div class="flow-edit flex-1 viewbox p-2">
                        <FlowEdit v-if="userAppDetail" :app-info="userAppDetail" :flows="userAppDetail?.flows"
                            @new-sub-flow="newSubFlow" @history-change="(e) => {
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
                                <div style="width: 100%;
                                                height: calc(var(--draggable-height) - 60px);
                                            ">
                                    <el-auto-resizer>
                                        <template #default="{ height, width }">
                                            <ElTableV2 :columns="runLogsColumns" :row-class="runLogsRowClassName"
                                                @row-event-handlers="handleRowEvent" :data="runLogs" :width="width"
                                                :height="height">
                                                <template #empty>
                                                    <div class="flex justify-center items-center pt-3 text-gray-400">暂无数据
                                                    </div>
                                                </template>

                                            </ElTableV2>
                                        </template>
                                    </el-auto-resizer>
                                </div>
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
                            <el-tab-pane class="error-list" label="错误列表" name="error-list">
                                <template #label>
                                    <div class="error-list-title" :class="{ 'cornerMark': errorDirectives.length }">错误列表
                                    </div>
                                </template>
                                <ElTable :data="errorDirectives" style="
                                        width: 100%;
                                        height: calc(var(--draggable-height) - 60px);
                                    ">
                                    <ElTableColumn label="流程名" width="180">
                                        <template #default="scope">
                                            {{ scope.row.file.name }}
                                        </template>
                                    </ElTableColumn>
                                    <el-table-column label="错误指令" width="180">
                                        <template #default="scope">
                                            {{ scope.row.directive.displayName }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="错误描述">
                                        <template #default="scope">
                                            {{ scope.row.directive.error }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="line" label="行号" width="180">
                                        <template #default="scope">
                                            <a class="cursor-pointer underline decoration-1 text-blue-500"
                                                @click="flowEditRef?.scrollIntoRow(scope.row.file.name, scope.row.line)">
                                                {{ scope.row.line }}
                                            </a>
                                        </template>
                                    </el-table-column>
                                </ElTable>
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
                                {{ flow.aliasName }}
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

.cornerMark {
    position: relative;

    &::after {
        position: absolute;
        content: "";
        display: block;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background-color: #f56c6c;
        top: 0;
        right: 0;
        transform: translateX(100%);
    }
}

::v-deep(.log-message) {
    flex: 1 !important;
}

::v-deep(.el-table-v2 .error) {
    color: red;
}

::v-deep(.el-table-v2 .info) {
    color: blue;
}

::v-deep(.el-table-v2 .fatalError) {
    //动画闪烁
    color: red;
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
