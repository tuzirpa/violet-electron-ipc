// electron.vite.config.ts
import { join, resolve } from "path";
import { defineConfig, externalizeDepsPlugin, bytecodePlugin } from "electron-vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vueSetupExtend from "unplugin-vue-setup-extend-plus/vite";
import { readdirSync } from "fs";
var __electron_vite_injected_dirname = "E:\\gitee_project\\tuzi_robot";
var evtryPath = resolve(__electron_vite_injected_dirname, "./src/renderer");
var entrys = readdirSync(evtryPath).reduce((obj, dirname) => {
  console.log(dirname);
  obj[dirname] = join(evtryPath, dirname);
  return obj;
}, {});
var keys = Object.keys(entrys);
console.log("keys", keys);
var paths = keys.filter((key) => key.endsWith(".html")).map((key) => key.replace(".html", ""));
console.log("paths", paths);
var getEntryPath = () => {
  const pageEntry = {};
  paths.forEach((path) => {
    pageEntry[path] = resolve(__electron_vite_injected_dirname, `src/renderer/${path}.html`);
  });
  return pageEntry;
};
var rendererInput = getEntryPath();
console.log("rendererInput", rendererInput);
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin({ chunkAlias: "index" })],
    resolve: {
      alias: {
        "@shared": resolve("src/shared")
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("index")) {
              return "index";
            }
          }
        }
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()]
  },
  renderer: {
    build: {
      minify: "esbuild",
      rollupOptions: {
        input: rendererInput
      }
    },
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
        "@shared": resolve("src/shared")
      }
    },
    plugins: [vue(), vueJsx(), vueSetupExtend({})]
  }
});
export {
  electron_vite_config_default as default
};
