import { join, resolve } from 'path';
import { defineConfig, externalizeDepsPlugin, bytecodePlugin } from 'electron-vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueSetupExtend from 'unplugin-vue-setup-extend-plus/vite';
// import Inspect from 'vite-plugin-inspect';
import { readdirSync } from 'fs';
const evtryPath = resolve(__dirname, './src/renderer');
const entrys = readdirSync(evtryPath).reduce((obj, dirname) => {
    console.log(dirname);
    obj[dirname] = join(evtryPath, dirname);
    return obj;
},{});
const keys = Object.keys(entrys);
console.log('keys',keys);

const paths = keys.filter((key) => key.endsWith('.html')).map(key=>key.replace('.html',''));
console.log('paths',paths);

const getEntryPath = ()=>{
    const pageEntry = {};
    paths.forEach(path => {
        pageEntry[path] = resolve(__dirname, `src/renderer/${path}.html`);
    });
    return pageEntry;
}
const rendererInput = getEntryPath();
console.log('rendererInput',rendererInput);


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
        build: {
            minify:'esbuild',
            rollupOptions: {
                input: rendererInput
            }
        },
        resolve: {
            alias: {
                '@renderer': resolve('src/renderer/src'),
                '@shared': resolve('src/shared')
            }
        },
        plugins: [vue(), vueJsx() /* , Inspect() */, vueSetupExtend({})]
    }
});
