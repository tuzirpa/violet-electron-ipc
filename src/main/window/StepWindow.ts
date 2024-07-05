import { BrowserWindow, screen } from 'electron';
import { join } from 'path';

export default class StepWindow extends BrowserWindow {
    constructor(public userAppId: string) {
        //获取屏幕尺寸 然后减去窗口大小 得到窗口的位置
        const { width, height } = screen.getPrimaryDisplay().workAreaSize;
        const x = width - 350 - 20;
        const y = height - 150 - 20;

        super({
            width: 350,
            height: 150,
            autoHideMenuBar: import.meta.env.DEV ? false : true,
            webPreferences: {
                preload: join(__dirname, '../preload/index.js'),
                sandbox: false,
                contextIsolation: false
            },
            frame: false,
            show: false,
            x,
            y
        });
        const url = import.meta.env.DEV ? process.env['ELECTRON_RENDERER_URL'] : 'assets://app';
        this.loadURL(url + '/steptip.html?userAppId=' + userAppId);
        if (import.meta.env.DEV) {
            this.webContents.openDevTools();
        }
        this.setAlwaysOnTop(true, 'floating');
    }
}
