/**
 * 指令输入对象
 */
export interface DirectiveInput {
    /**
     * 输入字段名称
     */
    name: string;
    /**
     * 输入值
     */
    value: string;
    /**
     * 描述显示的值 (可选) 不填则显示value
     */
    display?: string;
    /**
     * 输入类型
     */
    type: string;
    /**
     * 输入标签 添加弹框时字段标签
     */
    label: string;
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
    name: string;

    /**
     * id
     */
    id: string;

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
    // paretObjName: string;
    // paretObjIcon?: string;
    // childenList?: DirectiveTree[];
    // parentIndex?: number;
    // task_id: number;
    // need_edit?: boolean;
    // enable?: boolean; // 是否启用
    // sub_task?: boolean; // 是否是子任务
    // remark?: string; // 备注
    // endid?: number;
}
