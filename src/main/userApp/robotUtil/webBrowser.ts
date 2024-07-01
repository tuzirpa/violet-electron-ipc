import child_process from 'child_process';
import puppeteer, { Browser, ElementHandle, Page, PuppeteerLaunchOptions } from 'puppeteer';
import { Block } from '../types';
import { sendLog } from './log';

function regQueryExeCutablePath(regPath: string) {
    return new Promise<string>((resolve, reject) => {
        child_process.exec(`REG QUERY "${regPath}"`, function (error, stdout, _stderr) {
            if (error != null) {
                reject(error);
                return;
            }
            const exePath = stdout.substring(stdout.indexOf('REG_SZ') + 6, stdout.indexOf(','));
            const ep = exePath.trim().replace(/\\/g, '/');
            resolve(ep);
        });
    });
}

export async function getExeCutablePath(type: string) {
    //读取注册表获取浏览器路径
    let path = '';
    switch (type) {
        case 'chrome':
            //读取windows注册表 HKEY_LOCAL_MACHINE\SOFTWARE\Clients\StartMenuInternet\Google Chrome\DefaultIcon
            path = await regQueryExeCutablePath(
                'HKEY_LOCAL_MACHINE\\SOFTWARE\\Clients\\StartMenuInternet\\Google Chrome\\DefaultIcon'
            );
            break;
        case 'edge':
            //HKEY_LOCAL_MACHINE\SOFTWARE\Clients\StartMenuInternet\Microsoft Edge\DefaultIcon
            path = await regQueryExeCutablePath(
                'HKEY_LOCAL_MACHINE\\SOFTWARE\\Clients\\StartMenuInternet\\Microsoft Edge\\DefaultIcon'
            );
            break;
        default:
            break;
    }
    return path;
}

/**
 * 当前页以及所有iframe 获取元素
 * @param selector
 * @param page
 * @returns
 */
// async function getElements(selector: string, page: Page): Promise<Element[]> {
//     const iframeAll: Frame[] = [];
//     function dumpFrameTree(frame: Frame) {
//         iframeAll.push(frame);
//         for (let child of frame.childFrames()) dumpFrameTree(child);
//     }
//     dumpFrameTree(page.mainFrame());
//     const promises: any[] = [];
//     iframeAll.forEach((frame) => {
//         promises.push(frame.$(selector));
//     });
//     let res = await Promise.all(promises).then((results) => {
//         return results.filter((element) => element !== null);
//     });
//     return res;
// }

const webBrowser = {
    create2: async function (
        params: { webType: string; url: string; loadTimeout: number },
        _block: Block
    ) {
        const { webType: type, url: webUrl, loadTimeout } = params;
        let executablePath = '';
        if (type !== 'tuziChrome') {
            executablePath = await getExeCutablePath(type);
            // if (executablePath === '') {
            //     sendLog('error', `本地未安装 ${displayName}，请设置先安装 ${displayName}`, block);
            //     throw new Error('未设置chrome路径');
            // }
        }
        const ops: PuppeteerLaunchOptions = { headless: false, defaultViewport: null };
        executablePath && (ops.executablePath = executablePath);
        const browser = await puppeteer.launch(ops);
        const pages = await browser.pages();
        const page = pages[0];
        await page.goto(webUrl, { timeout: loadTimeout * 1000 });
        return { browser, page };
    },

    openBrowser: async function (
        type: string,
        executablePath: string,
        webUrl: string,
        displayName: string,
        block: Block
    ) {
        if (type !== 'tuziChrome') {
            if (executablePath === '') {
                sendLog('error', `本地未安装 ${displayName}，请设置先安装 ${displayName}`, block);
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
    },

    closeBrowser: async function ({ closeBrowser }: { closeBrowser: Browser }, block: Block) {
        await closeBrowser.close();
        sendLog('info', `关闭浏览器，成功`, block);
    },

    closeBrowserPage: async function (flag: string, webBrow: Browser, page: Page, block: Block) {
        if (flag === 'closePage') {
            page.close();
            sendLog('info', `网页关闭，成功`, block);
        } else {
            webBrow.close();
            sendLog('info', `关闭浏览器，成功`, block);
        }
    },

    getElementInfoByXpath: async function (
        page: Page,
        selector: string,
        timeout: number,
        block: Block
    ) {
        try {
            await page.waitForSelector(`::-p-xpath(${selector})`, { timeout: timeout * 1000 });
        } catch (error) {
            throw new Error(`超时${timeout}秒，未找到元素：${selector}`);
        }

        let element = await page.$(`::-p-xpath(${selector})`);
        sendLog('info', `xpath方式获取元素：${element}`, block);
        return element;
    },

    getElementInfoBySelector: async function (
        page: Page,
        selector: string,
        timeout: number,
        block: Block
    ) {
        try {
            await page.waitForSelector(selector, { timeout: timeout * 1000 });
        } catch (error) {
            throw new Error(`超时${timeout}秒，未找到元素：${selector}`);
        }
        let element = await page.$(selector);
        sendLog('info', `css方式获取元素：${element}`, block);
        return element;
    },

    getElementTextByCss: async function (
        page: Page,
        selector: string,
        timeout: number,
        block: Block
    ) {
        try {
            await page.waitForSelector(selector, { timeout: timeout * 1000 });
        } catch (error) {
            throw new Error(`超时${timeout}秒，未找到元素：${selector}`);
        }
        const text = await page.$eval(selector, (e) => e.textContent);
        sendLog('info', `获取元素文本：${text}`, block);
        return text;
    },

    getElementTextByXpath: async function (
        page: Page,
        selector: string,
        timeout: number,
        block: Block
    ) {
        try {
            await page.waitForSelector(`::-p-xpath(${selector})`, { timeout: timeout * 1000 });
        } catch (error) {
            throw new Error(`超时${timeout}秒，未找到元素：${selector}`);
        }

        let element = await page.$(`::-p-xpath(${selector})`);
        if (element) {
            // 获取元素的文本内容
            const textContent = await element.getProperty('textContent');
            const text = await textContent.jsonValue();
            sendLog('info', `xpath方式获取元素：${text}`, block);
            return text;
        }
        return null;
    },

    clickElement: async function (element: ElementHandle, block: Block) {
        element.click();
        sendLog('info', `点击元素：${element}`, block);
    },

    setCookies: async function (page: Page, cookies: string, domain: string, block: Block) {
        cookies.split(';').forEach((item) => {
            const [key, value] = item.split('=');
            if (key && value) {
                if (domain) {
                    page.setCookie({ name: key.trim(), value: value.trim(), domain: domain });
                } else {
                    page.setCookie({ name: key.trim(), value: value.trim() });
                }
            }
        });

        sendLog('info', `设置cookie：${cookies}`, block);
    },

    refreshPage: async function (page: Page, block: Block) {
        page.reload();
        sendLog('info', `刷新页面`, block);
    }
};

export default webBrowser;
