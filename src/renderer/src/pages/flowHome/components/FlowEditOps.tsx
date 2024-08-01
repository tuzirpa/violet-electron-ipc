import { showContextMenu } from '@renderer/components/contextmenu/ContextMenuPlugin';
import { Action } from '@renderer/lib/action';
import { DirectiveData, OpenFile } from './types';
import type { FlowVariable } from 'src/main/userApp/types';
import { errorDirectives } from './FlowEditStore';
import { closeFile, closeOtherFiles, closeRightFiles } from '../indexvue';
import { Folder, CopyDocument } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

export const showContextFlowMenu = (event: MouseEvent, file: OpenFile) => {
    showContextMenu(event, [
        {
            label: '关闭',
            onClick: () => {
                closeFile(file.name);
            },
            icon: '',
            shortcut: '',
            disabled: file.name === 'main.flow'
        },
        {
            label: '关闭其他文件',
            onClick: () => {
                closeOtherFiles(file.name);
            },
            icon: '',
            shortcut: ''
        },
        {
            label: '关闭右侧文件',
            onClick: () => {
                closeRightFiles(file.name);
            },
            icon: '',
            shortcut: ''
        },
        {
            icon: (
                <el-icon>
                    <CopyDocument />
                </el-icon>
            ),
            label: '复制流程名',
            shortcut: '',
            disabled: file.name === 'main.flow',
            onClick: async () => {
                await navigator.clipboard.writeText(file.name);
                ElMessage.success('复制成功');
            }
        },
        {
            label: '在文件夹中打开',
            onClick: () => {
                Action.openFolder(file.filePath);
            },
            icon: (
                <el-icon>
                    <Folder />
                </el-icon>
            ),
            shortcut: ''
        }
    ]);
};

/**
 * 计算变量列表
 * @param _directive 指令
 * @param index
 */
function variablesCompute(directives: DirectiveData[], index: number) {
    const variablesTemp: FlowVariable[] = [];
    const beforeBlocks = directives.slice(0, index);
    beforeBlocks.forEach((item, itemIndex) => {
        // 获取指令的输出
        const outputs = item.outputs || {};
        for (const key in outputs) {
            if (Object.prototype.hasOwnProperty.call(outputs, key)) {
                const output = outputs[key];
                variablesTemp.push({
                    name: output.name,
                    type: output.type,
                    comment: output.display,
                    before: itemIndex < index
                });
            }
        }
    });
    return variablesTemp;
}

export const checkError = (directives: DirectiveData[], file: OpenFile) => {
    errorDirectives.value = [];
    directives.forEach((directive, index) => {
        //获取当前指令之前的变量
        const vars = variablesCompute(directives, index);
        //计算当前指令使用的变量
        directive.error = '';
        const errors: string[] = [];
        for (const key in directive.inputs) {
            if (!Object.prototype.hasOwnProperty.call(directive.inputs, key)) {
                break;
            }
            const input = directive.inputs[key];
            if (input.addConfig.type === 'variable') {
                const varItem = vars.find((item) => item.name === input.value);
                if (input.addConfig.required && !varItem) {
                    errors.push(`变量${input.value}未定义`);
                }
            }
            // const input = directive.inputs[key];
            // if (input.addConfig.type === 'variable') {
            //     const varItem = vars.find((item) => item.name === input.value);
            //     if (!varItem) {
            //         errors.push(`变量${input.value}未定义`);
            //     }
            // } else if(input.type === 'array'){
            //     const varNames = String(input.value).match(/\${.*?}/g);
            //     varNames?.forEach((varName) => {
            //         varName = varName.substring(2, varName.length - 1);
            //         //从 ${表达式} 中提取出表达式变量

            //         const varItem = vars.find((item) => item.name === varName);
            //         if (!varItem) {
            //             errors.push(`变量${varName}未定义`);
            //         }
            //     });
            // }
        }
        if (errors.length > 0) {
            directive.error = errors.join('\n');
            errorDirectives.value.push({ file, directive, line: index + 1 });
        }
    });
};
