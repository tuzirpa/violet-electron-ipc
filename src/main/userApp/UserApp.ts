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

import { app, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import Flow from './Flow';
import NodeEvbitonment from '../nodeEnvironment/NodeEvbitonment';
import { exec, spawn } from 'child_process';
import { WindowManage } from '../window/WindowManage';
import { DevServer } from './devuserapp/DevServer';
import { DevNodeJs } from './devuserapp/DevNodeJs';

/**
 * 应用类
 */
export default class UserApp {
    id: string;
    version: string = '1.0.0';
    main: string = 'main.flow.js';
    author: string = '';
    license: string = '';
    description: string = '';
    name: string = '';
    appDir: string = '';
    appDevDir: string = '';
    packageJson: any = {};

    flows: Flow[] = [];

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

        this.initFlows();
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
                axios: '^1.7.2'
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
    }

    initFlows() {
        // 初始化flows
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

    shellExeCmd(cmds: string[], stdCallback?: (data: string) => void) {
        const cmd = cmds[0];
        const args = cmds.slice(1);
        console.log('执行命令', cmd, args);
        const child = spawn(cmd, args, { cwd: this.appDir, env: {} });
        child.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            stdCallback && stdCallback(data.toString());
            WindowManage.getWindow('login').webContents.send('run-logs', `${data}`);
        });
        child.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
            stdCallback && stdCallback(data.toString());
            WindowManage.getWindow('login').webContents.send('run-logs', `${data}`);
        });
        child.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
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
        const npmCmd = path.join(NodeEvbitonment.nodeExeDir, 'npm.cmd');
        const cmd = `${npmCmd}`;
        console.log('执行运行命令', cmd);
        this.shellExeCmd([cmd, 'run', 'start']);
    }
    async dev() {
        // 调试启动
        // const devServer = new DevServer(2017);
        // await devServer.start();

        this.packageJson.scripts.dev = `node --inspect-brk=${2017} main.flow.js`;
        this.save();

        // const npmCmd = path.join(NodeEvbitonment.nodeExeDir, 'npm.cmd');
        // const cmd = `${npmCmd}`;
        // console.log('执行运行命令', cmd);

        const nodeExeCmd = path.join(NodeEvbitonment.nodeExeDir, 'node.exe');
        const mainFlowJs = path.join(this.appDir, 'main.flow.js');
        // exec(
        //     [nodeExeCmd, `--inspect-brk=${2017}`, mainFlowJs].join(' '),
        //     (error, stdout, stderr) => {
        //         if (error) {
        //             console.error(`exec error: ${error}`);
        //             return;
        //         }
        //         console.log(`stdout: ${stdout}`);
        //         console.log(`stderr: ${stderr}`);
        //         const devNodeJs = new DevNodeJs('');
        //     }
        // );
        const port = 2017;
        this.shellExeCmd([nodeExeCmd, `--inspect=${port}`, mainFlowJs], (data: string) => {
            //匹配出调试路径
            const matchData = data.match(/ws:\/\/127.0.0.1:\d{4}\/[0-9A-Za-z-]+/);

            if (matchData) {
                const wsUrl = matchData[0];
                const devNodeJs = new DevNodeJs(wsUrl);
            }
        });
    }
}
