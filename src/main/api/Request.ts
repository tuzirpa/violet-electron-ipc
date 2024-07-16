import { AppConfig } from '../config/appConfig';
import fetch from 'node-fetch';
import { decrypt } from './aes';

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
        const headers = this.headers || {};
        if (AppConfig.LOGIN_USER && AppConfig.LOGIN_USER.loginToken) {
            headers['token'] = `${AppConfig.LOGIN_USER.loginToken}`;
        }

        let body: any;
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(this.data);
        const res = await fetch(`${AppConfig.API_URL}${this.url}`, {
            method: this.method,
            headers,
            body: body
        });
        const resText = await res.json();
        const enText = decrypt(resText.encrypted);
        const data = JSON.parse(enText);
        if (data.code !== 0) {
            throw new Error(data.message);
        }
        return data;
    }
}
