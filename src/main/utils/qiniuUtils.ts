import qiniu from 'qiniu';
import { createReadStream, statSync, ReadStream } from 'fs';
import { Request } from '../api/Request';
import path from 'path';

/**
 * 获取七牛云上传凭证
 */
const getQiniuToken = async (keyToOverwrite: string = '') => {
    const res = await Request.post('/user/qiniuToken', { keyToOverwrite });
    return {
        token: res.data.token,
        fileUrl: res.data.fileUrl,
        key: res.data.key
    };
};

/**
 * 上传文件到七牛云
 */
export const uploadFileToQiniu = async (
    filePath: string,
    onProgress?: (percent: number) => void
) => {
    const fileName = path.basename(filePath);
    const { token, key, fileUrl } = await getQiniuToken(fileName);
    const config = new qiniu.conf.Config();
    config.zone = qiniu.zone.Zone_z2;

    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();
    const filePathReadStream: ReadStream = createReadStream(filePath);
    if (onProgress) {
        const fileSize = statSync(filePath);
        let uploadedSize = 0;
        filePathReadStream.on('data', (chunk) => {
            uploadedSize += chunk.length;
            const percent = (uploadedSize / fileSize.size) * 100;
            onProgress(percent);
        });
    }

    return new Promise((resolve, reject) => {
        formUploader.putStream(
            token,
            key,
            filePathReadStream,
            putExtra,
            (respErr, respBody, respInfo) => {
                if (respErr) {
                    reject(respErr);
                } else {
                    if (respInfo.statusCode === 200) {
                        resolve(fileUrl);
                    } else {
                        reject(respBody);
                    }
                }
            }
        );
    });
};
