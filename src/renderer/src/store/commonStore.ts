import { computed, ref } from 'vue';
import { UserInfo } from './UserInfo';
import { Action } from '@renderer/lib/action';

export const loginUserInfo = ref<UserInfo>({
    uid: -1,
    userName: '',
    mobile: '',
    isAdmin: true,
    avatarUrl: '',
    vipLevel: 0,
    vipExpireTime: ''
});

//清空用户信息
export const clearUserInfo = () => {
    loginUserInfo.value = {
        uid: -1,
        userName: '',
        mobile: '',
        avatarUrl: '',
        vipLevel: 0,
        vipExpireTime: ''
    };
};

export const setUserInfo = async () => {
    loginUserInfo.value = await Action.getUserInfo();
    console.log('用户信息', loginUserInfo.value);
};
setUserInfo();

export const isLogin = computed(() => loginUserInfo.value.uid > 0);
