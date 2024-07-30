import fs from 'fs';
import UserApp, { AppType } from './UserApp';
import { uuid } from '@shared/Utils';
import Flow from './Flow';
import { unzip, zip } from '../utils/zipUtils';
import { join } from 'path';
import { uploadFileToQiniu } from '../utils/qiniuUtils';
import { appPlazaAdd, getDownloadUrl } from '../api/appplaza';
import { downloadFileWithResume } from '../utils/download';
import { WorkStatus } from './WorkStatusConf';

/**
 * 广场的应用
 */
export type AppPlaza = {
    id: string;
    name: string;
    description: string;
    version: string;
    fileUrl: string;
    createdAt: string;
    updatedAt: string;
};

export class UserAppManage {
    deleteSubFlow(appId: string, flowName: string) {
        if (flowName === 'main.flow') {
            throw new Error('不能删除主流程');
        }
        const userApp = this.findUserApp(appId);
        return userApp.deleteSubFlow(flowName);
    }
    saveWorkStatus(appId: string, status: WorkStatus) {
        const userApp = this.findUserApp(appId);
        return userApp.setWorkStatus(status);
    }
    openUserApp(appId: string) {
        const userApp = this.findUserApp(appId);
        return userApp.open();
    }
    /**
     * 导入广场应用到本地
     */
    async appPlazasToLocal(app: AppPlaza) {
        //创建本地应用 并设置成导入的应用
        const userApp = this.newUserApp(app.name);
        // userApp.type = 'into';
        // userApp.intoId = app.id;
        userApp.name = app.name;
        userApp.description = app.description;
        userApp.version = app.version;
        //下载流程文件
        //获取下载地址
        const fileUrl = await getDownloadUrl(app.id);
        console.log(fileUrl, 'fileUrl');

        const zipPath = join(userApp.appDir, `dev.zip`);
        await downloadFileWithResume(fileUrl, zipPath);
        //解压流程文件
        unzip(zipPath, userApp.appDir);
        //删除压缩文件
        fs.unlinkSync(zipPath);
        //保存应用
        userApp.save();
        return userApp;
    }
    async shareUserAppToPlaza(appId: string) {
        const userApp = this.findUserApp(appId);
        if (userApp.type !== 'into') {
            //分享到广场
            /**
             * 1. 创建分享应用文件
             * 2. 添加文件到压缩文件夹
             * 3. 上传文件到服务器
             * 4. 添加应用到应用广场
             * 5. 分享成功返回分享地址
             */
            const zipPath = join(userApp.appDir, `${userApp.id}.zip`);
            zip(zipPath, userApp.appDir, (filename) => {
                if (filename.startsWith('logs')) {
                    return false;
                }
                if (filename.startsWith('main.js')) {
                    return false;
                }
                if (filename.startsWith('package.json')) {
                    return false;
                }
                return true;
            });
            // TODO: 上传文件到服务器
            const fileUrl = await uploadFileToQiniu(zipPath);
            // TODO: 添加应用到应用广场
            const appPlaza = await appPlazaAdd({
                fileUrl,
                appInfo: {
                    name: userApp.name,
                    description: userApp.description,
                    version: userApp.version,
                    id: userApp.id
                }
            });
            console.log(appPlaza);

            return appPlaza;
        } else {
            throw new Error('分享类型错误');
        }
    }
    deleteUserApp(appId: string) {
        const userApp = this.findUserApp(appId);
        this.userApps = this.userApps.filter((app) => app.id !== appId);
        userApp.delete();
        return userApp;
    }

    newSubFlow(appId: string) {
        const userApp = this.findUserApp(appId);
        return userApp.newSubFlow();
    }
    closeUserAppStepTip(appId: string) {
        const userApp = this.findUserApp(appId);
        userApp.closeUserAppStepTip();
    }
    updateUserAppName(appId: string, name: string) {
        const userApp = this.findUserApp(appId);
        userApp.name = name;
        return userApp.save();
    }
    devGetProperties(appId: string, objectId: string) {
        const userApp = this.findUserApp(appId);
        return userApp.devGetProperties(objectId);
    }
    devStop(appId: string) {
        const userApp = this.findUserApp(appId);
        userApp.devStop();
    }
    devResume(appId: string) {
        const userApp = this.findUserApp(appId);
        userApp.devResume();
    }
    devStepOver(appId: string) {
        const userApp = this.findUserApp(appId);
        userApp.devStepOver();
    }
    userAppDevRun(appId: string) {
        const userApp = this.findUserApp(appId);
        userApp.dev();
    }
    userAppRun(appId: string) {
        const userApp = this.findUserApp(appId);
        userApp.run();
    }
    installPackage(appId: string) {
        const userApp = this.findUserApp(appId);
        userApp.npmInstall();
    }

    userApps: UserApp[] = [];

    constructor() {
        // this.scanLocalApp();
    }

    /**
     * 扫描本地应用
     */
    scanLocalApp() {
        //遍历目录 userAppLocalDir
        const files = fs.readdirSync(UserApp.userAppLocalDir);
        //遍历文件
        files.forEach((file) => {
            if (file.startsWith('app_')) {
                this.userApps.push(new UserApp(file));
            }
        });
    }

    async getUserApp(id: string) {
        const userApp = this.findUserApp(id);
        await userApp.initFlows();
        return userApp;
    }

    findUserApp(id: string): UserApp {
        const userApp = this.userApps.find((app) => app.id === id);
        if (!userApp) {
            throw new Error('用户应用不存在或已删除');
        }
        return userApp;
    }

    getUserApps(type: AppType): UserApp[] {
        if (type === 'into') {
            return this.userApps.filter((app) => app.type === type);
        }
        return this.userApps.filter((app) => app.type === type || !app.type);
    }

    newUserApp(name: string) {
        const id = uuid();
        const userApp = new UserApp(`app_${Date.now()}_${id}`);
        userApp.name = name;
        userApp.type = 'myCreate';
        userApp.save();
        this.userApps.push(userApp);
        return userApp;
    }
    saveFlow(appId: string, flow: Flow) {
        const userApp = this.findUserApp(appId);
        const flowSave = userApp.findFlow(flow.name);
        if (!flowSave) {
            throw new Error('流程不存在或已删除');
        }
        flowSave.aliasName = flow.aliasName;
        flowSave.blocks = flow.blocks;
        flowSave.save();
        return flowSave;
    }
    saveFlowAliName(appId: string, flow: Flow) {
        const userApp = this.findUserApp(appId);
        const flowSave = userApp.findFlow(flow.name);
        if (!flowSave) {
            throw new Error('流程不存在或已删除');
        }
        flowSave.aliasName = flow.aliasName;
        flowSave.save();
        return flowSave;
    }
}

export default new UserAppManage();
