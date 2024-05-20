<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Action } from '../../lib/action';

// 添加逻辑

const regForm = ref({ machineCode: '', regCode: '', regInfo: '请填写注册码', timeLong: 365 * 24 * 60 * 60 });
const labelPosition = ref('right');

const router = useRouter();

async function verifyToken() {
    if (!regForm.value.regCode) {
        regForm.value.regInfo = '请填写注册码';
        return;
    }

    await Action.verifyToken(regForm.value.regCode)
        .then((res) => {
            console.log(res);
            router.push('/');
        })
        .catch(() => {
            regForm.value.regInfo = '注册码有误';
        });
}

async function init() {
    regForm.value.machineCode = await Action.getMachineCode();
}
init();
</script>

<template>
    <div class="reg-page">
        <div class="reg-container">
            <el-form class="reg-content non-draggable" :label-position="labelPosition" label-width="auto" v-model="regForm">
                <el-form-item label="机器码">
                    <el-input v-model="regForm.machineCode" readonly />
                </el-form-item>
                <!-- <el-form-item label="注册时长">
            <el-select v-model="regForm.timeLong" placeholder="选择注册时长">
              <el-option label="一年" :value="365 * 24 * 60 * 60" />
              <el-option label="一个月" :value="30 * 24 * 60 * 60" />
              <el-option label="100年" :value="100 * 365 * 24 * 60 * 60" />
              <el-option label="10秒" :value="10" />
            </el-select>
          </el-form-item> -->
                <el-form-item label="注册码">
                    <el-input v-model="regForm.regCode" />
                </el-form-item>

                <el-form-item label="注册信息">
                    <div style="color: red">{{ regForm.regInfo }}</div>
                </el-form-item>

                <div class="reg-btn-container">
                    <ElButton class="reg-btn" @click="Action.mainWindowClose">关闭</ElButton>
                    <ElButton class="reg-btn" type="primary" @click="verifyToken">注册</ElButton>
                </div>
                <!-- <ElButton class="reg-btn" v-if="!isTrialed" @click="tryItForADay">试用一天</ElButton> -->
            </el-form>
        </div>
    </div>
</template>

<style lang="less" scoped>
// 添加样式
.reg-page {
    width: 100%;
    height: 100%;
}

.reg-container {
    padding: 20%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .reg-btn-container {
        display: flex;

        justify-content: flex-end;
        margin-top: 20px;

        .reg-btn {
            width: 150px;
        }
    }
}
</style>
