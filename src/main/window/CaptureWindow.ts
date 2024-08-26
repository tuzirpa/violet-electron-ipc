import { BrowserWindow, ipcMain, screen } from 'electron';
import { join } from 'path';

export class CaptureWindow extends BrowserWindow {
    replied: boolean = false;
    st?: NodeJS.Timeout;
    constructor() {
        super({
            width: 400,
            height: 160,
            show: false,
            resizable: true,
            frame: false,
            title: '提示',
            autoHideMenuBar: true,
            skipTaskbar: true,
            transparent: false,
            webPreferences: {
                preload: join(__dirname, '../preload/index.js'),
                sandbox: false
            }
        });
        this.updateContent();
        //位置左上角
        this.setPosition(30, 30);
    }

    //监听鼠标窗口进入
    start() {
        this.st = setInterval(() => {
            this.show300();
        }, 300);
    }

    stop() {
        clearInterval(this.st);
    }

    show300() {
        const point = screen.getCursorScreenPoint();
        //判断鼠标是否在窗口上
        if (this.isPointInWindow(point)) {
            this.hide();
        } else {
            this.show();
        }
    }

    isPointInWindow(point: Electron.Point) {
        const windowBounds = this.getBounds();
        return (
            point.x >= windowBounds.x &&
            point.x <= windowBounds.x + windowBounds.width &&
            point.y >= windowBounds.y &&
            point.y <= windowBounds.y + windowBounds.height
        );
    }

    updateContent() {
        const content = `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${this.title}</title>
            <style>
                * {
                    box-sizing: border-box;
                }
                body {
                    margin: 0;
                    padding: 0;
                    height: 100vh;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #fff;
                }
                #input{
                    padding: 5px;
                    border-radius: 5px;
                    border: 1px #6a6a6a solid;
                    font-size: 14px;
                    width: 100%;
                }
                #cancel{
                    background-color: #f5f5f5;
                    border: none;
                    color: #6a6a6a;
                    padding: 5px 10px;
                    border-radius: 5px;
                    cursor: pointer;
                }

                #confirm{
                    background-color: #4CAF50;
                    border: none;
                    color: #fff;
                    padding: 5px 10px;
                    border-radius: 5px;
                    cursor: pointer;
                }
                .btn-box{
                    display: flex;
                    justify-content: flex-end;
                    width: 100%;
                    gap: 20px;
                }
                .content-box{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-between;
                    
                    width: 100%;
                    height: 100%;
                    padding: 30px;
                }
            </style>
        </head>
        <body>
            <div class="content-box">
                 <div>提示：如果有需要鼠标移入才出现的元素 可以使用快捷键 alt+c 切换捕获状态</div>
            </div>
            <script>
               
            </script>
        </body>
        </html>`;

        this.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(content)}`);
    }
}

export default CaptureWindow;
