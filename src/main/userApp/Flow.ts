import fs from 'fs';
import { DirectiveTree } from './types';
import { join } from 'path';
import { convertDirective } from './directiveconvert';

export default class Flow {
    blocks: DirectiveTree[] = [];
    static headLinkCount = 3;
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
    public convert() {
        let content = ['debugger; // 头部说明'];
        content.push(`const axios = require('axios');`);
        content.push(`setTimeout(async ()=>{`);
        // content.push(`const response = await axios.post(url, data);`);

        this.blocks.forEach((block) => {
            const convertCode = convertDirective(block);
            let indent = ' ';
            if (block.pdLvn) {
                for (let index = 0; index < block.pdLvn * 4; index++) {
                    indent += ' ';
                }
            }
            content.push(indent + convertCode);
        });

        content.push('}, 1000);');

        return content.join('\n');
    }

    save() {
        //保存编辑内容
        fs.writeFileSync(this.filePath, JSON.stringify(this.blocks, null, 2), {
            encoding: 'utf-8'
        });
        //转换成js代码
        const content = this.convert();
        //保存js代码
        fs.writeFileSync(join(this.appDir, `${this.name}.js`), content, {
            encoding: 'utf-8'
        });
    }
}
