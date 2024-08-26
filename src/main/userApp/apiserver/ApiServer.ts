import { uuid } from '@shared/Utils';
import { dialog, ipcMain } from 'electron';
import http from 'http';
import { PromptWindow } from '../../window/PromptWindow';
import WebSocket from 'ws';

export class ApiServer {
    private httpServer: http.Server;

    constructor(public port: number) {
        this.httpServer = http.createServer();

        // 创建一个 WebSocket 服务器实例，将其绑定到 HTTP 服务器上
        const wss: WebSocket.Server = new WebSocket.Server({ server: this.httpServer });

        // 监听 WebSocket 连接事件
        wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
            console.log('客户端已连接 连接参数：', req.url);
            // 监听客户端发送过来的消息
            ws.on('message', (message: string) => {
                console.log('收到消息: %s', message);
                const data = JSON.parse(message);
                const { id, params, method } = data;

                console.log('请求方法：', { id, params, method });
                this.invokeMethod(ws, { id, params, method });
                // 原样返回收到的消息
                // ws.send(`收到消息：${message}`);
            });

            // 监听断开连接事件
            ws.on('close', function close() {
                console.log('客户端已断开连接');
            });
        });
    }

    stop() {
        // 关闭 HTTP 服务器
        this.httpServer.close(() => {
            console.log('HTTP 服务器已关闭');
        });
    }

    start() {
        // 启动 HTTP 服务器，监听指定端口
        this.httpServer.listen(this.port, () => {
            console.log(`HTTP 服务器已启动，监听端口 ${this.port}`);
        });
    }

    sendRes(ws: WebSocket, { id, result }, code: number = 1) {
        ws.send(JSON.stringify({ code, id, result }));
        ws.close();
    }

    invokeMethod(
        ws: WebSocket,
        { id, params, method }: { id: string; params: any; method: string }
    ) {
        switch (method) {
            case 'dialog.selectFile':
                //选择文件
                dialog.showOpenDialog({ properties: ['openFile'] }).then((result) => {
                    if (result.canceled) {
                        this.sendRes(ws, { id, result: '' }, 0);
                    } else {
                        this.sendRes(ws, { id, result: result.filePaths });
                    }
                });
                break;
            case 'dialog.openDirectory':
                //选择目录
                dialog.showOpenDialog({ properties: ['openDirectory'] }).then((result) => {
                    if (result.canceled) {
                        this.sendRes(ws, { id, result: '' }, 0);
                    } else {
                        this.sendRes(ws, { id, result: result.filePaths });
                    }
                });
                break;
            case 'dialog.prompt':
                const promptId = uuid();
                const win = new PromptWindow(promptId, params.placeholder);
                win.show();
                ipcMain.once(`prompt-reply-${promptId}`, (_event, result) => {
                    win.replied = true;
                    this.sendRes(ws, { id, result });
                    win.close();
                });
                win.on('closed', () => {
                    if (!win.replied) {
                        this.sendRes(ws, { id, result: '用户取消输入' }, 0);
                    } else {
                        console.log('已回复');
                    }
                });
                break;
            default:
                this.sendRes(ws, { id, result: '未知的方法' }, 0);
                break;
        }
    }
}
