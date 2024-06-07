import fs from 'fs';
import { DirectiveInput, DirectiveTree } from './types';
import { join } from 'path';

export const blockConvertMap = new Map<string, (directive: DirectiveTree) => string>();

function typeToCode(inputItem: DirectiveInput) {
    if (inputItem.type === 'string') {
        return `String(\`${inputItem.value}\`)`;
    } else if (inputItem.type === 'conditions') {
        return `${inputItem.value}`;
    }
    return '';
}

blockConvertMap.set('flowControls.if', (directive: DirectiveTree) => {
    const ifstr: string[] = [];
    for (const key in directive.inputs) {
        const input = directive.inputs[key];
        ifstr.push(typeToCode(input));
    }

    return `if(${ifstr.join('')}) {`;
});

blockConvertMap.set('flowControls.if.end', (_directive: DirectiveTree) => {
    return `}`;
});

export default class Flow {
    blocks: DirectiveTree[] = [];
    constructor(
        public appDir: string,
        public filePath: string,
        public name: string
    ) {
        console.log('Flow');
        this.init();
    }

    init() {
        this.blocks = JSON.parse(
            fs.readFileSync(this.filePath, {
                encoding: 'utf-8'
            })
        );
    }

    /**
     * 转换流程到js文件
     */
    public convert() {
        let content = ['// 头部说明'];
        content.push(`const axios = require('axios');`);
        // content.push(`const response = await axios.post(url, data);`);
        this.blocks.forEach((block) => {
            const blockConvert = blockConvertMap.get(block.name);
            let indent = '';
            if (block.pdLvn) {
                for (let index = 0; index < block.pdLvn * 4; index++) {
                    indent += ' ';
                }
            }
            if (blockConvert) {
                const lineCode = blockConvert(block);
                content.push(indent + lineCode);
            } else {
                console.log(`未找到${block.name}的转换器`);
                content.push(indent + '//' + '未找到${block.name}的转换器');
            }
        });

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
