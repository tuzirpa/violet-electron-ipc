<script setup lang="ts">
import { ref } from "vue";
import { Action } from '@renderer/lib/action';
import { ElButton, ElMessage } from 'element-plus';

// 添加逻辑


const datas = ref<any[]>([])

async function getDatas() {
    const res = await Action.getAppPlazas();
    console.log(res);

    datas.value = res;
}
getDatas();

async function appPlazasToLocal(app: any) {
    console.log(app);
    await Action.appPlazasToLocal(app);
    ElMessage.success('导入成功,请到我开发的应用查看');

}


</script>

<template>
    <div class="viewbox">
        <div class="flex justify-between items-center mr-1">
            <div class="app-list-title flex font-bold text-lg items-center p-2">
                应用广场
            </div>
        </div>
        <div class="app-list flex flex-col p-2 gap-1">
            <div class="app-item flex justify-between items-center border p-2 rounded" v-for="(app, index) in datas"
                :key="index">
                <div class="app-name">
                    {{ app.name }}
                </div>
                <div class="operation flex justify-center items-center">
                    <el-button class="text-blue-400" link @click="appPlazasToLocal(app)">导入到我的应用</el-button>
                    <!--     <el-button class="text-blue-400" link
                        @click="$router.push('/flowHome/index?appId=' + app.id)">编辑</el-button> -->
                    <!-- <el-button class="text-blue-400" link @click="deleteUserApp(app.id)"
                        :loading="app.deleting">删除</el-button> -->
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
// 添加样式
</style>
