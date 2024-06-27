/**
 * {
  "name": "aaaa",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "express": "^4.19.2"
  }
}

 */

import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import NodeEvbitonment from '../nodeEnvironment/NodeEvbitonment';
import StepWindow from '../window/StepWindow';
import { WindowManage } from '../window/WindowManage';
import Flow from './Flow';
import { DevNodeJs, IBreakpoint, IExecutionThrown } from './devuserapp/DevNodeJs';
// import rebotUtilPath from './robotUtil?modulePath';
import { LogLevel } from './types';

/**
 * 应用类
 */
export default class UserApp {
    static rebotUtilPath = '';

    id: string;
    version: string = '1.0.0';
    main: string = 'main.flow.js';
    author: string = '';
    license: string = '';
    description: string = '';
    name: string = '';
    appDir: string = '';
    appDevDir: string = '';
    appRobotUtilDir: string = '';
    packageJson: any = {};

    flows: Flow[] = [];
    devNodeJs: DevNodeJs | null = null;
    devPrecess: ChildProcessWithoutNullStreams | null = null;
    private _initFlow: boolean = false;
    private stepWindow: StepWindow | null = null;

    static get userAppLocalDir() {
        const userAppLocalDir = path.join(app.getPath('userData'), 'userApp');
        if (!fs.existsSync(userAppLocalDir)) {
            fs.mkdirSync(userAppLocalDir, { recursive: true });
        }
        return userAppLocalDir;
    }

    // 构造函数
    constructor(id: string) {
        this.id = id;
        this.appDir = path.join(UserApp.userAppLocalDir, this.id);
        this.appDevDir = path.join(this.appDir, 'dev');
        this.appRobotUtilDir = path.join(this.appDir, 'robotUtil');

        this.init();
    }

    save() {
        // 保存
        // 写入package.json文件
        this.packageJson.name = this.name;
        fs.writeFileSync(
            path.join(this.appDir, 'package.json'),
            JSON.stringify(this.packageJson, null, 2)
        );
        return true;
    }

    init() {
        // 初始化
        // 判断本地目录是否存在，如果存在项目，无需创建
        if (!fs.existsSync(this.appDir)) {
            this.create();
        }
        // 读取package.json文件
        const packageJsonPath = path.join(this.appDir, 'package.json');
        const packageJsonStr = fs.readFileSync(packageJsonPath, 'utf-8');
        this.packageJson = JSON.parse(packageJsonStr);
        this.name = this.packageJson.name;

        // this.initFlows();
        this.robotUtilInit();
    }

    create() {
        // 初始化
        console.log('UserApp init');
        // 创建本地目录
        if (!fs.existsSync(this.appDir)) {
            fs.mkdirSync(this.appDir, { recursive: true });
        }
        // 写入package.json文件
        this.packageJson = {
            id: this.id,
            name: this.name,
            version: this.version,
            main: this.main,
            author: this.author,
            license: this.license,
            description: this.description,
            scripts: {
                dev: 'node --inspect-brk=2017 main.flow.js',
                start: 'node main.flow.js'
            },
            dependencies: {
                axios: '^1.7.2',
                puppeteer: '^22.11.0'
            }
        };
        fs.writeFileSync(
            path.join(this.appDir, 'package.json'),
            JSON.stringify(this.packageJson, null, 2)
        );
        // 写入index.js文件
        const indexJs = `const http = require('http');`;
        fs.writeFileSync(path.join(this.appDir, 'main.js'), indexJs);

        // 写入dev目录
        fs.mkdirSync(this.appDevDir, { recursive: true });
        // 写入dev/main.flow文件
        fs.writeFileSync(path.join(this.appDevDir, 'main.flow'), '');

        this.robotUtilInit();
    }

    robotUtilInit() {
        if (!fs.existsSync(this.appRobotUtilDir)) {
            fs.mkdirSync(this.appRobotUtilDir, { recursive: true });
        }
        // 写入robotUtil文件
        const robotUtilContent = fs.readFileSync(UserApp.rebotUtilPath, 'utf-8');
        fs.writeFileSync(path.join(this.appRobotUtilDir, 'index.js'), robotUtilContent);
    }

    /**
     * 加载 flows
     */
    initFlows() {
        // 初始化flows
        if (this._initFlow) {
            return;
        }
        this._initFlow = true;
        this.getFlows();
    }

    getFlows() {
        const files = fs.readdirSync(this.appDevDir);
        files.forEach((file) => {
            if (file.endsWith('.flow')) {
                this.flows.push(new Flow(this.appDir, path.join(this.appDevDir, file), file));
            }
        });
    }

    findFlow(name: string) {
        return this.flows.find((flow) => flow.name === name);
    }

    get breakpoints() {
        const breakpoints: IBreakpoint[] = [];
        this.flows.forEach((flow) => {
            flow.breakpoints.forEach((breakpoint) => {
                breakpoints.push({
                    url: `file:///${this.appDir}/${flow.name}.js`.replace(/\\/g, '/'),
                    line: breakpoint
                });
            });
        });
        return breakpoints;
    }

