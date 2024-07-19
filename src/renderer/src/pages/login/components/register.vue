<script setup lang="ts" name="注册">
import { ElButton, ElInput, ElMessage, ElForm, FormInstance } from 'element-plus';
import { ref } from 'vue';
import { Action } from '@renderer/lib/action';
import { sleep } from '@shared/Utils';

// 添加逻辑
const emit = defineEmits<{
    (e: 'registerSuccess'): void
}>()

async function register() {
    // 注册
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
        ElMessage.error('两次密码输入不一致');
        return;
    }
    /**
     * mobile: string,
        userName: string,
        password: string,
        captcha: string,
        captchaId: string
     */
    const result = await Action.userRegister(registerForm.value.mobile, registerForm.value.username,
        registerForm.value.password, registerForm.value.captcha, code.value.id);
    if (result.code === 0) {
        ElMessage.success('注册成功，即将跳转登录页面');
        await sleep(1500);
        emit('registerSuccess')
    } else {
        ElMessage.error(result.message);
    }

}

const code = ref({ id: '', captcha: '', imaData: '' });

/**
 * 获取验证码
 */
async function getCode() {
    const res = await Action.getCaptcha();
    code.value = res;
}

getCode();


const registerForm = ref({
    username: '',
    mobile: '',
    captcha: '',
    password: '',
    confirmPassword: ''
});
const registerRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 1, max: 20, message: '用户名长度在 1 到 20 个字符', trigger: 'blur' }
    ],
    mobile: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ],
    captcha: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 16, message: '密码长度在 6 到 16 个字符', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请输入确认密码', trigger: 'blur' },
        { min: 6, max: 16, message: '确认密码长度在 6 到 16 个字符', trigger: 'blur' },
        {
            validator: (_rule: any, value: string, callback: (error?: Error) => void) => {
                if (value !== registerForm.value.password) {
                    callback(new Error('两次输入的密码不一致!'));
                } else {
                    callback();
                }
            }, trigger: 'blur'
        }
    ]
};

const registerFormRef = ref<FormInstance>();

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            register();
        } else {
            console.log('error submit!', fields)
        }
    })
}

</script>

<template>
    <div class="register-container">
        <ElForm ref="registerFormRef" :model="registerForm" :rules="registerRules" label-width="80px">
            <el-form-item label="昵称" prop="username">
                <el-input v-model="registerForm.username"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="registerForm.mobile"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="captcha">
                <ElInput v-model="registerForm.captcha">
                    <template #suffix>
                        <ElImage style="width: 100px; height: 32px" :src="code.imaData" alt="验证码" @click="getCode">
                        </ElImage>
                    </template>
                </ElInput>

            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="registerForm.password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input type="password" v-model="registerForm.confirmPassword"></el-input>
            </el-form-item>
            <!-- 按钮靠右 -->
            <el-form-item class="flex">
                <el-button class="justify-end" type="primary" @click="submitForm(registerFormRef)">注册</el-button>
            </el-form-item>
        </ElForm>
    </div>
</template>

<style lang="less" scoped></style>
