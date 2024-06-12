import { WebSocket } from 'ws';

interface IBreakpoint {
    url: string;
    line: number;
}

export class DevNodeJs {
    private ws!: WebSocket;
    private commandId = 1;

    private sctipts = new Map();

    breakpointBackCall: (url: string, line: number) => void = () => {};

    constructor(
        public wsUrl: string,
        public breakpoints: IBreakpoint[] = []
    ) {
        this.start();
    }

    async start() {
        const ws = new WebSocket(this.wsUrl);
        this.ws = ws;
        ws.on('open', async () => {
            console.log('WebSocket opened');

            await this.sendCommand('Debugger.enable', {});
            await this.sendCommand('Runtime.enable', {});
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
    sendCommand(method, params) {
        return new Promise((resolve, reject) => {
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
        // if (params.url.includes('main.flow.js')) {
        //     const res = await this.sendCommand('Debugger.setBreakpoint', {
        //         location: {
        //             scriptId: params.scriptId,
        //             lineNumber: 2
        //         }
        //     });
        //     console.log('Breakpoint set:', res);
        // }
        this.breakpoints.forEach((value) => {
            this.sendCommand('Debugger.setBreakpoint', {
                url: value.url,
                lineNumber: value.line,
                columnNumber: 0
            });
        });
    }
    async paused(params) {
        console.log('断点暂停:', params);
        const callFrames = params.callFrames;
        const callFrame = callFrames[0];
        const location = callFrame.location;
        const scriptId = location.scriptId;
        const lineNumber = location.lineNumber;
        const columnNumber = location.columnNumber;

        const script = this.sctipts.get(scriptId);
        if (script.url.includes('main.flow.js')) {
            if (lineNumber === 0) {
                this.sendCommand('Debugger.resume', {});
            }
        }
        console.log('断点行号:', lineNumber, '列号:', columnNumber);
        this.onBreakpoint(script.url, lineNumber);
        // 这里可以根据需要进行自定义的操作
    }

    onBreakpoint(url: string, line: number) {
        this.breakpoints.push({ url, line });
    }
}
