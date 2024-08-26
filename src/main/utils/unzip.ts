import AdmZip from 'adm-zip';

const { zipFilePath, targetFolder } = {
    zipFilePath: process.argv[2],
    targetFolder: process.argv[3]
};
function unzip(zipFilePath: string, targetFolder: string): void {
    // 创建一个新的 AdmZip 实例
    const zip = new AdmZip(zipFilePath);
    // 解压缩 ZIP 文件到指定目录
    zip.extractAllTo(targetFolder, /*overwrite*/ true);
}
unzip(zipFilePath, targetFolder);

process.exit(0);
