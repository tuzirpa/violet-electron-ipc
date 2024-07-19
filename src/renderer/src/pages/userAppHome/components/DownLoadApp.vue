<script setup lang="ts">
import { ref } from "vue";
import { Action } from '@renderer/lib/action';
import type UserApp from 'src/main/userApp/UserApp';
import { ElButton, ElMessage, ElMessageBox } from 'element-plus';

// 添加逻辑


type UserAppInfo = UserApp & { deleting?: boolean };
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


</script>

<template>
    <div class="viewbox">
        <div class="flex justify-between items-center mr-1">
            <div class="app-list-title flex font-bold text-lg items-center p-2">
                我导入的应用列表
            </div>
            <div>
                <ElButton type="primary" @click="newApp">导入新应用</ElButton>
            </div>
        </div>
        <div class="app-list flex flex-col p-2 gap-1">
            <div class="app-item flex justify-between items-center border p-2 rounded" v-for="(app, index) in userApps"
                :key="index">
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
        </div>
    </div>
</template>

<style lang="less" scoped>
// 添加样式
</style>
