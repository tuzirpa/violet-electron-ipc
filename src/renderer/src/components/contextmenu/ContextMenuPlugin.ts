// plugins/ContextMenuPlugin.js
import ContextMenu from './ContextMenu.vue';
import { App, createApp } from 'vue';
import MenuItem from './MenuItem';

const div = document.createElement('div');
div.id = 'context-menu';
document.body.appendChild(div);
const contextMenuApp = createApp(ContextMenu);
const instance = contextMenuApp.mount(div);

export default {
    install: (app: App) => {
        // @ts-ignore
        app.config.globalProperties.$showContextMenu = instance.showContextMenu;
    }
};

export const showContextMenu = (event: MouseEvent, items: MenuItem[]) => {
    // @ts-ignore
    instance.showContextMenu(event, items);
};