    shellExeCmd(cmds: string[], stdCallback?: (data: string) => void) {
        const cmd = cmds[0];
        const args = cmds.slice(1);
        console.log('执行命令', cmd, args);
        const child = spawn(cmd, args, { cwd: this.appDir, env: {} });
        child.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            data = data.toString();
            stdCallback && stdCallback(data);
            // WindowManage.getWindow('login').webContents.send('run-logs', `${data}`);
        });
        child.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            data = data.toString();
            stdCallback && stdCallback(data);
            // WindowManage.getWindow('login').webContents.send('run-logs', `${data}`);
        });
        child.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
        return child;
    }

    npmInstall() {
        // 安装依赖
        const npmCmd = path.join(NodeEvbitonment.nodeExeDir, 'npm.cmd');
        // process.chdir(this.appDir);
        console.log(process.env);

        const cmd = `${npmCmd}`;
        // const cmd = `dir`;
        console.log('执行安装命令', cmd);
        this.shellExeCmd([cmd, 'install']);
    }

    run() {
        // 运行
        return this.start();
    }

    async devStepOver() {
        if (this.devNodeJs) {
            this.devNodeJs.stepOver();
        }
    }
    async devResume() {
        if (this.devNodeJs) {
            this.devNodeJs.resume();
        }
    }
    async devStop() {
        if (!this.devPrecess) {
            return;
        }
        if (this.devNodeJs) {
            this.devNodeJs.stop();
        }
        this.devPrecess && this.devPrecess.kill();
        this.sendRunLogs({
            level: 'info',
            time: Date.now(),
            message: `停止流程`
        });
        WindowManage.mainWindow.webContents.send('devRunEnd');
    }

    async devGetProperties(objectId: string) {
        if (!this.devNodeJs) {
            throw new Error('DevNodeJs is not inited');
        }
        return this.devNodeJs.getProperties(objectId);
    }

    async dev() {
        // 调试启动 带断点启动
        return this.start(this.breakpoints);
    }

    sendRunLogs(data: { level: LogLevel; time: number; message: string; data?: any }) {
        WindowManage.mainWindow.webContents.send('run-logs', data);
    }

    start(breakpoints: IBreakpoint[] = []) {
        const nodeExeCmd = path.join(NodeEvbitonment.nodeExeDir, 'node.exe');
        const mainFlowJs = path.join(this.appDir, 'main.flow.js');
        const port = 9339;
        // let breakpoints: IBreakpoint[] = [];
        // breakpoints = this.breakpoints;
        this.sendRunLogs({
            level: 'info',
            time: Date.now(),
            message: `流程正在启动...`
        });
        this.stepWindow = this.stepWindow || new StepWindow();

        const cmds = [nodeExeCmd];
        if (breakpoints.length > 0) {
            cmds.push(`--inspect-brk=${port}`);
        }
        cmds.push(mainFlowJs);
        this.devPrecess = this.shellExeCmd(cmds, (data: string) => {
            //匹配出调试路径
            const matchData = data.match(/ws:\/\/127.0.0.1:\d{4}\/[0-9A-Za-z-]+/);

            if (data.includes('Debugger listening on ws://127.0.0.1:') && matchData) {
                const wsUrl = matchData[0];

                this.devNodeJs = new DevNodeJs(wsUrl, breakpoints);
                this.devNodeJs.onBreakpoint((breakpoint: IBreakpoint) => {
                    //发给前端需要从1开始
                    breakpoint.line = breakpoint.line + 1 - Flow.headLinkCount;
                    WindowManage.mainWindow.webContents.send('breakpoint', breakpoint);
                });
                // this.devNodeJs.onConsoleApiCalled((params: IConsoleApiCalled) => {
                //     console.log(params.type, params.args, params.timestamp);
                //     if (params.args[0].value === 'robotUtilLog') {
                //         this.sendRunLogs(JSON.parse(params.args[1].value));
                //     }
                // });
                this.devNodeJs.onExecutionThrown((context: IExecutionThrown) => {
                    this.sendRunLogs({
                        level: 'fatalError',
                        time: Date.now(),
                        message: context.description,
                        data: context
                    });
                });
                this.devNodeJs.start();
            } else if (this.devNodeJs && data.includes('Waiting for the debugger to disconnect.')) {
                //如果有异常 需要等待获取异常信息
                // setTimeout(() => {
                //     if (this.devNodeJs) {
                //         this.devNodeJs.close();
                //     }
                //     this.devNodeJs = null;
                //     this.sendRunLogs({
                //         level: 'info',
                //         time: Date.now(),
                //         message: `流程结束`
                //     });
                //     WindowManage.mainWindow.webContents.send('devRunEnd');
                //     this.devPrecess = null;
                // }, 1000);
            } else {
                data.split('\n').forEach((line) => {
                    if (line.startsWith('robotUtilLog-')) {
                        const logData = JSON.parse(
                            decodeURIComponent(line.replace('robotUtilLog-', ''))
                        );
                        this.sendRunLogs(logData);
                    } else if (line.startsWith('robotUtilRunStep')) {
                        if (!this.stepWindow?.isVisible()) this.stepWindow?.show();
                        const stepData = decodeURIComponent(line.replace('robotUtilRunStep-', ''));
                        const logData = JSON.parse(stepData);

                        this.stepWindow?.webContents.send('run-step', logData);

                        // this.sendRunLogs(logData);
                    }
                });
            }
        });
        this.devPrecess.on('exit', (code) => {
            console.log(`子进程已退出，退出码 ${code}`);
            if (this.devNodeJs) {
                this.devNodeJs.close();
            }
            this.devNodeJs = null;
            this.sendRunLogs({
                level: 'info',
                time: Date.now(),
                message: `流程结束`
            });
            WindowManage.mainWindow.webContents.send('devRunEnd');
            this.devPrecess = null;
            // this.stepWindow?.hide();
        });

        return port;
    }
}
