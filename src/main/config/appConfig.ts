import { app } from 'electron';
import User from '../api/User';
import { Conf } from 'electron-conf/main';

app.whenReady().then(() => {
    AppConfig.loginUserInit();
});

export class AppConfig {
    static conf = new Conf<User>({
        name: 'LOGIN_USER'
    });
    static API_URL: string = import.meta.env.DEV
        ? 'https://tuzirpa.vtool.vip'
        : 'https://tuzirpa.vtool.vip';
    static LOGIN_USER: User | null = null;
    static OFFLINE_CODE: string = '';

    static saveLoginInfo(user: User) {
        this.conf.set('loginToken', user.loginToken);
    }

    static clearLoginInfo() {
        this.conf.clear();
    }

    static async loginUserInit() {
        const loginToken = this.conf.get('loginToken');
        if (loginToken) {
            this.LOGIN_USER = await User.createLoginUser(loginToken);
            await this.LOGIN_USER.getVipInfo();
            this.LOGIN_USER.keepAlive();
        }
    }
}
