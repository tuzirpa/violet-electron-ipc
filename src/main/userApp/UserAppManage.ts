import fs from 'fs';
import UserApp from './UserApp';
import { dirname } from 'path';
import { uuid } from '@shared/Utils';
import Flow from './Flow';

export class UserAppManage {
    userApps: UserApp[] = [];

    constructor() {
        this.scanLocalApp();
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
        return this.userApps.find((app) => app.id === id);
    }

    getUserApps(): UserApp[] {
        return this.userApps;
    }

    newUserApp(name: string) {
        const id = uuid();
        const userApp = new UserApp(`app_${id}`);
        userApp.name = name;
        userApp.save();
        this.userApps.push(userApp);
        return userApp;
    }
    saveFlow(appId: string, flow: Flow) {
        const userApp = this.getUserApp(appId);
        if (!userApp) {
            throw new Error('用户应用不存在或已删除');
        }
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
