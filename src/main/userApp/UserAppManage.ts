import fs from 'fs';
import UserApp from './UserApp';
import { uuid } from '@shared/Utils';
import Flow from './Flow';

export class UserAppManage {
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

    getUserApp(id: string): UserApp | undefined {
        const userApp = this.findUserApp(id);
        userApp.initFlows();
        return userApp;
    }

    findUserApp(id: string): UserApp {
        const userApp = this.userApps.find((app) => app.id === id);
        if (!userApp) {
            throw new Error('用户应用不存在或已删除');
        }
        return userApp;
    }

    getUserApps(): UserApp[] {
        return this.userApps;
    }

    newUserApp(name: string) {
        const id = uuid();
        const userApp = new UserApp(`app_${Date.now()}_${id}`);
        userApp.name = name;
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
        flowSave.blocks = flow.blocks;
        flowSave.save();
        return flowSave;
    }
}

export default new UserAppManage();
