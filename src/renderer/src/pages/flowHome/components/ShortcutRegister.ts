export interface ShortcutOptions {
    /**
     * 按键组合 只要按下这些按键的其中一个，就触发回调函数
     */
    keys: string[];
    /**
     * 是否需要同时按下 ctrl 键
     * @default false
     */
    ctrlKey?: boolean;
    /**
     * 是否需要同时按下 shift 键
     * @default false
     */
    shiftKey?: boolean;
    /**
     * 是否需要同时按下 alt 键
     * @default false
     */
    altKey?: boolean;
}

/**
 * 快捷键注册
 * @param htmlNode 注册节点
 * @param keys 同时按下的按键
 * @param callback 回调函数
 */
export class Shortcut {
    handlers: Map<string, () => void> = new Map();
    constructor(public htmlNode: HTMLElement) {
        this.init();
    }
    init() {
        this.htmlNode.addEventListener('keydown', (event: KeyboardEvent) => {
            console.log('keydown', event.key);
            this.dispatch(event);
        });
    }

    dispatch(event: KeyboardEvent) {
        const { key, ctrlKey, shiftKey, altKey } = event;
        const keyStr = `${ctrlKey}${shiftKey}${altKey}${key}`;
        const callback = this.handlers.get(keyStr);
        if (callback) {
            callback();
        }
    }

    /**
     * 注册快捷键
     * @param options 快捷键配置
     * @param callback 回调函数
     */
    register(options: ShortcutOptions, callback: () => void) {
        const { keys, ctrlKey = false, shiftKey = false, altKey = false } = options;

        keys.forEach((key) => {
            const keyStr = `${ctrlKey}${shiftKey}${altKey}${key}`;
            this.handlers.set(keyStr, callback);
        });
    }
}
