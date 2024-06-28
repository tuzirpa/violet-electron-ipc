import { BrowserWindow, screen } from 'electron';
import { sendLog } from './robotUtil';
import path from 'path';

export default {
    createStepWindow: async function (userApp: { name: string }) {
        sendLog('info', `创建运行提示窗口`, {} as any);
        //获取屏幕尺寸 然后减去窗口大小 得到窗口的位置
        const { width, height } = screen.getPrimaryDisplay().workAreaSize;
        const x = width - 400;
        const y = height - 300;
        const window = new BrowserWindow({
            width: 400,
            height: 300,
            autoHideMenuBar: import.meta.env.DEV ? false : true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                sandbox: false,
                contextIsolation: false
            },
            x,
            y,
            show: false,
            frame: false
        });

        const content = `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>执行步骤</title>
        <style>
            
        </style>
    </head>
    <body>
        <div class="app-name">
             ${userApp.name}
        </div>
        <script>
            document.addEventListener('DOMContentLoaded', () => {
                window.electron.ipcRenderer.send('tray-menu-click', id);
                console.log('DOMContentLoaded')
            });
        </script>
    </body>
    </html>`;

        window.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(content)}`);

        window.setAlwaysOnTop(true, 'floating');
        if (import.meta.env.DEV) {
            window.webContents.openDevTools();
        }
        return window;
    }
};
