import { app } from 'electron';
import { join } from 'path';
import UserApp from '../userApp/UserApp';
import { unzip, zip } from '../utils/zipUtils';
import { getQiniuToken, uploadFileToQiniu } from '../utils/qiniuUtils';
import fs from 'fs';
import {
    addSystemDirectivePackage,
    getAllVersions,
    getDirectivePackageDownloadUrl,
    SystemDirectiveVersion
} from '../api/systemDirective';
import { downloadFileWithResume } from '../utils/download';
import { WindowManage } from '../window/WindowManage';

export class SystemDirectivePackageManage {
    versions: SystemDirectiveVersion[] = [];

    /**
     * 使用指定版本的系统指令包
     * @param version 系统指令包版本
     */
    async useVersionSystemDirective(version: string) {
        const versionInfo = this.versions.find((v) => v.version === version);
        if (!versionInfo) {
            throw new Error(`不存在版本${version}`);
        }
        if (!this.hasVersion(version)) {
            //不存在去下载
            const downloadUrl = await getDirectivePackageDownloadUrl(versionInfo.id);
            const zipPath = this.getZipFilePath(version);
            fs.mkdirSync(this.downloadDir, { recursive: true });
            await downloadFileWithResume(downloadUrl, zipPath, (process) => {
                WindowManage.mainWindow.webContents.send(
                    'system-directive-download-progress',
                    process
                );
            });
        }
        //解压并覆盖当前系统指令包
        unzip(this.getZipFilePath(version), join(UserApp.userAppLocalDir, `system`));
    }

    /**
     * 获取所有系统指令包版本
     */
    async getAllVersions() {
        this.versions = await getAllVersions();
        this.versions.forEach((version) => {
            version.localHas = this.hasVersion(version.version);
        });
        return this.versions;
    }
    /**
     * @param downloadDir 系统下载指令目录
     */
    constructor(public downloadDir: string = '') {
        this.downloadDir = downloadDir || app.getPath('userData') + '/systemDirective';
    }

    /**
     * 判断下载目录是否存在当前版本
     */
    hasVersion(version: string) {
        return fs.existsSync(this.getZipFilePath(version));
    }

    getZipFilePath(version: string) {
        return join(this.downloadDir, this.getZipFileName(version));
    }

    getZipFileName(version: string) {
        return `SystemDirective_${version}.zip`;
    }

    /**
     * 上传系统指令包
     */
    async uploadSystemDirectivePackage(version: string, description: string) {
        const qiniuToken = await getQiniuToken(this.getZipFileName(version));
        const fileName = qiniuToken.fileName;
        await addSystemDirectivePackage({ diretivePackageVersion: version, fileName, description });
        const zipPath = join(this.downloadDir, fileName);
        zip(zipPath, join(UserApp.userAppLocalDir, `system`));
        // TODO: 上传文件到服务器
        await uploadFileToQiniu(zipPath, qiniuToken);
        if (!fileName) {
            throw new Error('上传指令包失败');
        }
        //删除压缩文件
        fs.unlinkSync(zipPath);
    }
}

let systemDirectivePackageManage: SystemDirectivePackageManage = new SystemDirectivePackageManage();

export default systemDirectivePackageManage;
