import puppeteer from 'puppeteer';

export const robotUtil = {
    openBrowser: function () {
        console.log('openBrowser985981598');
        return puppeteer.launch({ headless: false });
    }
};

export default robotUtil;
