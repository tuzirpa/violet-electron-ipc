import { app, BrowserWindow, ipcMain, protocol } from 'electron';
import { electronApp, optimizer } from '@electron-toolkit/utils';
import Action from './action/Action';
import MethodsUtils from '@shared/MethodsUtils';
import { registerAssetsProtocol } from './serve';
import { WindowManage } from './window/WindowManage';
import nodeEvbitonment from './nodeEnvironment/NodeEvbitonment';
import robotUtil from './userApp/robotUtil/robotUtil?modulePath';
import robotLog from './userApp/robotUtil/log?modulePath';
import UserApp from './userApp/UserApp';
import UserAppManage from './userApp/UserAppManage';

let mainWindow: BrowserWindow;
const gotTheLock = app.isPackaged ? app.requestSingleInstanceLock() : true; //仅生产环境生效

if (!gotTheLock) {
    app.quit();
} else {
    protocol.registerSchemesAsPrivileged([
        { scheme: 'assets', privileges: { secure: true, standard: true, supportFetchAPI: true } }
    ]);
    app.on('second-instance', (_event, _commandLine, _workingDirectory) => {
        if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
        }
    });
    start();
}
function start() {
    MethodsUtils.getStaticMethods(Action).forEach((item: any) => {
        const { name, method } = item;
        ipcMain.handle(name, async (_e, ...args) => {
            const result = await method(...args);
            if (result) {
                return JSON.parse(JSON.stringify(result));
            }
            return result;
        });
    });

    function createWindow() {
        //判断是否登录
        const url = import.meta.env.DEV ? process.env['ELECTRON_RENDERER_URL'] : 'assets://app';
        //创建登录窗口
        mainWindow = WindowManage.createWindow('login');
        mainWindow.loadURL(url + '/#/login/index');
        if (import.meta.env.DEV) {
            mainWindow.webContents.openDevTools();
        }

        //扫码本地app
        UserApp.rebotUtilPath = robotUtil;
        UserApp.rebotUtilLogPath = robotLog;
        UserAppManage.scanLocalApp();
    }

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.whenReady().then(() => {
        registerAssetsProtocol();
        createWindow();
        nodeEvbitonment.autoInstallNode();
        UserApp.init();
        // Set app user model id for windows
        electronApp.setAppUserModelId('com.tuzi_robot.app');

        // Default open or close DevTools by F12 in development
        // and ignore CommandOrControl + R in production.
        // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
        app.on('browser-window-created', (_, window) => {
            optimizer.watchWindowShortcuts(window);
        });

        // IPC test
        // ipcMain.on('ping', () => console.log('pong'));

        // createWindow();

        app.on('activate', function () {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow();
            }
        });
    });

    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bar to stay active until the user quits
    // explicitly with Cmd + Q.
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    // In this file you can include the rest of your app"s specific main process
    // code. You can also put them in separate files and require them here.
}

function versionsPrint() {
    // electron 版本

    console.log('process.versions.electron', process.versions.electron);

    // ABI版本

    console.log('process.versions.modules', process.versions.modules);

    // NODE版本
    console.log('process.versions.node', process.versions.node);

    // V8 引擎版本
    console.log('process.versions.v8', process.versions.v8);

    // chrome版本
    console.log('process.versions.chrome', process.versions.chrome);

    // 架构信息
    console.log('process.env.PROCESSOR_ARCHITECTURE', process.env.PROCESSOR_ARCHITECTURE);
}
versionsPrint();
