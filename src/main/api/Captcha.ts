import { Request } from './Request';

export class Captcha {
    constructor() {}

    async getCaptcha() {
        const data = await Request.post('/captcha/0/generate', {});
        return await data.data;
    }
}

export default new Captcha();
