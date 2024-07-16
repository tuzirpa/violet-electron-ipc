<script setup lang="ts">
import TitleBar from '@renderer/components/TitleBar.vue';
import BoxDraggable from '@renderer/components/BoxDraggable.vue';
import { ElAvatar, ElButton, ElMessage, ElMessageBox } from 'element-plus';
import type UserApp from 'src/main/userApp/UserApp';
import { ref } from 'vue';
import { Action } from '@renderer/lib/action';
import { clearUserInfo, userInfo } from '@renderer/store/commonStore';
import BtnTip from '@renderer/components/BtnTip.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

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

async function logout() {
    await Action.logout();
    clearUserInfo();
    router.push('/login/index');
}


</script>

<template>
    <div class="viewbox">
        <TitleBar :title="'首页'">
            <div class="flex flex-1 justify-between">
                <div>首页</div>
                <div class="user-info flex items-center non-draggable">
                    <el-popover ref="popover" placement="bottom" :width="200" trigger="click">
                        <template #reference>
                            <ElButton class="m-2" link>{{ userInfo.userName }}</ElButton>
                        </template>
                        <div class="user-info-content flex flex-col gap-2">
                            <!-- 用户信息 -->
                            <div class="user-info-item flex items-center gap-1">
                                <ElAvatar>{{ userInfo.userName }}</ElAvatar>
                                <div>
                                    <div>{{ userInfo.userName }}</div>
                                    <div>{{ userInfo.mobile }}</div>
                                </div>
                            </div>
                            <!-- 退出登录 -->
                            <BtnTip class="btn-item flex justify-start text-lg" :iconClass="'text-lg'"
                                :icon="'icon-tuichudenglu'" :text="'退出登录'" @click="logout">退出登录
                            </BtnTip>
                        </div>
                    </el-popover>
                </div>
            </div>
        </TitleBar>
        <div class="home-container flex-1 flex ">
            <BoxDraggable class="menu-box border-r flex flex-col" :width="250" :resize-right="true">
                <div class="home-left flex justify-center items-center">
                    <div class="p-2 flex flex-1 text-center">
                        <ElButton class="flex-1" type="primary" @click="newApp">新建应用</ElButton>
                    </div>
                </div>
            </BoxDraggable>
            <BoxDraggable class="content-box flex flex-col border-r flex-1 bg-gray-100 p-2">
                <!-- <div class="top-bar flex justify-between items-center">
                    <div class="title">帮助中心</div>
                </div> -->
                <div class="content-container flex flex-1 flex-col rounded bg-white">
                    <!-- 内容区域 -->
                    <!-- 应用列表 -->
                    <div class="app-list-title flex font-bold text-lg items-center p-2">
                        我的应用列表
                    </div>
                    <div class="app-list flex flex-col p-2">
                        <div class="app-item flex justify-between items-center border p-2 rounded"
                            v-for="(app, index) in userApps" :key="index">
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
            </BoxDraggable>
        </div>
    </div>
</template>

<style lang="less" scoped>
// 添加样式
</style>
