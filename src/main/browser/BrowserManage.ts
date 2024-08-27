import { app, globalShortcut } from 'electron';
import path, { join } from 'path';
import fs from 'fs';
import puppeteer, { Browser, Page } from 'puppeteer-core';
import { ElementLibrary } from '../userApp/types';
import CaptureWindow from '../window/CaptureWindow';
import { WindowManage } from '../window/WindowManage';

/**
 * 运行中的浏览器
 */
export interface BrowserInfo {
    wsUrl: string;
    appName: string;
    time: string;
    tabCount: number;
    activeTabName: string;
    pages: {
        url: string;
        title: string;
    }[];
}

let captureWindow: CaptureWindow;
export class BrowserManage {
    borwsers: Map<string, Browser> = new Map();
    filePath!: string;
    elementLibraryImagePath: string;
    constructor() {
        this.filePath = join(app.getPath('userData'), 'browser.json');
        this.elementLibraryImagePath = app.getPath('temp');
        fs.writeFileSync(this.filePath, '[]', 'utf-8');
    }

    async getBrowser(wsUrl: string) {
        let browser = this.borwsers.get(wsUrl);
        if (browser) {
            return browser;
        }

        browser = await puppeteer.connect({
            browserWSEndpoint: wsUrl,
            defaultViewport: null
        });
        browser.on('disconnected', () => {
            console.log('浏览器关闭，移除浏览器');
            this.borwsers.delete(wsUrl);
        });
        this.borwsers.set(wsUrl, browser);
        return browser;
    }

    async getBrowsers(): Promise<BrowserInfo[]> {
        const data = fs.readFileSync(this.filePath, 'utf-8');
        if (data) {
            const borwserList = JSON.parse(data);
            for (const b of borwserList) {
                const browser = await this.getBrowser(b.wsUrl);
                const pages = await browser.pages();
                b.tabCount = pages.length;
                // const activePage = await this.getActivePage(browser);
                // b.activeTabName = await activePage.title();
                b.pages = [];
                for (const p of pages) {
                    const url = p.url();
                    const title = await p.title();
                    b.pages.push({ url, title });
                }
            }
            return borwserList;
        }
        return [];
    }

    async getActivePage(browser: Browser, timeout: number = 10000) {
        var start = new Date().getTime();
        while (new Date().getTime() - start < timeout) {
            var pages = await browser.pages();
            var arr: Page[] = [];
            for (const p of pages) {
                if (
                    await p.evaluate(() => {
                        return document.visibilityState == 'visible';
                    })
                ) {
                    arr.push(p);
                }
            }
            if (arr.length >= 1) return arr[0];
        }
        throw 'Unable to get active page';
    }

    async checkElementByWsUrl(wsUrl: string, pageUrl: string, elementInfo: ElementLibrary) {
        return await this.checkElement(wsUrl, pageUrl, elementInfo);
    }

    async getPageByWsUrlAndPageUrl(wsUrl: string, pageUrl: string) {
        const browser = await this.getBrowser(wsUrl);
        const pages = await browser.pages();
        const page = pages.find((page) => {
            return page.url() === pageUrl;
        });
        if (!page) {
            throw new Error('未找到页面,请重新选择后重试');
        }
        return page;
    }

