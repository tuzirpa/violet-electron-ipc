import { AppConfig } from '../config/appConfig';
import fetch, { Response } from 'node-fetch';
import { decrypt, encrypt } from './aes';
import { WindowManage } from '../window/WindowManage';
import { app } from 'electron';
import { uuid } from '@shared/Utils';

export class Request {
    constructor(
        public url: string,
        public method: string,
        public headers: any,
        public data: any
    ) {}

    static create(url: string, method: string, headers: any, data: any) {
        return new Request(url, method, headers, data);
    }

    static get(url: string, headers?: any) {
        const req = new Request(url, 'GET', headers, {});
        return req.send();
    }

    static put(url: string, headers?: any) {
        const req = new Request(url, 'PUT', headers, {});
        return req.send();
    }

    static post(url: string, data?: any, headers?: any) {
        const req = new Request(url, 'POST', headers, data ?? {});
        return req.send();
    }

    async send() {
        if (AppConfig.LOGIN_USER?.offline) {
            throw new Error('当前处于离线模式，无法发送请求');
        }
        const headers = this.headers || {};
        if (AppConfig.LOGIN_USER && AppConfig.LOGIN_USER.loginToken) {
            headers['token'] = `${AppConfig.LOGIN_USER.loginToken}`;
        }

        let body: any;
        headers['Content-Type'] = 'application/json';
        this.data = this.data || {};
        this.data.version = app.getVersion();
        this.data.nonce = uuid();
        body = JSON.stringify(this.data);
        let res: Response;
        const encrypted = encrypt(body);
        body = JSON.stringify({ encrypted });
        try {
            res = await fetch(`${AppConfig.API_URL}${this.url}`, {
                method: this.method,
                headers,
                body: body
            });
        } catch (error) {
            throw new Error('服务器错误');
        }
        const resText = await res.json();
        const enText = decrypt(resText.encrypted);
        const data = JSON.parse(enText);
        if (data.code !== 0) {
            if (!AppConfig.LOGIN_USER?.offline) {
                if (data.code === 901) {
                    // token失效
                    AppConfig.LOGIN_USER = null;
                    AppConfig.clearLoginInfo();
                    WindowManage.mainWindow.webContents.send('login-out');
                }
            }

            throw new Error(data.message);
        }
        return data;
    }
}
