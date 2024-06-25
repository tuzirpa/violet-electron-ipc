import puppeteer, { Browser, Page, PuppeteerLaunchOptions } from 'puppeteer';
import type { Block, LogLevel } from '../types';
import dataProcessing from './dataProcessing';
import web from './webBrowser';

export const sendLog = (level: LogLevel = 'info', message: string, data: Block, error?: Error) => {
    console.log(
        `robotUtilLog`,
        `${JSON.stringify({ level, time: Date.now(), message, data, error })}`
    );
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const robotUtil = {
    sendLog,
    dataProcessing,
    web,
    flowControl: {
        test: async function (operand1: any, operator: string, operand2: any, block: Block) {
            const result = eval(`${operand1}${operator}${operand2}`);
            sendLog(
                'info',
                `if条件判断结果：${operand1} ${operator} ${operand2} = ${result}`,
                block
            );
            return result;
        },
        rangeIterator: async function (start: number, end: number, step: number, block: Block) {
            const result: number[] = [];
            for (let i = start; i <= end; i += step) {
                result.push(i);
            }
            sendLog(
                'info',
                `生成循环数成功: [${start},${end}],步长${step}，结果：${result}`,
                block
            );
            return result;
        }
    }
};

//循环执行指令 给指令套上一层 异常处理
function forRobotUtil(obj: any) {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            if (typeof value === 'function') {
                let retryCountNum = 0;
                obj[key] = async function aaa(...args: any[]) {
                    try {
                        const result = await (value as Function).apply(this, args);
                        return result;
                    } catch (error: any) {
                        const blockInfo = args[args.length - 1] as Block;
                        console.log(error);

                        sendLog(
                            'error',
                            `执行指令 ${blockInfo.directiveDisplayName} 异常: ${error.message}`,
                            blockInfo,
                            error
                        );
                        if (blockInfo.failureStrategy === 'terminate') {
                            sendLog(
                                'error',
                                `执行指令 ${blockInfo.directiveDisplayName} 异常,终止流程`,
                                blockInfo
                            );
                            process.exit(1);
                        } else if (blockInfo.failureStrategy === 'ignore') {
                            sendLog(
                                'error',
                                `执行指令 ${blockInfo.directiveDisplayName} 异常 ,忽略错误`,
                                blockInfo
                            );
                            return null;
                        } else {
                            await sleep(blockInfo.intervalTime * 1000);
                            retryCountNum++;

                            if (retryCountNum > blockInfo.retryCount) {
                                sendLog(
                                    'error',
                                    `执行指令 ${blockInfo.directiveDisplayName} 异常 ,重试次数达到上限`,
                                    blockInfo
                                );
                                process.exit(1);
                            } else {
                                sendLog(
                                    'error',
                                    `执行指令 ${blockInfo.directiveDisplayName} 异常 ,${blockInfo.intervalTime} 秒后重试第${retryCountNum}次`,
                                    blockInfo
                                );
                            }
                            console.log('重试执行指令', this, ...args);
                            return aaa.apply(this, args);
                        }
                    }
                };
            } else {
                forRobotUtil(value);
            }
        }
    }
}

forRobotUtil(robotUtil);

export default robotUtil;
