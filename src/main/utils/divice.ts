import { exec } from 'child_process';
import * as fs from 'fs';
import { md5 } from './md5';

/**
 * 读取 CPU 序列号
 */
export function getCPUSerialNumber(): Promise<string | null> {
    return new Promise((resolve, _reject) => {
        // 在 Windows 上使用 wmic 命令获取 CPU 序列号
        if (process.platform === 'win32') {
            exec('wmic cpu get ProcessorId', (err, stdout, _stderr) => {
                if (err) {
                    console.error('Error running command:', err);
                    resolve(null);
                    return;
                }
                const serialNumber = stdout.trim().split('\n')[1];
                resolve(serialNumber);
            });
        }
        // 在 Linux 上读取 /proc/cpuinfo 文件获取 CPU 信息
        else if (process.platform === 'linux') {
            fs.readFile('/proc/cpuinfo', 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading file:', err);
                    resolve(null);
                    return;
                }
                const serialNumberMatch = data.match(/serial\s*:\s*(.*)/i);
                const serialNumber = serialNumberMatch ? serialNumberMatch[1] : null;
                resolve(serialNumber);
            });
        }
        // 在 macOS 上使用 system_profiler 命令获取 CPU 序列号
        else if (process.platform === 'darwin') {
            exec(
                'system_profiler SPHardwareDataType | grep "Serial Number (system)"',
                (err, stdout, _stderr) => {
                    if (err) {
                        console.error('Error running command:', err);
                        resolve(null);
                        return;
                    }
                    const serialNumber = stdout.trim().split(':')[1]?.trim();
                    resolve(serialNumber);
                }
            );
        }
        // 不支持的操作系统平台
        else {
            console.error('Unsupported platform:', process.platform);
            resolve(null);
        }
    });
}

/**
 * 获取 MAC 地址
 */
export function getMacAddress(): Promise<string> {
    return new Promise((resolve, reject) => {
        // Windows 使用 ipconfig 命令获取 MAC 地址
        if (process.platform === 'win32') {
            exec('ipconfig /all', (err, stdout, _stderr) => {
                if (err) {
                    console.error('Error running command:', err);
                    reject(err);
                    return;
                }
                const macAddressMatch = stdout.match(/Physical Address[.\s:]*([0-9A-Fa-f\-:]{17})/);
                const macAddress = macAddressMatch ? macAddressMatch[1] : null;
                if (macAddress) {
                    resolve(macAddress.replace(/-/g, ':'));
                } else {
                    reject(new Error('Unable to find MAC address on Windows.'));
                }
            });
        }
        // Linux 使用 ifconfig 命令获取 MAC 地址
        else if (process.platform === 'linux') {
            exec('ifconfig -a', (err, stdout, _stderr) => {
                if (err) {
                    console.error('Error running command:', err);
                    reject(err);
                    return;
                }
                const macAddressMatch = stdout.match(/(?:HWaddr|ether)\s+([0-9A-Fa-f\-:]{17})/);
                const macAddress = macAddressMatch ? macAddressMatch[1] : null;
                if (macAddress) {
                    resolve(macAddress.replace(/-/g, ':'));
                } else {
                    reject(new Error('Unable to find MAC address on Linux.'));
                }
            });
        }
        // macOS 使用 ifconfig 命令获取 MAC 地址
        else if (process.platform === 'darwin') {
            exec('ifconfig', (err, stdout, _stderr) => {
                if (err) {
                    console.error('Error running command:', err);
                    reject(err);
                    return;
                }
                const macAddressMatch = stdout.match(/(?:ether)\s+([0-9A-Fa-f\-:]{17})/);
                const macAddress = macAddressMatch ? macAddressMatch[1] : null;
                if (macAddress) {
                    resolve(macAddress.replace(/-/g, ':'));
                } else {
                    reject(new Error('Unable to find MAC address on macOS.'));
                }
            });
        }
        // 不支持的操作系统平台
        else {
            const errMessage = 'Unsupported platform: ' + process.platform;
            console.error(errMessage);
            reject(new Error(errMessage));
        }
    });
}

/**
 * 获取设备唯一标识符
 */
export async function getDeviceID() {
    let deviceId = '';
    const cpuSerialNumber = await getCPUSerialNumber();
    if (cpuSerialNumber) {
        deviceId = md5(cpuSerialNumber);
        return deviceId;
    }
    const macAddress = await getMacAddress();
    if (macAddress) {
        deviceId = md5(macAddress);
        return deviceId;
    }
    throw new Error('Unable to generate device ID.');
}
