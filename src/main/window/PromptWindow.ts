import { BrowserWindow } from 'electron';
import { join } from 'path';

export class PromptWindow extends BrowserWindow {
    replied: boolean = false;
    constructor(
        public msgId: string,
        public placeholder: string
    ) {
        super({
            width: 400,
            height: 160,
            show: true,
            resizable: true,
            frame: false,
            title: '弹框',
            autoHideMenuBar: true,
            skipTaskbar: true,
            transparent: false,
            webPreferences: {
                preload: join(__dirname, '../preload/index.js'),
                sandbox: false
            }
        });
        this.updateContent();
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
                 <div>${this.title}</div>
                 <input type="text" id="input" placeholder="${this.placeholder}">
                 <div class="btn-box">
                    <input type="button" pr id="cancel" value="取消">
                    <input type="button" id="confirm" value="确认">
                 </div>
            </div>
            <script>
                document.addEventListener('DOMContentLoaded', () => {
                    const cancelButton = document.querySelector('#cancel');
                    const confirmButton = document.querySelector('#confirm');
                    const contentInput = document.querySelector('#input');
                    confirmButton.addEventListener('click', () => {
                        window.electron.ipcRenderer.send('prompt-reply-${this.msgId}', contentInput.value);
                    });
                    cancelButton.addEventListener('click', () => {
                        window.close();
                    });
                });
            </script>
        </body>
        </html>`;

        this.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(content)}`);
    }
}
