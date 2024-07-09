import path from 'path';
import { Block, DirectiveInput, LogLevel } from '../types';

export const olog = console.log;
export const sendLog = (level: LogLevel = 'info', message: string, data: Block, error?: Error) => {
    olog(
        `robotUtilLog-` +
            `${encodeURIComponent(JSON.stringify({ level, time: Date.now(), message, data, error }))}`
    );
};

export const sendStepLog = (message: string) => {
    olog(`robotUtilRunStep-` + `${encodeURIComponent(message)}`);
};

export function typeToCode(inputItem: DirectiveInput) {
    if (inputItem.type === 'string') {
        return `String(\`${inputItem.value}\`)`;
    } else if (inputItem.type === 'number') {
        return `Number(String(\`${inputItem.value}\`))`;
    } else if (inputItem.type === 'boolean') {
        return `String(\`${inputItem.value}\`).toLowerCase() == 'true'`;
    }
    return '';
}

/**
 * 获取当前运行的应用信息
 */
export function getCurApp(): { id: string; name: string; version: string } {
    return globalThis.curApp;
}

/**
 * 导入子流程
 * @param appDir 应用目录
 * @param moduleName 模块名
 * @returns
 */
export function flowModuleImport(appDir: string, moduleName: string) {
    const module = path.join(appDir, moduleName);
    // delete require.cache[module];
    return require(module);
}