    /**
     * 获取元素
     */
    getElement(wsUrl: string, pageUrl: string) {
        return new Promise<ElementLibrary>(async (resolve, reject) => {
            //添加元素库，检测当前是否启动浏览器，如果有直接用当前启动的浏览器选择元素
            WindowManage.mainWindow.minimize();
            const browser = await this.getBrowser(wsUrl);
            const pages = await browser.pages();
            const page = pages.find((page) => {
                return page.url() === pageUrl;
            });
            if (!page) {
                reject('未找到页面,请重新选择后重试');
                return;
            }
            await page.bringToFront();
            const url = page.url();
            console.log(url);
            const highlightConfig: any = {
                showInfo: true,
                showRulers: false,
                showStyles: true,
                showAccessibilityInfo: true,
                showExtensionLines: false,
                gridHighlightConfig: {
                    rowGapColor: {
                        r: 127,
                        g: 32,
                        b: 210,
                        a: 0.3
                    },
                    rowHatchColor: {
                        r: 127,
                        g: 32,
                        b: 210,
                        a: 0.8
                    },
                    columnGapColor: {
                        r: 127,
                        g: 32,
                        b: 210,
                        a: 0.3
                    },
                    columnHatchColor: {
                        r: 127,
                        g: 32,
                        b: 210,
                        a: 0.8
                    },
                    rowLineColor: {
                        r: 127,
                        g: 32,
                        b: 210
                    },
                    columnLineColor: {
                        r: 127,
                        g: 32,
                        b: 210
                    },
                    rowLineDash: true,
                    columnLineDash: true
                },
                flexContainerHighlightConfig: {
                    containerBorder: {
                        color: {
                            r: 127,
                            g: 32,
                            b: 210
                        },
                        pattern: 'dashed'
                    },
                    itemSeparator: {
                        color: {
                            r: 127,
                            g: 32,
                            b: 210
                        },
                        pattern: 'dotted'
                    },
                    lineSeparator: {
                        color: {
                            r: 127,
                            g: 32,
                            b: 210
                        },
                        pattern: 'dashed'
                    },
                    mainDistributedSpace: {
                        hatchColor: {
                            r: 127,
                            g: 32,
                            b: 210,
                            a: 0.8
                        },
                        fillColor: {
                            r: 127,
                            g: 32,
                            b: 210,
                            a: 0.3
                        }
                    },
                    crossDistributedSpace: {
                        hatchColor: {
                            r: 127,
                            g: 32,
                            b: 210,
                            a: 0.8
                        },
                        fillColor: {
                            r: 127,
                            g: 32,
                            b: 210,
                            a: 0.3
                        }
                    },
                    rowGapSpace: {
                        hatchColor: {
                            r: 127,
                            g: 32,
                            b: 210,
                            a: 0.8
                        },
                        fillColor: {
                            r: 127,
                            g: 32,
                            b: 210,
                            a: 0.3
                        }
                    },
                    columnGapSpace: {
                        hatchColor: {
                            r: 127,
                            g: 32,
                            b: 210,
                            a: 0.8
                        },
                        fillColor: {
                            r: 127,
                            g: 32,
                            b: 210,
                            a: 0.3
                        }
                    }
                },
                flexItemHighlightConfig: {
                    baseSizeBox: {
                        hatchColor: {
                            r: 127,
                            g: 32,
                            b: 210,
                            a: 0.8
                        }
                    },
                    baseSizeBorder: {
                        color: {
                            r: 127,
                            g: 32,
                            b: 210
                        },
                        pattern: 'dotted'
                    },
                    flexibilityArrow: {
                        color: {
                            r: 127,
                            g: 32,
                            b: 210
                        }
                    }
                },
                contrastAlgorithm: 'aa',
                contentColor: {
                    r: 111,
                    g: 168,
                    b: 220,
                    a: 0.66
                },
                paddingColor: {
                    r: 147,
                    g: 196,
                    b: 125,
                    a: 0.55
                },
                borderColor: {
                    r: 255,
                    g: 229,
                    b: 153,
                    a: 0.66
                },
                marginColor: {
                    r: 246,
                    g: 178,
                    b: 107,
                    a: 0.66
                },
                eventTargetColor: {
                    r: 255,
                    g: 196,
                    b: 196,
                    a: 0.66
                },
                shapeColor: {
                    r: 96,
                    g: 82,
                    b: 177,
                    a: 0.8
                },
                shapeMarginColor: {
                    r: 96,
                    g: 82,
                    b: 127,
                    a: 0.6
                }
            };
            await this.pageInjectUtools(page);

            //创建提示窗口
            captureWindow = captureWindow || new CaptureWindow();
            captureWindow.show();
            captureWindow.start();
            const session = await page.createCDPSession();
            await session.send('DOM.enable');
            await session.send('Page.enable');
            await session.send('Overlay.enable');

            session.send('Overlay.setInspectMode', {
                highlightConfig,
                mode: 'searchForNode'
            });
            let count = 0;

            globalShortcut.register('alt+c', () => {
                count++;
                if (count % 2 === 0) {
                    session.send('Overlay.setInspectMode', {
                        highlightConfig,
                        mode: 'searchForNode'
                    });
                } else {
                    session.send('Overlay.setInspectMode', {
                        highlightConfig,
                        mode: 'none'
                    });
                }
            });

            session.on('Overlay.inspectNodeRequested', async (event) => {
                const { backendNodeId } = event;
                console.log(backendNodeId);
                await session.send('Overlay.setInspectMode', {
                    highlightConfig,
                    mode: 'none'
                });
                const object = await session.send('DOM.resolveNode', {
                    backendNodeId
                });
                const res = await session.send('Runtime.callFunctionOn', {
                    functionDeclaration: `function(){return getElementXPath(this)}`,
                    objectId: object.object.objectId
                });
                const resCss = await session.send('Runtime.callFunctionOn', {
                    functionDeclaration: `function(){return getCssSelector(this)}`,
                    objectId: object.object.objectId
                });
                const elementInfo: ElementLibrary = {
                    name: '',
                    id: '',
                    previewPath: '',
                    cssSelector: resCss.result.value,
                    xPath: res.result.value
                };
                // const fileElement = await page.waitForSelector(`::-p-xpath(${elementInfo.xPath})`);
                //body >>> *[@id="following"]
                const fileElement = await page.$(`${elementInfo.cssSelector}`);

                if (fileElement) {
                    elementInfo.previewPath = path.join(
                        this.elementLibraryImagePath,
                        `${Date.now()}_${backendNodeId}.png`
                    );
                    const propertyValue = await fileElement.getProperty('textContent');
                    elementInfo.description = (await propertyValue.jsonValue()) ?? '';
                    elementInfo.name =
                        elementInfo.description.length > 10
                            ? elementInfo.description.substring(0, 10) + '...'
                            : elementInfo.description;
                    await fileElement.screenshot({
                        path: elementInfo.previewPath
                    });
                    fileElement.dispose();
                }
                session.off('Overlay.inspectNodeRequested');
                globalShortcut.unregister('alt+c');
                captureWindow.hide();
                captureWindow.stop();
                // this.checkElementByPage(page, elementInfo);
                WindowManage.mainWindow.restore();
                WindowManage.mainWindow.setAlwaysOnTop(true, 'normal');
                WindowManage.mainWindow.setAlwaysOnTop(false, 'normal');
                resolve(elementInfo);
            });
        });
    }

