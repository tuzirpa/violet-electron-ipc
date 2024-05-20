import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import App from './App.vue';
import router from './routers';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import 'dayjs/locale/zh-cn';

import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css';
import './assets/main.css';
const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

app.use(router);

app.use(ElementPlus, {
    locale: zhCn
});

app.mount('#app');
