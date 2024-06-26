import puppeteer, { Browser, Frame, Page, PuppeteerLaunchOptions } from 'puppeteer';
import { Block } from '../types';
import { sendLog } from './robotUtil.template';

/**
 * 当前页以及所有iframe 获取元素
 * @param selector
 * @param page
 * @returns
 */
async function getElements(selector: string, page: Page): Promise<Element[]> {
    const iframeAll: Frame[] = [];
    function dumpFrameTree(frame: Frame) {
        iframeAll.push(frame);
        for (let child of frame.childFrames()) dumpFrameTree(child);
    }
    dumpFrameTree(page.mainFrame());
    const promises: any[] = [];
    iframeAll.forEach((frame) => {
        const frameSelector = `${frame.name()} ${selector}`;
        promises.push(frame.$(frameSelector));
    });
    let res = await Promise.all(promises).then((results) => {
        return results.filter((element) => element !== null);
    });
    return res;
}

const webBrowser = {
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

    closeBrowser: async function (webBrow: Browser, block: Block) {
        await webBrow.close();
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

    getElementInfo: async function (page: Page, selector: string, timeout: number, block: Block) {
        try {
            await page.waitForSelector(selector, { timeout: timeout * 1000 });
        } catch (error) {
            throw new Error(`超时未找到元素：${selector}`);
        }
        let element = await page.$(selector);
        sendLog('info', `获取元素：${element}`, block);
        return element;
    }
};

export default webBrowser;