    async pageInjectUtools(page: Page) {
        /* function injectFun() {
            globalThis.getCssSelector = function getCssSelector(element) {
                if (!(element instanceof Element)) {
                    return null;
                }

                const getElementSelector = (el) => {
                    if (!el) return '';
                    let selector = el.tagName.toLowerCase();
                    if (el.id) {
                        let id = String(el.id);
                        const testRes = /^\d+$/.test(el.id);
                        if (testRes) {
                            id = `\\3${id.substring(0, 1)} ${id.substring(1)}`;
                        }
                        selector += `#${id}`;
                    } else {
                        let classList = Array.from(el.classList);
                        if (classList.length > 0) {
                            selector += `.${classList.join('.')}`;
                        }
                    }
                    if (el.parentElement) {
                        if (el.parentElement instanceof ShadowRoot) {
                            return '';
                        }
                        selector = `${getElementSelector(el.parentElement)} > ${selector}`;
                    }
                    return selector;
                };

                function getElementSelector2(element) {
                    if (element.getRootNode() instanceof ShadowRoot) {
                        return (
                            getElementSelector2(element.getRootNode().host) +
                            ' >>> ' +
                            getElementSelector(element)
                        );
                    } else {
                        return getElementSelector(element);
                    }
                }

                return getElementSelector2(element);
            };

            globalThis.__getElementXPath = function __getElementXPath(element) {
                if (!element) return '';
                if (element.parentNode instanceof ShadowRoot) {
                    return '';
                }

                if (element.id) {
                    return `//*[@id="${element.id}"]`;
                } else if (element.tagName === 'BODY') {
                    return '/html/body';
                } else {
                    const sameTagSiblings = Array.from(element.parentNode.childNodes).filter(
                        (e: any) => e.nodeName === element.nodeName
                    );
                    const idx = sameTagSiblings.indexOf(element);

                    return (
                        __getElementXPath(element.parentNode) +
                        '/' +
                        element.tagName.toLowerCase() +
                        (sameTagSiblings.length > 1 ? `[${idx + 1}]` : '')
                    );
                }
            };

            globalThis.getElementXPath = function getElementByXPath(element) {
                if (element.getRootNode() instanceof ShadowRoot) {
                    return (
                        globalThis.getElementXPath(element.getRootNode().host) +
                        ' >>> ' +
                        globalThis.__getElementXPath(element)
                    );
                } else {
                    return globalThis.__getElementXPath(element);
                }
            };

            globalThis.lookupElementByXPath = function lookupElementByXPath(xpath, parent) {
                let results: any[] = [];
                let query = document.evaluate(
                    xpath,
                    parent || document,
                    null,
                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                    null
                );
                for (let i = 0, length = query.snapshotLength; i < length; ++i) {
                    results.push(query.snapshotItem(i));
                }
                return results;
            };
        } */
        await page.evaluate(
            "function injectFun() {\n            globalThis.getCssSelector = function getCssSelector(element) {\n                if (!(element instanceof Element)) {\n                    return null;\n                }\n\n                const getElementSelector = (el) => {\n                    if (!el) return '';\n                    let selector = el.tagName.toLowerCase();\n                    if (el.id) {\n                        let id = String(el.id);\n                        const testRes = /^\\d+$/.test(el.id);\n                        if (testRes) {\n                            id = `\\\\3${id.substring(0, 1)} ${id.substring(1)}`;\n                        }\n                        selector += `#${id}`;\n                    } else {\n                        let classList = Array.from(el.classList);\n                        if (classList.length > 0) {\n                            selector += `.${classList.join('.')}`;\n                        }\n                    }\n                    if (el.parentElement) {\n                        if (el.parentElement instanceof ShadowRoot) {\n                            return '';\n                        }\n                        selector = `${getElementSelector(el.parentElement)} > ${selector}`;\n                    }\n                    return selector;\n                };\n\n                function getElementSelector2(element) {\n                    if (element.getRootNode() instanceof ShadowRoot) {\n                        return (\n                            getElementSelector2(element.getRootNode().host) +\n                            ' >>> ' +\n                            getElementSelector(element)\n                        );\n                    } else {\n                        return getElementSelector(element);\n                    }\n                }\n\n                return getElementSelector2(element);\n            };\n\n            globalThis.__getElementXPath = function __getElementXPath(element) {\n                if (!element) return '';\n                if (element.parentNode instanceof ShadowRoot) {\n                    return '';\n                }\n\n                if (element.id) {\n                    return `//*[@id=\"${element.id}\"]`;\n                } else if (element.tagName === 'BODY') {\n                    return '/html/body';\n                } else {\n                    const sameTagSiblings = Array.from(element.parentNode.childNodes).filter(\n                        (e) => e.nodeName === element.nodeName\n                    );\n                    const idx = sameTagSiblings.indexOf(element);\n\n                    return (\n                        __getElementXPath(element.parentNode) +\n                        '/' +\n                        element.tagName.toLowerCase() +\n                        (sameTagSiblings.length > 1 ? `[${idx + 1}]` : '')\n                    );\n                }\n            };\n\n            globalThis.getElementXPath = function getElementByXPath(element) {\n                if (element.getRootNode() instanceof ShadowRoot) {\n                    return (\n                        globalThis.getElementXPath(element.getRootNode().host) +\n                        ' >>> ' +\n                        globalThis.__getElementXPath(element)\n                    );\n                } else {\n                    return globalThis.__getElementXPath(element);\n                }\n            };\n\n            globalThis.lookupElementByXPath = function lookupElementByXPath(xpath, parent) {\n                let results = [];\n                let query = document.evaluate(\n                    xpath,\n                    parent || document,\n                    null,\n                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,\n                    null\n                );\n                for (let i = 0, length = query.snapshotLength; i < length; ++i) {\n                    results.push(query.snapshotItem(i));\n                }\n                return results;\n            };\n        };injectFun();",
            []
        );
    }

