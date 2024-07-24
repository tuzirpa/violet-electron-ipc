export class UserInfo {
    constructor(
        public uid: number,
        public userName: string,
        public mobile: string,
        public avatarUrl: string,
        public vipLevel: number,
        public vipExpireTime: string,
        public isAdmin?: boolean
    ) {}
}
