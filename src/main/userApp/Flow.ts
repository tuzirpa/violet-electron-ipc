import fs from 'fs';
import { DirectiveTree } from './types';
import path, { join } from 'path';
import { convertDirective } from './directiveconvert';

export default class Flow {
    blocks: DirectiveTree[] = [];
    static headLinkCount = 6;

    constructor(
        public appDir: string,
        public filePath: string,
        public name: string,
        public aliasName?: string
    ) {
        console.log('Flow');
        this.init();
    }

    get breakpoints() {
        const breakpoints: number[] = [];
        this.blocks.forEach((block, index) => {
            const breakpoint = block.breakpoint;
            if (breakpoint) {
                breakpoints.push(index + Flow.headLinkCount);
            }
        });
        return breakpoints;
    }

    init() {
        //检查文件是否存在
        const dir = path.dirname(this.filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        if (fs.existsSync(this.filePath)) {
            //读取文件内容
            let content = fs.readFileSync(this.filePath, {
                encoding: 'utf-8'
            });
            content = content || '{}';
            const contentObj = JSON.parse(content);
            this.blocks = contentObj.blocks || [];
            this.aliasName = contentObj.aliasName || this.name;
        }
        this.save();
    }

    get isMainFlow() {
        return this.name.startsWith('main');
    }

    /**
     * 转换流程到js文件
     */
    public async convert() {
        let content = ['//流程自动生成'];
        content.push(`let robotUtilAll = require('tuzirobot');`);
        content.push(`let fs = require('fs');`);
        content.push(`robotUtil = robotUtilAll.default;`);
        content.push(`const generateBlock = robotUtilAll.generateBlock;`);
        content.push(`const fatalError = robotUtilAll.fatalError;`);
        content.push(`module.exports = async function () {`);
        content.push(`  try { let returnVal = [];//流程返回值`);
        let flowControlBlock = 0;
        for (let index = 0; index < this.blocks.length; index++) {
            const block = this.blocks[index];
            const convertCode = await convertDirective(block, index, this);
            let indent = '    ';
            if (block.pdLvn) {
                for (let index = 0; index < block.pdLvn * 2; index++) {
                    indent += ' ';
                }
            }
            let jsCode = indent + convertCode;

            if (block.disabled) {
                jsCode = '//' + jsCode;
            } else {
                // continue break 这两个指令只能在循环中使用
                if (block.name === 'flowControl.continue' || block.name === 'flowControl.break') {
                    if (flowControlBlock <= 0) {
                        jsCode = '//' + jsCode;
                    }
                }
            }
            //记录是否在for或while中 循环中
            if (block.isLoop) {
                flowControlBlock++;
            } else if (block.name === 'flowControl.for.end') {
                flowControlBlock--;
            }

            content.push(jsCode);
        }
        content.push(`    ${this.isMainFlow ? '//主流程无需返回值' : 'return {returnVal};'}`);
        content.push('  } catch (error) {');
        content.push(`    fatalError(error,__filename);`);
        content.push('  }');
        content.push('};');

        return content.join('\n');
    }

    async save() {
        //保存编辑内容
        fs.writeFileSync(this.filePath, JSON.stringify(this, null, 2), {
            encoding: 'utf-8'
        });
        //转换成js代码
        const content = await this.convert();
        //保存js代码
        fs.writeFileSync(join(this.appDir, `${this.name}.js`), content, {
            encoding: 'utf-8'
        });
    }
}
