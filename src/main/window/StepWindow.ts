import { BrowserWindow } from 'electron';

export default class StepWindow extends BrowserWindow {
    constructor() {
        super({
            width: 400,
            height: 300,
            x: 0, // 设置窗口左上角 x 坐标为 0
            y: undefined // 不设置 y 坐标，让 Electron 自动计算合适的位置
        });
        const url = import.meta.env.DEV ? process.env['ELECTRON_RENDERER_URL'] : 'assets://app';
        this.loadURL(url + '/stepTip.html');
    }
}
