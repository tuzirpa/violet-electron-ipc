<script setup lang="ts" name="注册">
import { ElButton, ElInput, ElForm } from 'element-plus';
import { ref } from 'vue';
import { Action } from '@renderer/lib/action';
import VueQrcode from 'vue-qrcode';
import { useRouter } from 'vue-router';
import { userInfo } from '@renderer/store/commonStore';


const offlineForm = ref({
    verificationCode: '',
    verificationImg: ''
});

function getOffLineVerificationImg() {
    Action.getOffLineVerificationImg().then(url => {
        offlineForm.value.verificationImg = url;
        console.log(offlineForm.value.verificationImg);

    });
}

getOffLineVerificationImg();
const router = useRouter();
async function offLineLogin() {
    await Action.offLineLogin(offlineForm.value.verificationCode);
    userInfo.value = await Action.getUserInfo();
    router.push('/userAppHome/index');
}
const rules = {
    verificationCode: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { min: 6, max: 6, message: '验证码为6位数字', trigger: 'blur' }
    ]
};


</script>

<template>
    <div class="register-container">
        <el-form :model="offlineForm" :rules="rules" @submit.native.prevent label-width="80px">

            <el-form-item label="验证码" prop="verificationCode">
                <el-input v-model="offlineForm.verificationCode" placeholder="请输入验证码">
                </el-input>
            </el-form-item>

            <el-form-item>
                <!-- <el-image style="display: flex; justify-content: center; align-items: center; width: 300px; height: 300px"
                    :src="offlineForm.verificationImg" fit="fill" /> -->
                <div class="w-full text-center flex flex-col justify-center items-center">
                    <VueQrcode :value="offlineForm.verificationImg" :color="{}" :width="300" type="image/jpeg">
                    </VueQrcode>
                    手机扫码获取验证码
                </div>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="offLineLogin">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style lang="less" scoped></style>
