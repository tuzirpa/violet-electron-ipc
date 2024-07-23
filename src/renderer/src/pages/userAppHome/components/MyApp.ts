import { Action } from '@renderer/lib/action';
import type UserApp from 'src/main/userApp/UserApp';

export type UserAppInfo = Readonly<UserApp> & { deleting?: boolean };

/**
 * 发布到应用示例广场
 * @param appId 应用id
 */
export function shareUserAppToPlaza(app: UserAppInfo) {
    console.log('shareUserAppToPlaza', app);
    Action.shareUserAppToPlaza(app.id);
}

/**
 * 分享应用
 * @param appId 应用id
 */
export function sharedApp(app: UserAppInfo) {
    console.log('分享', app);
}
