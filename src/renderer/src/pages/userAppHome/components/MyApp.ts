import type UserApp from 'src/main/userApp/UserApp';

export type UserAppInfo = Readonly<UserApp> & { deleting?: boolean };

/**
 * 分享应用
 * @param appId 应用id
 */
export function sharedApp(appId: UserAppInfo) {
    console.log('sharedApp', appId);
}
