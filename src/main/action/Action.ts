import { app, clipboard, dialog, shell } from 'electron';
import { getMachineCode, getRegStatus, verifyToken } from '../reg';
import Flow from '../userApp/Flow';
import UserAppManage from '../userApp/UserAppManage';
import { reloadDirective, useDirective } from '../userApp/directive/directive';
import { WindowManage, WindowNameType } from '../window/WindowManage';
import { AppConfig } from '../config/appConfig';
import User from '../api/User';
import Captcha from '../api/Captcha';
import { AppType } from '../userApp/UserApp';
import { getPlazas } from '../api/appplaza';
import { encrypt } from '../api/aes';
import { getRandom } from '../utils/RandomUtils';
import { getDeviceID } from '../utils/divice';
import { submitFeedback } from '../api/feedback';
import { WorkStatus } from '../userApp/WorkStatusConf';
import { AppVariable } from '../userApp/types';
import SystemDirectivePackageManage from '../systemDirective/SystemDirectivePackageManage';
import * as lzString from 'lz-string';

class Action {
    /**
     * 最小化窗口
     * @param name 窗口名称
     */
    static async windowMinimize(name: WindowNameType) {
        WindowManage.getWindow(name).minimize();
    }

    static async windowMaximize(name: WindowNameType) {
        const window = WindowManage.getWindow(name);
        if (window.isMaximized()) {
            WindowManage.getWindow(name).unmaximize();
        } else {
            WindowManage.getWindow(name).maximize();
        }
    }

    static async windowShow(name: WindowNameType) {
        WindowManage.getWindow(name).show();
    }

    static async windowClose(name: WindowNameType) {
        WindowManage.getWindow(name).close();
    }

    /**
     * 获取注册信息
     * @returns 注册信息
     */
    static async getRegStatus() {
        return getRegStatus();
    }
    /**
     * 获取机器码
     */
    static async getMachineCode() {
        return getMachineCode();
    }

    /**
     * 注册机器
     */
    static async verifyToken(token: string) {
        return verifyToken(token);
    }

    /**
     * 打开文件夹
     */
    static async openFolder(path: string) {
        return shell.showItemInFolder(`file://${path}`);
    }

    /**
     * 选择一个文件或文件夹
     */
    static async selectFileOrFolder(openDirectory: boolean = false, extensions: string[] = ['*']) {
        const properties = ['openFile'];
        openDirectory && properties.push('openDirectory');

        const res = await dialog.showOpenDialog({
            //@ts-ignore
            properties: properties,
            message: `${openDirectory ? '选择文件夹' : '选择文件'}`,
            buttonLabel: '选择',
            filters: [{ name: '所有文件', extensions }]
        });
        return res.filePaths;
    }

    /**
     * aes加密
     * @param content 加密内容
     */
    static async aesEncrypt(content: string) {
        content = lzString.compressToBase64(content);
        // content = aes.encrypt(content);
        return content;
    }
    /**
     * aes解密
     */
    static async aesDecrypt(content: string) {
        // content = aes.decrypt(content);
        content = lzString.decompressFromBase64(content);
        return content;
    }

    /**
     * 复制内容到粘贴板
     */
    static async copyToClipboard(content: string) {
        return clipboard.writeText(content);
    }

    /**
     * 获取用户应用列表
     * @returns 用户应用列表
     */
    static async getUserApps(type: AppType = 'myCreate') {
        return UserAppManage.getUserApps(type);
    }

    static async getUserApp(id: string) {
        return UserAppManage.getUserApp(id);
    }

    /**
     * 打开用户应用
     */
    static async openUserApp(id: string) {
        return UserAppManage.openUserApp(id);
    }
    /**
     * 保存工作状态
     */

    static async saveWorkStatus(appId: string, status: WorkStatus) {
        return UserAppManage.saveWorkStatus(appId, status);
    }

    /**
     * 新建用户应用
     * @returns 用户应用
     */
    static async newUserApp(name: string) {
        return UserAppManage.newUserApp(name);
    }

    /**
     * 保存全局变量
     */
    static async saveGlobalVariables(appId: string, globalVariables: AppVariable[]) {
        return UserAppManage.saveGlobalVariables(appId, globalVariables);
    }

    /**
     * 分享用户应用
     */

    static async shareUserAppToPlaza(appId: string) {
        return UserAppManage.shareUserAppToPlaza(appId);
    }

    /**
     * 导入广场引用到本地应用
     */
    static async appPlazasToLocal(app: any) {
        return UserAppManage.appPlazasToLocal(app);
    }

    /**
     * 获取广场应用
     */
    static async getAppPlazas() {
        return getPlazas();
    }

    /**
     * 新建子流程
     */
    static async newSubFlow(appId: string) {
        return UserAppManage.newSubFlow(appId);
    }
    /**
     * 删除子流程
     */
    static async deleteSubFlow(appId: string, flowName: string) {
        return UserAppManage.deleteSubFlow(appId, flowName);
    }

    /**
     * 保存流程
     */
    static async saveFlow(appId: string, flow: Flow) {
        return UserAppManage.saveFlow(appId, flow);
    }

    /**
     * 保存流程名称
     */
    static async saveFlowAliName(appId: string, flow: Flow) {
        return UserAppManage.saveFlowAliName(appId, flow);
    }

    static async installPackage(appId: string) {
        return UserAppManage.installPackage(appId);
    }
    static async userAppRun(appId: string) {
        return UserAppManage.userAppRun(appId);
    }
    static async userAppDevRun(appId: string) {
        return UserAppManage.userAppDevRun(appId);
    }

