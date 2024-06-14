import { WebSocket } from 'ws';

export interface IBreakpoint {
    url: string;
    line: number;
    scopeChain?: any[];
}

export class DevNodeJs {
    async getProperties(objectId: string) {
        const data = await this.sendCommand('Runtime.getProperties', {
            objectId,
            ownProperties: false,
            accessorPropertiesOnly: false,
            nonIndexedPropertiesOnly: false,
            generatePreview: true
        });
        return data.result;
    }
    stop() {
        this.ws.close();
    }
    close() {
        this.ws.close();
    }
    resume() {
        this.sendCommand('Debugger.resume', { terminateOnResume: false });
    }
    stepOver() {
        this.sendCommand('Debugger.stepOver', {});
    }

    private ws!: WebSocket;
    private commandId = 1;
    private sctipts = new Map();

    constructor(
        public wsUrl: string,
        public breakpoints: IBreakpoint[] = [],
        public breakpointCallbacks: ((breakpoint: IBreakpoint) => void)[] = []
    ) {}

    async start() {
        const ws = new WebSocket(this.wsUrl);
        this.ws = ws;
        ws.on('open', async () => {
            console.log('WebSocket opened');

            await this.sendCommand('Debugger.enable', {});
            await this.sendCommand('Runtime.enable', {});
            this.setBreakpoint();
        });

        ws.on('message', (data) => {
            // console.log('Received message:', data.toString());
            const cdpRes = JSON.parse(data.toString());

            if (cdpRes.method === 'Debugger.scriptParsed') {
                this.scriptParsed(cdpRes.params);
            } else if (cdpRes.method === 'Debugger.paused') {
                this.paused(cdpRes.params);
            }
        });

        ws.on('close', () => {
            console.log('WebSocket closed');
        });
        // 处理发生错误的事件
        ws.on('error', function error(err) {
            console.error('WebSocket error:', err);
        });
    }

    // 发送调试指令的函数
    sendCommand(method, params): Promise<any> {
        return new Promise((resolve) => {
            const id = this.commandId++;
            const command = JSON.stringify({
                id: id,
                method: method,
                params: params
            });

            console.log('Sending command:', command);
            const listener = (data) => {
                // 解析收到的消息
                const message = JSON.parse(data.toString());
                if (message.id === id) {
                    console.log('Received response:', message);
                    resolve(message);
                    this.ws.off('message', listener);
                }
            };
            this.ws.on('message', listener);

            this.ws.send(command);
        });
    }

    async scriptParsed(params) {
        this.sctipts.set(params.scriptId, params);
        console.log('Script parsed:', params.url);

        // if (params.url.includes('main.flow.js')) {
        //     const res = await this.sendCommand('Debugger.setBreakpoint', {
        //         location: {
        //             scriptId: params.scriptId,
        //             lineNumber: 2
        //         }
        //     });
        //     console.log('Breakpoint set:', res);
        // }
    }
    async paused(params) {
        console.log('断点暂停:', params);
        const callFrames = params.callFrames;
        const callFrame = callFrames[0];
        const location = callFrame.location;
        const scriptId = location.scriptId;
        const lineNumber = location.lineNumber;
        const columnNumber = location.columnNumber;

        //首个断点 自动跳过
        let firstBreakpoint = false;
        const script = this.sctipts.get(scriptId);
        console.log('断点行号:', lineNumber, '列号:', columnNumber);
        if (script.url.includes('main.flow.js')) {
            if (lineNumber === 0) {
                firstBreakpoint = true;
                this.sendCommand('Debugger.resume', {});
            }
        }
        if (firstBreakpoint) {
            return;
        }
        // 获取当前变量
        const scopeChain = callFrame.scopeChain;
        // 触发断点回调
        this.breakpointCallbacks.forEach((callback) => {
            callback({
                scopeChain,
                url: script.url,
                line: lineNumber
            });
        });
    }

    async setBreakpoint() {
        const setBreakpointPromises = this.breakpoints.map((value) => {
            return this.sendCommand('Debugger.setBreakpointByUrl', {
                url: value.url,
                lineNumber: value.line
            });
        });
        await Promise.all(setBreakpointPromises);
    }

    onBreakpoint(borakpointBackCall: (breakpoint: IBreakpoint) => void) {
        this.breakpointCallbacks.push(borakpointBackCall);
    }
}
