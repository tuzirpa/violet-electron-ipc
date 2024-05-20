import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin, bytecodePlugin } from 'electron-vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueSetupExtend from 'unplugin-vue-setup-extend-plus/vite';
// import Inspect from 'vite-plugin-inspect';

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin(), bytecodePlugin()],

        resolve: {
            alias: {
                '@shared': resolve('src/shared')
            }
        }
    },
    preload: {
        plugins: [externalizeDepsPlugin(), bytecodePlugin()]
    },
    renderer: {
        resolve: {
            alias: {
                '@renderer': resolve('src/renderer/src'),
                '@shared': resolve('src/shared')
            }
        },
        plugins: [vue(), vueJsx() /* , Inspect() */, vueSetupExtend({})]
    }
});