    /**
     * 检查userApp代码错误
     */
    static async lintError(appId: string) {
        return UserAppManage.lintError(appId);
    }

    /**
     * 设置断点
     */

    static async setBreakPoint(appId: string, flowName: string, stepIndex: number) {
        return UserAppManage.setBreakPoint(appId, flowName, stepIndex);
    }

    /**
     * 删除断点
     */
    static async deleteBreakPoint(appId: string, flowName: string, stepIndex: number) {
        return UserAppManage.deleteBreakPoint(appId, flowName, stepIndex);
    }

    /**
     *
     * @param appId
     * @returns
     */
    static async devStepOver(appId: string) {
        return UserAppManage.devStepOver(appId);
    }
    static async devResume(appId: string) {
        return UserAppManage.devResume(appId);
    }
    static async devStop(appId: string) {
        return UserAppManage.devStop(appId);
    }
    static async closeUserAppStepTip(appId: string) {
        return UserAppManage.closeUserAppStepTip(appId);
    }
    static async devGetProperties(appId: string, objectId: string) {
        return UserAppManage.devGetProperties(appId, objectId);
    }

    static async updateUserAppName(appId: string, name: string) {
        return UserAppManage.updateUserAppName(appId, name);
    }
    /**
     * 删除用户应用
     */
    static async deleteUserApp(appId: string) {
        return UserAppManage.deleteUserApp(appId);
    }

    /**
     * 获取用户应用指令列表
     * @returns 用户应用指令列表
     */
    static async getDirectives() {
        // await new Promise((resolve) => setTimeout(resolve, 3000));
        return useDirective();
    }
    static async reloadDirective() {
        reloadDirective();
        return useDirective();
    }

    /**
     * 获取用户信息
     * @returns 用户信息
     */
    static async getUserInfo(): Promise<{
        uid: number;
        userName: string;
        mobile: string;
        avatarUrl: string;
        vipLevel: number;
        vipExpireTime: string;
    }> {
        let userInfo = { ...AppConfig.LOGIN_USER };
        if (!AppConfig.LOGIN_USER?.offline) {
            try {
                if (AppConfig.LOGIN_USER && !AppConfig.LOGIN_USER.uid) {
                    await AppConfig.LOGIN_USER.getVipInfo();
                    userInfo = { ...AppConfig.LOGIN_USER };
                }
            } catch (e) {
                return {} as any;
            }
        }
        delete userInfo.password;
        delete userInfo.loginToken;
        console.log(userInfo);

        return userInfo as any;
    }

    /**
     * 用户注册
     * @param username 用户名手机号
     * @param password 用户密码
     * @returns
     */
    static async userRegister(
        mobile: string,
        userName: string,
        password: string,
        captcha: string,
        captchaId: string
    ) {
        const user = new User(mobile, userName, password);
        return user.register(captcha, captchaId);
    }

    /**
     * 用户登录
     * @returns
     */
    static async userLogin(
        mobile: string,
        userName: string,
        password: string,
        captcha: string,
        captchaId: string,
        remember: boolean
    ) {
        const user = new User(mobile, userName, password);
        return user.login(captcha, captchaId, remember);
    }

    static async getCaptcha() {
        return Captcha.getCaptcha();
    }

    /**
     * 登出
     * @returns 是否登出成功
     */
    static async logout() {
        if (AppConfig.LOGIN_USER) {
            if (!AppConfig.LOGIN_USER.offline) {
                await AppConfig.LOGIN_USER.logout();
            }
        }
        AppConfig.LOGIN_USER = null;
        // app.exit();
        return true;
    }

    /**
     * 重启应用
     */
    static async relaunchApp() {
        app.relaunch();
        app.quit();
    }

    /**
     * 获取离线验证图片
     */
    static async getOffLineVerificationImg() {
        //通过设备码生成验证码
        const machineCode = await getDeviceID();
        //生成验证码 6位随机数+设备码
        const loginCode = getRandom(100000, 1000000) + '';
        const code = `${loginCode}-${machineCode}-${Date.now()}`;
        AppConfig.OFFLINE_CODE = loginCode;
        const encryptedCode = encrypt(code);
        const imgUrl = `${AppConfig.API_URL}/offlinelogin?code=${encryptedCode}`;
        return imgUrl;
    }
    /**
     * 离线登录
     */
    static async offLineLogin(code: string) {
        if (AppConfig.OFFLINE_CODE === code) {
            AppConfig.LOGIN_USER = new User('1**********', '离线登录', '123456');
            AppConfig.LOGIN_USER.offline = true;
            return true;
        }
        throw new Error('验证码错误');
    }

    /**
     * 提交反馈
     */
    static async submitFeekback(content: string) {
        return submitFeedback({ content });
    }

    /**
     * 上传系统指令包
     */
    static async uploadNewVersionDirective(version: string, description: string) {
        return SystemDirectivePackageManage.uploadSystemDirectivePackage(version, description);
    }

    /**
     * 获取所有系统指令包版本
     */
    static async getAllVersions() {
        return SystemDirectivePackageManage.getAllVersions();
    }

    /**
     * 使用自定版本的系统指令
     * @param version 版本号
     */
    static async useVersionSystemDirective(version: string) {
        return SystemDirectivePackageManage.useVersionSystemDirective(version);
    }
}

export default Action;
