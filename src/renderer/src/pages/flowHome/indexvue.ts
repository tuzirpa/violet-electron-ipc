import { showContextMenu } from '@renderer/components/contextmenu/ContextMenuPlugin';
import { Action } from '@renderer/lib/action';
import { ElMessage } from 'element-plus';
import type { Block, LogLevel } from 'src/main/userApp/types';
import { ref } from 'vue';

/**
 * 运行日志
 */
export const runLogs = ref<{ level: LogLevel; message: string; time: number; data: Block }[]>([]);
console.log(runLogs, 'runLogs11');

window.electron.ipcRenderer.on('run-logs', (_event, log) => {
    console.log(log, 'run-logs');
    if (Array.isArray(log)) {
        log.forEach((item) => {
            item.time = new Date(item.time).toLocaleString();
        });
        //倒序
        log.reverse();
        runLogs.value.unshift(...log);
    } else {
        log.time = new Date(log.time).toLocaleString();
        runLogs.value.unshift(log);
    }
});

/**
 * 运行日志右键菜单
 * @param event 鼠标右键事件
 */
export const handleRunLogsContextMenu = (row: any, _column: any, event: MouseEvent) => {
    showContextMenu(event, [
        {
            label: '复制内容',
            onClick: async () => {
                await Action.copyToClipboard(row.message);
                ElMessage.success('复制成功');
            },
            icon: 'icon-fuzhi',
            shortcut: ''
        },

        {
            label: '清空运行日志',
            onClick: () => {
                runLogs.value = [];
            },
            icon: '',
            shortcut: ''
        }
    ]);
};
