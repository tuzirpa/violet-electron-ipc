import { AppConfig } from '../config/appConfig';
import { getDeviceID } from '../utils/divice';
import { Request } from './Request';

export default class User {
    loginToken: string = '';
    offline: boolean = false;
    uid: string = '';
    vipLevel: number = 0;
    vipExpireTime: string = '';
    #keepAliveTimer: NodeJS.Timeout | null = null;

    constructor(
        public mobile: string,
        public userName: string,
        public password: string
    ) {}

    static async createLoginUser(loginToken: string) {
        const user = new User('', '', '');
        user.loginToken = loginToken;
        return user;
    }

    async getVipInfo(): Promise<{
        code: number;
        message: string;
        data: { vipLevel: number; vipExpireTime: number; mobile: string };
    }> {
        const response = await Request.post('/user/vipInfo');
        this.vipLevel = response.data.vipLevel;
        this.vipExpireTime = response.data.vipExpireTime;
        this.uid = response.data.id;
        this.mobile = response.data.mobile;
        this.userName = response.data.userName;
        return response;
    }

    async login(captcha: string, captchaId: string, remember: boolean) {
        if (!this.mobile) {
            return {
                code: 1,
                message: '手机号码不能为空'
            };
        }
        if (!this.userName) {
            return {
                code: 1,
                message: '用户名不能为空'
            };
        }
        if (!this.password) {
            return {
                code: 1,
                message: '密码不能为空'
            };
        }
        if (!captcha) {
            return {
                code: 1,
                message: '验证码不能为空'
            };
        }
        const diviceId = await getDeviceID();
        //请求服务器验证用户名密码
        const response = await Request.post('/user/0/login', {
            userName: this.userName,
            mobile: this.mobile,
            password: this.password,
            diviceId: diviceId,
            captcha,
            captchaId
        });
        const data = response;
        if (data.code !== 0) {
            return data;
        }
        await this.loginSuccess(data.data);
        if (remember) {
            //保存登录信息到本地
            AppConfig.saveLoginInfo(this);
        }
        return data;
    }

    async loginSuccess(data: { token: string; uid: string; companyId: string; manager: boolean }) {
        // TODO: 登录成功逻辑
        this.loginToken = data.token;
        this.uid = data.uid;
        AppConfig.LOGIN_USER = this;
        await this.getVipInfo();

        /**
         * 启动一个定时器，记录用户在线
         */
        this.keepAlive();
    }

    /**
     * 保持用户心跳
     */
    async keepAlive() {
        let response: any;
        try {
            response = await Request.post('/user/keepAlive');
        } catch (error) {
            console.error(error);
        } finally {
            this.#keepAliveTimer = setTimeout(() => {
                if (AppConfig.LOGIN_USER) {
                    this.keepAlive();
                }
            }, 30 * 1000);
        }

        return response;
    }

    async register(captcha: string, captchaId: string) {
        // TODO: 注册逻辑
        if (!this.mobile) {
            return {
                code: 1,
                message: '手机号码不能为空'
            };
        }
        if (!this.userName) {
            return {
                code: 1,
                message: '用户名不能为空'
            };
        }
        if (!this.password) {
            return {
                code: 1,
                message: '密码不能为空'
            };
        }
        //请求服务器验证用户名密码
        const response = await Request.post('/user/0/register', {
            mobile: this.mobile,
            userName: this.userName,
            password: this.password,
            captcha,
            captchaId
        });
        const data = response;
        return data;
    }

    async logout() {
        const response = await Request.post('/user/logout');
        if (response.code === 0) {
            this.#keepAliveTimer && clearTimeout(this.#keepAliveTimer);
        }
        return response;
    }
}
