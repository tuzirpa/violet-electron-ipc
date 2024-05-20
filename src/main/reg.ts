import { machineId } from 'node-machine-id';
import crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { app } from 'electron';

const regFilePath = path.join(app.getPath('userData'), 'regCode');

// const md5KeyString = 'com.wchat';
// const arrCharCode = [];
// for (let index = 0; index < md5KeyString.length; index++) {
//     const element = md5KeyString.charCodeAt(index);
//     arrCharCode.push(element);
// }

const md5Key = String.fromCharCode(...[99, 111, 109, 46, 119, 99, 104, 97, 116]);

function md5(data: crypto.BinaryLike) {
    // 以md5的格式创建一个哈希值
    const hash = crypto.createHash('md5');
    return hash.update(data).digest('hex');
}

export function getRegStatus() {
    if (fs.existsSync(regFilePath)) {
        const token = fs.readFileSync(regFilePath, 'utf8');
        return verifyToken(token);
    }
    throw Error('未注册');
}

export async function getMachineCode() {
    const machineIdString = await machineId(true);
    const machineCode = md5(machineIdString);
    return machineCode;
}

/**
 *
 * @param token 注册码
 * @returns
 */
export function verifyToken(token: string) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, md5Key, async (error, result) => {
            if (error) {
                reject(error);
            } else {
                if (!result) {
                    reject(new Error('注册码无效'));
                    return;
                }
                result = result as jwt.JwtPayload;
                const maCode = await getMachineCode();
                if (result.machineCode !== maCode) {
                    reject(new Error('注册码无效'));
                    return;
                }
                //注册成功，生成注册文件
                fs.writeFileSync(regFilePath, token, 'utf8');
                resolve(result);
            }
        });
    });
}
