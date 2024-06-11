type InputType =
    | 'string'
    | 'number'
    | 'boolean'
    | 'array'
    | 'object'
    | 'file'
    | 'image'
    | 'video'
    | 'audio'
    | 'date'
    | 'datetime'
    | 'time'
    | 'color'
    | 'select'
    | 'radio'
    | 'checkbox'
    | 'textarea'
    | 'password';

type OutputType = 'variable' | 'event';

export interface DirectiveConfig {
    /**
     * 指令名称
     */
    name: string;
    /**
     * 指令描述
     */
    description: string;
    /**
     * 指令输入参数
     */
    inputs: {
        [key: string]: {
            label: string;
            type: InputType;
            options?: {
                label: string;
                value: string;
            }[];
            default?: any;
            tip?: string;
        };
    };
    /**
     * 指令输出参数
     */
    outputs?: {
        [key: string]: {
            label: string;
            type: OutputType;
            default: string;
            tip: string;
        };
    };
}

/**
 * 指令对应的配置
 */
const directiveConfig: { [key: string]: DirectiveConfig } = {
    'web.create': {
        name: '启动浏览器',
        description: '启动一个浏览器',
        icon: '',
        inputs: {
            webType: {
                label: '浏览器类型',
                type: 'select',
                options: [
                    {
                        label: 'Chrome',
                        value: 'chrome'
                    },
                    {
                        label: 'Firefox',
                        value: 'firefox'
                    },
                    {
                        label: 'Edge',
                        value: 'edge'
                    },
                    {
                        label: 'Safari',
                        value: 'safari'
                    }
                ],
                default: 'chrome',
                tip: '选择浏览器类型'
            }
        },
        outputs: {
            browser: {
                label: '保存浏览器对象至',
                type: 'variable',
                tip: '保存浏览器对象至变量，可用于后续在操作'
            }
        }
    },
    'web.openUrl': {
        name: '打开网页',
        description: '打开一个网页',
        inputs: {
            webPage: {
                label: '标签页对象',
                type: 'string',
                tip: '标签页对象，可从web.create指令的输出中获取'
            },
            url: {
                label: '网页地址',
                type: 'string',
                default: '',
                tip: '输入网页地址'
            },
            isWaitLoad: {
                label: '是否等待页面加载',
                type: 'boolean',
                default: 0,
                tip: '等待页面加载时间，单位为秒'
            },
            timeout: {
                label: '超时时间',
                type: 'number',
                default: 10,
                tip: '超时时间，单位为秒'
            }
        }
    },
    'flowControls.if': {
        name: '判断',
        description: '判断条件是否成立',
        inputs: {
            operand1: {
                label: '对象1',
                type: 'string',
                tip: '输入需要判断的对象1'
            },
            operator: {
                label: '条件',
                type: 'select',
                tip: '选择判断条件',
                options: [
                    {
                        label: '等于',
                        value: '=='
                    },
                    {
                        label: '不等于',
                        value: '!='
                    },
                    {
                        label: '大于',
                        value: '>'
                    },
                    {
                        label: '大于等于',
                        value: '>='
                    },
                    {
                        label: '小于',
                        value: '<'
                    },
                    {
                        label: '小于等于',
                        value: '<='
                    }
                ]
            },
            operand2: {
                label: '对象2',
                type: 'string',
                tip: '输入需要判断的对象2'
            }
        }
    },
    /**
     * 日志输出
     */
    'log.out':{
        name: '日志输出',
        description: '输出日志信息',
        inputs: {
            content: {
                label: '日志内容',
                type: 'textarea',
                default: '',
                tip: '输入日志内容'
            }
        }
    }
};

export function getDirectiveConfig(name: string): DirectiveConfig {
    return directiveConfig[name];
}
