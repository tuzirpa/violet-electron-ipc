import { Request } from './Request';

export interface IPlatform {
    name: string;
    url: string;
    logo: string;
}

export interface IAppConfig {
    mainPage: {
        platforms: IPlatform[];
    };
}

export class Common {
    constructor() {}

    static async getAppConfig(): Promise<IAppConfig> {
        const config = await Request.post('/common/0/getAppConfig');
        return config.data;
    }
}
