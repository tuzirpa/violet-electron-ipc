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
}

export default Action;
