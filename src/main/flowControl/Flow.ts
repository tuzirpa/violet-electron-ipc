import vm from 'vm';

export class Flow {
    /**
     * 构建一个v8引擎
     */

    context: any = {};

    constructor() {
        vm.createContext(this.context);
    }

    start() {
        console.log('Flow start');
    }

    exeCode(code: string) {
        console.log('Flow exeCode', code);
        try {
            const result = vm.runInContext(code, this.context);
            return { res: 'ok', data: result };
        } catch (error: any) {
            return { res: 'error', data: error.stack };
        }
    }

    pause() {
        console.log('Flow pause');
    }

    resume() {
        console.log('Flow resume');
    }

    stop() {
        console.log('Flow stop');
    }
}
