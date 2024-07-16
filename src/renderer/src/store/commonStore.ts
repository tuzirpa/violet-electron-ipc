import { computed, ref } from 'vue';
import { UserInfo } from './UserInfo';
import { Action } from '@renderer/lib/action';

export const userInfo = ref<UserInfo>({
    uid: -1,
    userName: '',
    mobile: '',
    avatarUrl: '',
    vipLevel: 0,
    vipExpireTime: ''
});

//清空用户信息
export const clearUserInfo = () => {
    userInfo.value = {
        uid: -1,
        userName: '',
        mobile: '',
        avatarUrl: '',
        vipLevel: 0,
        vipExpireTime: ''
    };
};

export const setUserInfo = async () => {
    userInfo.value = await Action.getUserInfo();
    console.log('用户信息', userInfo.value);
};
setUserInfo();

export const isLogin = computed(() => userInfo.value.uid > 0);
