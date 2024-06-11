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

import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import Flow from './Flow';

/**
 * 应用类
 */
export default class UserApp {
    id: string;
    version: string = '1.0.0';
    main: string = 'index.js';
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
        if(!fs.existsSync(userAppLocalDir)){
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
            dependencies: {
                "axios": "^1.7.2"
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
}
