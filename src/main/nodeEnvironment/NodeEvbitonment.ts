import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import { downloadFileWithResume } from '../utils/download';
import { unzip } from '../utils/zipUtils';
import { sleep } from '@shared/Utils';
import UserApp from '../userApp/UserApp';

export class NodeEvbitonment {
    nodePath: string;
    userDataDir: string;
    version: string;
    nodeExeDir: string;
    nodejsUrl: string;
    tempFile?: string;
    constructor() {
        this.version = '18.20.3';
        //https://registry.npmmirror.com/-/binary/node/v18.20.3/node-v18.20.3-win-x64.zip
        this.nodejsUrl = `https://registry.npmmirror.com/-/binary/node/v${this.version}/node-v${this.version}-win-x64.zip`;
        // this.nodejsUrl = `https://nodejs.org/dist/v${this.version}/node-v${this.version}-x64.zip`;
        this.userDataDir = app.getPath('userData');
        this.nodePath = path.join(this.userDataDir, 'nodejs');
        this.nodeExeDir = path.join(this.nodePath, 'node');
    }

    /**
     * 自动安装node环境
     */

    async autoInstallNode() {
        if (this.checkingTheLocalEnvironment()) {
            console.log('本地环境已安装');
            return;
        }
        // 下载node环境并安装
        await this.installNode();
    }

    /**
     * 检测本地环境是否安装
     */
    checkingTheLocalEnvironment() {
        // 检测node环境是否安装
        return fs.existsSync(path.join(this.nodeExeDir, 'node.exe'));
    }

    async installNode() {
        // 下载node环境
        await this.downloadNode();
        await sleep(1000);
        // 解压node环境
        this.unzipNode();

        //重命名目录
        fs.renameSync(path.join(this.nodePath, `node-v${this.version}-win-x64`), this.nodeExeDir);
    }
    async downloadNode() {
        //下载文件
        console.log('开始下载nodejs');
        //创建临时文件
        fs.mkdirSync(path.join(this.userDataDir, 'temp'), { recursive: true });
        this.tempFile = path.join(this.userDataDir, 'temp', 'nodejs.zip');
        await downloadFileWithResume(this.nodejsUrl, this.tempFile, (progress) => {
            console.log(`下载进度：${progress.percentage}%`);
            if (progress.percentage === 100) {
                console.log('下载完成');
            }
        });
    }
    unzipNode() {
        if (!this.tempFile) {
            return;
        }

        // 解压文件
        console.log('开始解压nodejs');
        unzip(this.tempFile, this.nodePath);
    }
}

export default new NodeEvbitonment();
