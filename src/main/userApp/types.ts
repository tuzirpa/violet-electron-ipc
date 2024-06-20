export type DataType =
    | 'string'
    | 'number'
    | 'boolean'
    | 'conditions'
    | 'object'
    | 'array'
    | 'any'
    | 'chrome'
    | 'chromePage';

export interface FlowVariable {
    /**
     * 变量名称
     */
    name: string;
    /**
     * 变量类型
     */
    type: DataType;
    /**
     * 变量描述
     */
    comment?: string;
}

export type AddConfigInputType =
    | 'string'
    | 'number'
    | 'boolean'
    | 'select'
    | 'textarea'
    | 'filePath'
    | 'variable';

export type AddConfigOnputType = 'variable';

export interface AddConfig<T> {
    /**
     * 输入标签
     */
    label: string;
    /**
     * 是否为高级配置
     */
    isAdvanced?: boolean;

    /**
     * 添加配置类型
     */
    type: T;
    /**
     * type为select时，选项列表
     */
    options?: {
        label: string;
        value: string;
    }[];
    /**
     * 输入提示
     */
    placeholder?: string;
    /**
     * 输入提示
     */
    tip?: string;

    /**
     * 输入默认值
     */
    defaultValue?: any;

    /**
     * 选项显示表达式
     */
    filters?: string;

    /**
     * 输入限制
     */
    limit?: {
        [key: string]: any;
    };
}

/**
 * 指令输入对象
 */
export interface DirectiveInput {
    /**
     * 输入字段名称
     */
    name?: string;
    /**
     * 输入值
     */
    value: any;
    /**
     * 描述显示的值 (可选) 不填则显示value
     */
    display?: string;
    /**
     * 对应变量类型的描述
     */
    typeDisplay?: string;
    /**
     * 输入类型
     */
    type: DataType;

    addConfig?: AddConfig<AddConfigInputType>;
}

export interface DirectiveOutput {
    /**
     * 输入字段名称
     */
    name: string;
    /**
     * 描述显示的值 (可选) 不填则显示value
     */
    display?: string;
    /**
     * 输入类型
     */
    type: DataType;
    /**
     * 是否必填
     */
    required: boolean;

    addConfig?: AddConfig<AddConfigOnputType>;
}

/**
 * 指令树
 */
export interface DirectiveTree {
    /**
     * 指令排序
     */
    sort?: number;
    /**
     * 显示名称空 直接显示name
     */
    displayName?: string;

    /**
     * 指令描述
     */
    description?: string;

    /**
     * name 指令名称 需要全局唯一
     */
    name: string;

    /**
     * 指令描述 支持变量占位符
     */
    comment?: string;

    /**
     * 是否流程控制指令 （if, for, while, switch）
     */
    isControl?: boolean;

    /**
     * 是否流程控制指令结束 （if, for, while, switch）
     */
    isControlEnd?: boolean;

    /**
     * 图标
     */
    icon?: string;
    /**
     * 指令输入
     */
    inputs: {
        [key: string]: DirectiveInput;
    };
    /**
     * 指令输出
     */
    outputs: {
        [key: string]: DirectiveOutput;
    };

    children?: DirectiveTree[];

    open?: boolean;
    hide?: boolean;
    pdLvn?: number;
    isFold?: boolean;
    id?: string;

    /**
     * 是否禁用
     */
    disabled?: boolean;

    breakpoint?: boolean;

    /**
     * 失败策略    terminate: 终止流程   ignore: 忽略错误   retry: 重试流程
     */
    failureStrategy?: 'terminate' | 'ignore' | 'retry';
    /**
     * retry时 重试间隔时间
     */
    intervalTime?: number;
    /**
     * retry时 重试次数
     */
    retryCount?: number;

    toCode?: (directive: DirectiveTree, block: Block) => Promise<string>;
}

export interface Block {
    blockLine: number;
    flowName: string;
    directiveName: string;
    directiveDisplayName: string;
    failureStrategy: 'terminate' | 'ignore' | 'retry';
    intervalTime: number;
    retryCount: number;
}

export type LogLevel = 'info' | 'warn' | 'error';
