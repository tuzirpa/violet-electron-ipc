<script setup lang="ts" name="登录">
import qqImageUrl from '@renderer/assets/QQ.png';
import { Action } from '@renderer/lib/action';
import { isLogin, loginUserInfo } from '@renderer/store/commonStore';
import { ElButton, ElCheckbox, ElImage, ElInput } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import TitleBar from '../../components/TitleBar.vue';
import offlogin from './components/offlogin.vue';
import Register from './components/register.vue';

// 添加逻辑
const router = useRouter();

const activeName = ref('login');
const loginForm = ref({
    username: '',
    password: '',
    captcha: '',
    remember: false
});
loginForm.value = JSON.parse(localStorage.getItem('loginForm') || '{}');

const loginRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 16, message: '密码长度在 6 到 16 个字符', trigger: 'blur' }
    ],
    captcha: [
        { required: true, message: '请输入验证码', trigger: 'blur' }
    ]
};



async function login() {
    router.push('/userAppHome/index');
    // 登录逻辑
    // const res = await Action.userLogin(loginForm.value.username, loginForm.value.username,
    //     loginForm.value.password, loginForm.value.captcha, code.value.id, loginForm.value.remember);

    // if (res.code !== 0) {
    //     ElMessage.error(res.message);
    //     return;
    // }
    // if (res.code === 0) {

    //     // 保存登录状态
    //     const data = {} as any;
    //     data.username = loginForm.value.username;
    //     data.password = loginForm.value.password;
    //     data.remember = loginForm.value.remember;

    //     localStorage.setItem('loginForm', JSON.stringify(data));
    //     // 登录成功
    //     // 保存登录状态
    //     // 跳转到主页
    //     //@ts-ignore
    //     loginUserInfo.value = await Action.getUserInfo();
    //     router.push('/userAppHome/index');
    // }
}

const code = ref({ id: '', captcha: '', imaData: '' });

/**
* 获取验证码
*/
async function getCode() {
    const res = await Action.getCaptcha();
    code.value = res;
}


async function init() {
    //获取是否记住登录
    // userInfo.value = await Action.getUserInfo();
    console.log('userInfo', loginUserInfo.value);
    // 判断是否登录
    if (!isLogin.value) {
        getCode();
    } else {
        router.push('/userAppHome/index');
    }
}
setTimeout(() => {
    init();
}, 1000);

</script>

<template>
    <div class="login-page viewbox">
        <TitleBar :title="'兔子RPA'">
            <div class="flex flex-1 justify-between">
                <div>
                    兔子RPA
                </div>
                <div class="user-info flex items-center non-draggable">
                    <el-popover placement="bottom" :width="300" trigger="hover">
                        <template #reference>
                            <ElButton class="m-2" link>QQ交流群</ElButton>
                        </template>
                        <div class="user-info-content flex flex-col gap-2">
                            <ElImage :src="qqImageUrl"></ElImage>
                        </div>
                    </el-popover>
                    <!--  <el-popover placement="bottom" :width="200" trigger="hover">
                        <template #reference>
                            <ElButton class="m-2" link>微信</ElButton>
                        </template>
                        <div class="user-info-content flex flex-col gap-2">

                        </div>
                    </el-popover> -->
                </div>
            </div>

        </TitleBar>
        <div class="content-container flex-1 flex justify-around">
            <div class="nav-container flex-1 flex justify-center items-center bg-blue-500 text-white text-xl">
                重复工作自动化，提升工作效率，释放宝贵时间
            </div>
            <div class="form-container flex-1 flex justify-center items-center">
                <div class="w-3/4 p-10 flex flex-col gap-5">
                    <div class="form-title-container flex justify-center items-center gap-3"
                        :style="{ '--el-font-size-base': '18px' }">
                        <ElButton @click="activeName = 'login'"
                            :style="{ '--el-button-text-color': activeName === 'login' ? '#409eff' : '#999' }" link>登录
                        </ElButton>
                        <ElButton @click="activeName = 'register'"
                            :style="{ '--el-button-text-color': activeName === 'register' ? '#409eff' : '#999' }" link>注册
                        </ElButton>

                        <ElButton @click="activeName = 'offline'"
                            :style="{ '--el-button-text-color': activeName === 'offline' ? '#409eff' : '#999' }" link>离线登录
                        </ElButton>
                    </div>
                    <div class="form-content h-72">
                        <div class="login-form" v-show="activeName === 'login'">
                            <el-form :model="loginForm" :rules="loginRules" label-width="80px"
                                @submit.native.prevent="login">
                                <el-form-item label="用户名" prop="username">
                                    <el-input v-model="loginForm.username" placeholder="请输入用户名/手机号" clearable></el-input>
                                </el-form-item>
                                <el-form-item label="密码" prop="password">
                                    <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
                                </el-form-item>
                                <el-form-item class="flex items-center" label="验证码" prop="captcha">
                                    <ElInput v-model="loginForm.captcha" placeholder="请输入验证码">
                                        <template #suffix>
                                            <ElImage style="width: 100px; height: 32px" v-if="code.imaData"
                                                :src="code.imaData" alt="验证码" @click="getCode">
                                            </ElImage>
                                        </template>
                                    </ElInput>
                                </el-form-item>
                                <el-form-item class="flex justify-between items-center">
                                    <!-- <ElCheckbox v-model="loginForm.autoLogin"
                                        @change="(e) => { if (e) { loginForm.remember = true } }">自动登录</ElCheckbox> -->
                                    <ElCheckbox v-model="loginForm.remember">记住登录</ElCheckbox>
                                    <el-button class="ml-5 px-6" type="primary" native-type="submit">登录</el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="login-form" v-if="activeName === 'offline'">
                            <offlogin></offlogin>
                        </div>
                        <div class="register-form" v-if="activeName === 'register'">
                            <register @register-success="activeName = 'login'"></register>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
// 添加样式
::v-deep(.el-form-item__content) {
    justify-content: flex-end;
}

.offlineForm-verificationImg {
    ::v-deep(.el-form-item__content) {
        justify-content: center;
    }
}
</style>
