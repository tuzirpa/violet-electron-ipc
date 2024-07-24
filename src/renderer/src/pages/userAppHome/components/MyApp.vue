<script setup lang="tsx">
import { ref } from "vue";
import { Action } from '@renderer/lib/action';
import { ElButton, ElMessage, ElMessageBox } from 'element-plus';
import { showContextMenu } from '@renderer/components/contextmenu/ContextMenuPlugin';
import { shareUserAppToPlaza, UserAppInfo } from './MyApp';
import { Upload } from '@element-plus/icons-vue';
import { loginUserInfo } from "@renderer/store/commonStore";

const emit = defineEmits<{
    (e: 'toAppPlazas'): void
}>();

const userApps = ref<UserAppInfo[]>([])

async function newApp() {
    const res = await ElMessageBox.prompt('请输入应用名称', '新建应用');
    if (res.action === 'confirm') {
        const name = res.value;
        await Action.newUserApp(name);
        getUserApps();
    }
}

async function getUserApps() {
    const apps = await Action.getUserApps();
    userApps.value = apps;
}
getUserApps();

function runUserApp(id: string) {
    Action.userAppRun(id);
}
function deleteUserApp(id: string) {

    ElMessageBox.confirm('确认删除该应用吗？').then(async (confirm) => {
        if (confirm === 'confirm') {
            userApps.value.find((app) => app.id === id)!.deleting = true;
            Action.deleteUserApp(id);
            getUserApps();
            ElMessage.success('删除成功');
        }
    });

}

/**
 * 显示右键菜单
 * @param event 
 * @param app 
 */
function showContextMenuByApp(event: MouseEvent, app: UserAppInfo) {
    showContextMenu(event, [
        {
            label: '运行',
            onClick: () => {
                runUserApp(app.id);
            },
            icon: 'icon-yunxing',
            shortcut: ''
        },
        {
            label: '发布到示例广场',
            onClick: () => {
                if (!loginUserInfo.value.isAdmin) {
                    ElMessage.error('只有管理员才能分享应用');
                    return;
                }
                shareUserAppToPlaza(app);
            },
            icon: <el-icon><Upload /></el-icon>,
            shortcut: ''
        },
        // {
        //     label: '分享',
        //     onClick: () => {

        //         sharedAppDialog.value.show = true;
        //         sharedAppDialog.value.userApp = app;
        //     },
        //     icon: <el-icon><Share /></el-icon>,
        //     shortcut: ''
        // }
    ]);
}

const sharedAppDialog = ref({
    show: false,
    userApp: {}
});

defineExpose({
    newApp
});

</script>

<template>
    <div class="viewbox">
        <div class="app-list-title flex font-bold text-lg items-center p-2">
            我的应用列表
        </div>
        <div class="app-list h-0 flex-1 flex flex-col p-2 gap-1 wrapbox">
            <div class="app-item flex justify-between items-center border p-2 rounded" v-for="(app, index) in userApps"
                :key="index" @contextmenu="showContextMenuByApp($event, app)">
                <div class="app-name">
                    {{ app.name }}
                </div>
                <div class="operation flex justify-center items-center">
                    <el-button class="text-blue-400" link @click="runUserApp(app.id)">运行</el-button>
                    <el-button class="text-blue-400" link
                        @click="$router.push('/flowHome/index?appId=' + app.id)">编辑</el-button>
                    <el-button class="text-blue-400" link @click="deleteUserApp(app.id)"
                        :loading="app.deleting">删除</el-button>
                </div>
            </div>
            <div class="flex justify-center items-center flex-1" v-show="userApps.length === 0">
                <div class="app-item flex justify-center items-center p-2 text-xl">
                    可以<span class="text-blue-400 cursor-pointer" @click="newApp">开始创建</span>你的第一个应用，
                    或去<span class="text-blue-400 cursor-pointer" @click="emit('toAppPlazas')">示例广场</span>下载应用
                </div>
            </div>

        </div>
        <Teleport to="body">
            <el-dialog v-model="sharedAppDialog.show" :title="`分享应用`" draggable>
                <div>
                    <div>是否加密</div>
                </div>
                <div>
                    <ElButton type="primary">保存到文件</ElButton>
                    <ElButton type="primary">发布生成应用页</ElButton>
                </div>
            </el-dialog>
        </Teleport>
    </div>
</template>

<style lang="less" scoped>
// 添加样式
</style>
