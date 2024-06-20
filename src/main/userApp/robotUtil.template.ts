import puppeteer, { Browser, PuppeteerLaunchOptions } from 'puppeteer';
import type { Block, LogLevel } from './types';

export const sendLog = (level: LogLevel = 'info', message: string, data: Block, error?: Error) => {
    console.log(
        `robotUtilLog`,
        `${JSON.stringify({ level, time: Date.now(), message, data, error })}`
    );
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const robotUtil = {
    dataProcessing: {
        async log(content: string, block: Block) {
            sendLog('info', content, block);
        },

        async setVariable(type: string, value: any, block: Block) {
            //{"type":"number","value":"123213sdfa${ffd}adsfa"}
            if (type === 'number') {
                return Number(value);
            }
            return value;
        }
    },
    web: {
        openBrowser: async function (
            type: string,
            executablePath: string,
            webUrl: string,
            displayName: string,
            block: Block
        ) {
            if (type !== 'tuziChrome') {
                if (executablePath === '') {
                    sendLog(
                        'error',
                        `本地未安装 ${displayName}，请设置先安装 ${displayName}`,
                        block
                    );
                    throw new Error('未设置chrome路径');
                }
            }
            const ops: PuppeteerLaunchOptions = { headless: false, defaultViewport: null };
            executablePath && (ops.executablePath = executablePath);
            const browser = await puppeteer.launch(ops);
            const pages = await browser.pages();
            const page = pages[0];
            await page.goto(webUrl);
            return browser;
        },
        openBrowserPage: async function (webBrow: Browser, url: string, block: Block) {
            // const aaa = await puppeteer.launch(ops);
            const page = await webBrow.newPage();
            await page.goto(url);
            sendLog('info', `打开网页：${url}，成功`, block);
            return page;
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
                            `执行指令 ${blockInfo.directiveDisplayName} 异常`,
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
                            return '';
                        } else {
                            sendLog(
                                'error',
                                `执行指令 ${blockInfo.directiveDisplayName} 异常 ,${blockInfo.intervalTime} 秒后重试第${retryCountNum}次`,
                                blockInfo
                            );
                            await sleep(blockInfo.intervalTime * 1000);
                            retryCountNum++;
                            if (retryCountNum > blockInfo.retryCount) {
                                sendLog(
                                    'error',
                                    `执行指令 ${blockInfo.directiveDisplayName} 异常 ,重试次数达到上限`,
                                    blockInfo
                                );
                                process.exit(1);
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
