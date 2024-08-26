import fs from 'fs';
import path from 'path';
import os from 'os';
import AdmZip from 'adm-zip';
import unzipMudulePath from './unzip?modulePath';
import { utilityProcess } from 'electron';

/**
 * 解压.zip文件到目标文件夹
 * @param {string} zipFilePath - 压缩文件的路径
 * @param {string} targetFolder - 目标文件夹路径
 */
export function zip(
    zipFilePath: string,
    targetFolder: string,
    filter?: (filename: string) => boolean
): void {
    // 创建一个新的 AdmZip 实例
    const zip = new AdmZip();

    // 解压缩 ZIP 文件到指定目录
    zip.addLocalFolder(targetFolder, '', (filename) => {
        return filter ? filter(filename) : true;
    });

    zip.writeZip(zipFilePath);
    console.log('ZIP 文件压缩完成。', zipFilePath);
}

/**
 * 解压.zip文件到目标文件夹
 * @param {string} zipFilePath - 压缩文件的路径
 * @param {string} targetFolder - 目标文件夹路径
 */
export function unzip(zipFilePath: string, targetFolder: string) {
    return unzipPromise(zipFilePath, targetFolder);
}

/**
 * 解压.zip文件到目标文件夹
 * @param {string} zipFilePath - 压缩文件的路径
 * @param {string} targetFolder - 目标文件夹路径
 */
export function unzipPromise(zipFilePath: string, targetFolder: string) {
    return new Promise((resolve, reject) => {
        const child = utilityProcess.fork(unzipMudulePath, [zipFilePath, targetFolder], {
            stdio: 'inherit'
        });
        child.on('exit', (code) => {
            console.log(code, 'code');
            if (code === 0) {
                resolve(true);
            } else {
                reject(new Error('解压缩过程中发生错误'));
            }
        });
    });
}

/**
 * 创建一个临时文件并返回其路径
 * @param {string} prefix - 临时文件名的前缀
 * @param {string} suffix - 临时文件名的后缀
 * @returns {string} - 创建的临时文件的路径
 */
export function createTempFile(prefix: string, suffix: string): string {
    // 使用操作系统的临时文件夹路径
    const tempDir = fs.realpathSync(os.tmpdir());
    // 创建一个唯一的临时文件名
    const tempFileName = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}${suffix}`;
    // 拼接临时文件的完整路径
    const tempFilePath = path.join(tempDir, tempFileName);
    // 创建临时文件
    fs.writeFileSync(tempFilePath, '');
    process.addListener('exit', () => {
        // 退出程序时删除临时文件
        fs.unlinkSync(tempFilePath);
    });

    return tempFilePath;
}

/* // 使用示例
const zipFilePath = 'path/to/your/file.zip';
const targetFolder = 'path/to/your/target/folder';
unzip(zipFilePath, targetFolder);
 */
