import { getMachineCode, getRegStatus, verifyToken } from '../reg';
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
}

export default Action;
