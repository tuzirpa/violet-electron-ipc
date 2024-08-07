import { ESLint } from 'eslint';
import eslintPluginNode from 'eslint-plugin-node';

/**
 * 全局变量指定
 */
type LintGlobals = { [key: string]: string | boolean };

// Create an instance of ESLint with the configuration passed to the function
function createESLintInstance(globals: LintGlobals) {
    return new ESLint({
        // overrideConfigFile: true,
        overrideConfig: {
            env: {
                es6: true,
                node: true
            },
            parserOptions: {
                ecmaVersion: 2018,
                sourceType: 'script'
            },
            globals: {
                ...globals,
                ...eslintPluginNode.configs.recommended.globals
            },
            rules: {
                'no-console': 'error',
                'no-unused-vars': 'warn',
                'no-undef': 'error'
            }
        },
        fix: true
    });
}

async function lintAndFix(eslint: ESLint, filePaths: string[]) {
    const results = await eslint.lintFiles(filePaths);
    await ESLint.outputFixes(results);
    return results;
}

/**
 *
 * @param filePaths js文件路径列表
 * @param globals 全局参数
 * @description 调用eslint进行代码检查
 * @returns
 */
export async function lintFiles(filePaths: string[], globals: LintGlobals) {
    const eslint = createESLintInstance(globals);
    const results = await lintAndFix(eslint, filePaths);
    return results;
}
