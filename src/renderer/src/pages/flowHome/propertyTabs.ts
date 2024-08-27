import { Action } from '@renderer/lib/action';
import { ElMessage } from 'element-plus';
import type { BrowserInfo } from 'src/main/browser/BrowserManage';
import { ElementLibrary } from 'src/main/userApp/types';
import { ref } from 'vue';
import { curUserApp } from './indexvue';

export const propertyTabList = ref([
    { name: 'flow', label: '流程' },
    { name: 'elementLibrary', label: '元素库' }
]);

export const propertyTabsActiveName = ref('flow');

export const selectBrowserPopup = ref<{
    browsers: BrowserInfo[];
    show: boolean;
    callback: (wsUrl: string, pageUrl: string) => void;
}>({
    browsers: [] as BrowserInfo[],
    show: false,
    callback: () => {}
});

export const addElementLibraryPopup = ref<{
    show: boolean;
    elementInfo: ElementLibrary;
    callback: (elementInfo: ElementLibrary) => void;
}>({
    show: false,
    elementInfo: {} as ElementLibrary,
    callback: () => {}
});

export const curSelectPage = {
    wsUrl: '',
    pageUrl: ''
};

export function selectWsUrlPopup(browsers: BrowserInfo[]) {
    return new Promise<[string, string]>((resolve) => {
        selectBrowserPopup.value.browsers = browsers;
        selectBrowserPopup.value.show = true;
        selectBrowserPopup.value.callback = (wsUrl, pageUrl) => {
            resolve([wsUrl, pageUrl]);
            selectBrowserPopup.value.show = false;
        };
    });
}

/**
 * 元素库编辑确认
 * @param elementInfo 元素信息
 * @returns
 */
export function elementLibraryEditConfirm(elementInfo: ElementLibrary) {
    return new Promise<ElementLibrary>((resolve) => {
        addElementLibraryPopup.value.show = true;
        addElementLibraryPopup.value.elementInfo = elementInfo;
        addElementLibraryPopup.value.callback = async () => {
            if (!elementInfo.id) {
                const eleInfo = await Action.addElementLibrary(curUserApp.value.id, elementInfo);
                resolve(eleInfo);
            } else {
                console.log('编辑元素库', elementInfo);

                // const eleInfo = await Action.updateElementLibrary(curUserApp.value.id, elementInfo);
                resolve(elementInfo);
            }

            addElementLibraryPopup.value.show = false;
        };
    });
}

/**
 * 去浏览器检查元素
 * @param elementInfo 元素信息
 * @returns
 */
export async function checkElement(elementInfo: ElementLibrary, type: 'css' | 'xpath' = 'xpath') {
    elementInfo.lastVerifyType = type;
    if (curSelectPage.wsUrl === '' || curSelectPage.pageUrl === '') {
        const result = await Action.getBrowsers();
        console.log(result, 'getBrowsers');
        if (result.length === 0) {
            ElMessage.warning('请先运行流程启动浏览器');
            return;
        }
        const pages = result.map((item) => item.pages).flat();
        console.log(pages, 'pages');

        let wsUrl: string, pageUrl: string;
        if (pages.length === 1) {
            wsUrl = result[0].wsUrl;
            pageUrl = pages[0].url;
        } else {
            //多个弹出选择
            [wsUrl, pageUrl] = await selectWsUrlPopup(result);
        }

        const count = await Action.checkElementByWsUrl(wsUrl, pageUrl, elementInfo);
        ElMessage.success(`存在${count}个${elementInfo.name}元素`);
    } else {
        const count = await Action.checkElementByWsUrl(
            curSelectPage.wsUrl,
            curSelectPage.pageUrl,
            elementInfo
        );
        ElMessage.success(`存在${count}个${elementInfo.name}元素`);
    }
}

/**
 * 重新捕获元素
 */
export async function recapture() {
    await getSelectPage();
    addElementLibraryPopup.value.show = false;
    const elementInfo = await Action.getElementByWsUrl(curSelectPage.wsUrl, curSelectPage.pageUrl);
    const confirmResult = await elementLibraryEditConfirm(elementInfo);
    console.log('重新捕获', confirmResult);
    curUserApp.value.elementLibrarys.unshift(confirmResult);
}

async function getSelectPage() {
    const result = await Action.getBrowsers();
    console.log(result, 'getBrowsers');
    if (result.length === 0) {
        ElMessage.warning('请先运行流程启动浏览器');
        throw new Error('请先运行流程启动浏览器');
    }
    const pages = result.map((item) => item.pages).flat();
    console.log(pages, 'pages');

    let wsUrl: string, pageUrl: string;
    if (pages.length === 1) {
        wsUrl = result[0].wsUrl;
        pageUrl = pages[0].url;
    } else {
        //多个弹出选择
        [wsUrl, pageUrl] = await selectWsUrlPopup(result);
    }
    curSelectPage.wsUrl = wsUrl;
    curSelectPage.pageUrl = pageUrl;
}

export async function addElementLibrary() {
    await getSelectPage();
    const elementInfo = await Action.getElementByWsUrl(curSelectPage.wsUrl, curSelectPage.pageUrl);
    const confirmResult = await elementLibraryEditConfirm(elementInfo);
    console.log(confirmResult, 'confirmResult');
    curUserApp.value.elementLibrarys.unshift(confirmResult);
}

/**
 * 保存元素库信息
 * @param elementInfo 元素信息
 */
export async function saveElementLibraryInfo() {
    console.log('saveElementLibraryInfo');
    await Action.saveElementLibraryInfo(
        curUserApp.value.id,
        addElementLibraryPopup.value.elementInfo
    );
    ElMessage.success('修改成功');
    curUserApp.value.elementLibrarys = curUserApp.value.elementLibrarys.map((item) => {
        if (item.id === addElementLibraryPopup.value.elementInfo.id) {
            return addElementLibraryPopup.value.elementInfo;
        }
        return item;
    });
    addElementLibraryPopup.value.show = false;
}

/**
 * 保存元素库信息
 * @param elementInfo 元素信息
 */
export async function deleteElementLibraryInfo() {
    console.log('saveElementLibraryInfo');
    await Action.deleteElementLibraryInfo(
        curUserApp.value.id,
        addElementLibraryPopup.value.elementInfo
    );
    curUserApp.value.elementLibrarys = curUserApp.value.elementLibrarys.filter(
        (item) => item.id !== addElementLibraryPopup.value.elementInfo.id
    );
    ElMessage.success('删除成功');
    addElementLibraryPopup.value.show = false;
}
