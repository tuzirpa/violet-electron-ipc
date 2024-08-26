import crypto from 'crypto';
import { md5 } from '../utils/md5';

// AES加密密钥
const secretKey = '12345678901234567890123456789012';
// 初始化向量（IV），长度必须为16字节
const iv = Buffer.from('1234567890123456', 'utf8');

// AES加密函数
export function encrypt(text: string, password: string = secretKey) {
    password = password === secretKey ? password : md5(password);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(password), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// AES解密函数
export function decrypt(encryptedText: string, password: string = secretKey) {
    password = password === secretKey ? password : md5(password);
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(password), iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

export default {
    encrypt,
    decrypt
};
