export type DataType = 'string' | 'number' | 'boolean' | 'conditions' | 'object' | 'array' | 'any';

export interface FlowVariable {
    /**
     * 变量名称
     */
    name: string;
    /**
     * 变量类型
     */
    type: string;
    /**
     * 变量描述
     */
    comment?: string;
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
     * 输入类型
     */
    type: DataType;

    /**
     * 输入提示
     */
    placeholder?: string;
    /**
     * 输入提示
     */
    hint?: string;
    /**
     * 输入默认值
     */
    defaultValue?: string;
    /**
     * 输入选项
     */
    options?: {
        [key: string]: any;
    };
    /**
     * 输入限制
     */
    limit?: {
        [key: string]: any;
    };
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
    type: string;
    /**
     * 是否必填
     */
    required: boolean;
    /**
     * 输入提示
     */
    placeholder?: string;
    /**
     * 输入提示
     */
    hint?: string;
    /**
     * 输入默认值
     */
    defaultValue?: string;
    /**
     * 输入选项
     */
    options?: {
        [key: string]: any;
    };
    /**
     * 输入限制
     */
    limit?: {
        [key: string]: any;
    };
}

/**
 * 指令树
 */
export interface DirectiveTree {
    /**
     * 指令名称 需要全局唯一
     */
    displayName: string;

    /**
     * name
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
}
