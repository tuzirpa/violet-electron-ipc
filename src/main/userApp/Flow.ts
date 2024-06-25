import fs from 'fs';
import { DirectiveTree } from './types';
import { join } from 'path';
import { convertDirective } from './directiveconvert';

export default class Flow {
    blocks: DirectiveTree[] = [];
    static headLinkCount = 5;
    constructor(
        public appDir: string,
        public filePath: string,
        public name: string
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
        const content = fs.readFileSync(this.filePath, {
            encoding: 'utf-8'
        });
        if (!content) {
            return;
        }
        this.blocks = JSON.parse(content);
    }

    /**
     * 转换流程到js文件
     */
    public async convert() {
        let content = ['//流程自动生成'];
        content.push(`let robotUtil = require('./robotUtil');`);
        content.push(`robotUtil = robotUtil.default;`);
        content.push(`let _block = {};`);
        content.push(
            `const generateBlock = (blockLine,flowName,directiveName,directiveDisplayName,failureStrategy,intervalTime,retryCount)=>{return {blockLine,flowName,directiveName,directiveDisplayName,failureStrategy,intervalTime,retryCount}}`
        );
        content.push(`setTimeout(async ()=>{`);
        // content.push(`  try {`);

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
            }
            content.push(jsCode);
        }
        // content.push('  } catch (error) {');
        // content.push(`    console.log(error);`);
        // content.push(
        //     `    robotUtil.sendLog('error', '致命错误,退出流程:' + error.message, _block);`
        // );
        // content.push('  }');
        content.push('}, 1000);');

        return content.join('\n');
    }

    async save() {
        //保存编辑内容
        fs.writeFileSync(this.filePath, JSON.stringify(this.blocks, null, 2), {
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