    async checkElement(wsUrl: string, pageUrl: string, elementLibrary: ElementLibrary) {
        WindowManage.mainWindow.minimize();
        const browser = await this.getBrowser(wsUrl);
        const pages = await browser.pages();
        const page = pages.find((page) => {
            return page.url() === pageUrl;
        });
        if (!page) {
            return;
        }
        await page.bringToFront();
        const count = await this.checkElementByPage(page, elementLibrary);
        WindowManage.mainWindow.restore();
        return count;
    }

    /**
     * 在浏览器中检验页面是否存在某个元素
     */
    async checkElementByPage(page: Page, elementLibrary: ElementLibrary) {
        //选完后 测试路径
        await this.pageInjectUtools(page);

        try {
            let selector =
                elementLibrary.lastVerifyType === 'css'
                    ? elementLibrary.cssSelector
                    : `::-p-xpath(${elementLibrary.xPath})`;
            const elements = await page.$$(selector);
            const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
            elements.forEach((element) => {
                page.evaluate(
                    //@ts-ignore
                    new Function(
                        'element',
                        `
                        async function highlight() {
                                const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
                                const el = element;
                                el.style.border = '1px solid red';
                                await sleep(500);
                                el.style.border = '';
                                await sleep(500);
                                el.style.border = '1px solid red';
                                await sleep(500);
                                el.style.border = '';
                                await sleep(500);
                                el.style.border = '1px solid red';
                                await sleep(500);
                                el.style.border = '';
                        }
                        highlight();
                        `
                    ),
                    element
                );
            });
            await sleep(3000);
            // const count = await page.evaluate(async (xPath) => {
            //     const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            //     const elements = await globalThis.lookupElementByXPath(xPath);
            //     elements.forEach(async (element) => {
            //         element.style.border = '1px solid red';
            //         await sleep(500);
            //         element.style.border = '';
            //         await sleep(500);
            //         element.style.border = '1px solid red';
            //         await sleep(500);
            //         element.style.border = '';
            //         await sleep(500);
            //         element.style.border = '1px solid red';
            //         await sleep(500);
            //         element.style.border = '';
            //     });
            //     await sleep(3000);
            //     return elements.length as number;
            // }, elementLibrary.xPath);
            return elements.length;
        } catch (e) {
            return 0;
        }
    }
}
export const browserManage = new BrowserManage();
