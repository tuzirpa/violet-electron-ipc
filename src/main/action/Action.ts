import { clipboard, shell } from 'electron';
import { getMachineCode, getRegStatus, verifyToken } from '../reg';
import Flow from '../userApp/Flow';
import UserAppManage from '../userApp/UserAppManage';
import { useDirective } from '../userApp/directive/directive';
import { WindowManage, WindowNameType } from '../window/WindowManage';

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
     * 复制内容到粘贴板
     */

    static async copyToClipboard(content: string) {
        return clipboard.writeText(content);
    }

    /**
     * 获取用户应用列表
     * @returns 用户应用列表
     */
    static async getUserApps() {
        return UserAppManage.getUserApps();
    }

    static async getUserApp(id: string) {
        return UserAppManage.getUserApp(id);
    }

    /**
     * 新建用户应用
     * @returns 用户应用
     */
    static async newUserApp(name: string) {
        return UserAppManage.newUserApp(name);
    }

    /**
     * 保存流程
     */
    static async saveFlow(appId: string, flow: Flow) {
        return UserAppManage.saveFlow(appId, flow);
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
    static async devStepOver(appId: string) {
        return UserAppManage.devStepOver(appId);
    }
    static async devResume(appId: string) {
        return UserAppManage.devResume(appId);
    }
    static async devStop(appId: string) {
        return UserAppManage.devStop(appId);
    }
    static async devGetProperties(appId: string, objectId: string) {
        return UserAppManage.devGetProperties(appId, objectId);
    }

    static async updateUserAppName(appId: string, name: string) {
        return UserAppManage.updateUserAppName(appId, name);
    }

    static async getDirectives() {
        return useDirective();
    }
}

export default Action;
