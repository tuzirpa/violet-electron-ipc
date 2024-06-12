import http, { IncomingMessage } from 'http';
import WebSocket from 'ws';

export class DevServer {
    private wss: WebSocket.Server;
    private server: http.Server;
    constructor(public port: number) {
        this.server = http.createServer();

        this.wss = new WebSocket.Server({ server: this.server });
        this.wss.on('connection', this.onConnection);
        console.log(`Server started on port ${this.port}`);
    }

    private onConnection(client: WebSocket, request: IncomingMessage) {
        console.log('Client connected');
        const path: string = request.url || '/';
        console.log('Path:', path);

        client.on('message', (message: any) => {
            console.log('Received message:', message);
            client.send('Hello from server');
        });
    }

    start() {
        console.log('Starting server');
        return new Promise<void>((resolve, reject) => {
            this.server.listen(this.port, resolve);
            // 监听服务器启动错误
            this.server.on('error', reject);
        });
    }
}
