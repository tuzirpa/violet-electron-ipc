import { DirectiveTree } from 'src/main/userApp/types';
import { ref } from 'vue';

const directives = ref<Partial<DirectiveTree>[]>([]);

directives.value = [
    {
        name: '0',
        displayName: '浏览器操作',
        icon: 'icon-gugeliulanqi',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                name: 'web.create',
                displayName: '启动浏览器',
                icon: 'icon-web-create',
                isControl: false,
                isControlEnd: false,
                comment: '启动${webType},保存至：${browser}',
                inputs: {
                    webType: {
                        name: 'webType',
                        value: '',
                        type: 'string'
                    }
                },
                outputs: {
                    browser: {
                        name: 'web_page',
                        display: '浏览器对象',
                        type: 'chrome',
                        required: false
                    }
                }
            },
            {
                name: 'web.openUrl',
                displayName: '访问网页地址',
                isControl: false,
                isControlEnd: false,
                icon: 'icon-dakaiwangye',
                comment:
                    '在${webPage}标签页中访问${url}，等待页面加载完成：${isWaitLoad}，超时时间：${timeout}秒',
                inputs: {
                    webPage: {
                        name: 'webPage',
                        value: '',
                        type: 'string'
                    },
                    url: {
                        name: 'url',
                        value: '',
                        type: 'string'
                    },
                    isWaitLoad: {
                        name: 'isWaitLoad',
                        value: true,
                        type: 'boolean'
                    },
                    timeout: {
                        name: 'timeout',
                        value: 10,
                        type: 'number'
                    }
                },
                outputs: {}
            },
            {
                name: 'web.createTab',
                displayName: '创建新标签页',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '3',
                displayName: '后退一步',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '4',
                displayName: '前进一步',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '5',
                displayName: '停止加载页面',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '6',
                displayName: '刷新当前页面',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '7',
                displayName: '关闭当前网页窗口',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '8',
                displayName: '关闭浏览器',
                comment: '关闭浏览器进程',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '10',
                displayName: '禁用/启用右键菜单',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '11',
                displayName: '禁用/启用显示图片',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '95',
                displayName: '允许/禁止弹出新窗口',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '96',
                displayName: '在新弹出网页上执行流程',
                isControl: true,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '97',
                displayName: '获取已打开标签页对象',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '98',
                displayName: '自动点击处理JS弹窗',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    },
    {
        name: '0',
        displayName: '鼠标操作',
        icon: 'icon-shubiao',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                name: '12',
                displayName: '启用鼠标移动轨迹',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '72',
                displayName: '获取元素坐标值',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '13',
                displayName: '移动鼠标到指定位置',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '14',
                displayName: '鼠标点击指定坐标位置',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '71',
                displayName: '鼠标拖拽',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '113',
                displayName: '在指定元素位置滚动鼠标滚轮',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    },
    {
        name: '0',
        displayName: '元素操作',
        icon: 'icon-yuansucaozuo',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                name: '16',
                displayName: '获取元素属性值',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '17',
                displayName: '判断指定的属性是否存在',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '18',
                displayName: '点击元素',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '19',
                displayName: 'css选择器点击',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '58',
                displayName: '获取相似元素个数',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '78',
                displayName: '填写输入框',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '89',
                displayName: '清空输入框',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '90',
                displayName: '设置元素属性',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '91',
                displayName: '删除元素属性',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '99',
                displayName: '设置下拉框',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '112',
                displayName: '设置复选框',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '100',
                displayName: '用代码方式操作元素对象',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    },
    {
        name: '0',
        displayName: '页面操作',
        icon: 'icon-yemiancaozuo',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                name: '21',
                displayName: '自动上下滚动页面',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '22',
                displayName: '每次加载页面前执行js',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '23',
                displayName: '每次加载页面后执行js',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '24',
                displayName: '查找指定内容的相似个数',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '25',
                displayName: '执行js代码',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '26',
                displayName: '上传附件',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '27',
                displayName: '下载文件',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '28',
                displayName: '页面截图',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '29',
                displayName: '保存网页到本地',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '30',
                displayName: '随机点击页面上的链接',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '15',
                displayName: '滚动网页',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    },
    {
        name: '0',
        displayName: '输入操作',
        icon: 'icon-jianpan',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                name: '31',
                displayName: '输入文字内容',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '59',
                displayName: '输入文字内容',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '32',
                displayName: '发送键盘消息',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    },
    {
        name: '0',
        displayName: '网页设置',
        icon: 'icon-wangyeshezhi',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                name: '33',
                displayName: '设置cookie',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '34',
                displayName: '清除所有的cookie',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '35',
                displayName: '设置代理',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '36',
                displayName: '清除浏览器的代理',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '37',
                displayName: '设置UserAgent',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '38',
                displayName: '设置屏幕尺寸大小',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '39',
                displayName: '启用触屏模式',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '40',
                displayName: '设置GPS(经纬度)',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '41',
                displayName: '设置陀螺仪',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    },
    {
        name: '0',
        displayName: '数据过滤与监听',
        icon: 'icon-shujuguolv',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                name: '42',
                displayName: '重定向URL地址',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '43',
                displayName: '监听网页请求与结果',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '75',
                displayName: '停止监听网页',
                comment: '结束抓取网页中的请求信息',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '87',
                displayName: '等待监听到数据',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '88',
                displayName: '清空监听到数据',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    },
    {
        name: '0',
        displayName: '数据操作',
        icon: 'icon-shujucaozuo',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                name: '46',
                displayName: '获取当前网址',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '47',
                displayName: '获取网页标题',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '48',
                displayName: '获取cookie',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '49',
                displayName: '获取当前网页内容',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    },
    {
        name: '0',
        displayName: '系统操作',
        icon: 'icon-xitongcaozuo',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                name: '51',
                displayName: '运行本地程序',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '70',
                displayName: '播放音频',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '94',
                displayName: '删除文件',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '50',
                displayName: '获取文件列表',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '45',
                displayName: '读取文本',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '44',
                displayName: '保存到文本',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '107',
                displayName: '设置剪切板内容',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '108',
                displayName: '获取剪切板文本',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '109',
                displayName: '清空剪切板',
                comment: '清空剪切板里的内容',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    },
    {
        name: '0',
        displayName: '流程控制',
        icon: 'icon-liuchengkongzhi',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                name: 'flowControls.if',
                displayName: 'IF条件',
                isControl: true,
                isControlEnd: false,
                comment:
                    '判断${operand1} ${operator} ${operand2} 是否成立，如果成立，则执行以下操作',
                inputs: {
                    operand1: {
                        name: '条件操作数1',
                        value: '',
                        type: 'string'
                    },
                    operator: {
                        name: '条件运算符',
                        value: '==',
                        display: '等于',
                        type: 'conditions'
                    },
                    operand2: {
                        name: '条件操作数2',
                        value: '',
                        type: 'string'
                    }
                },
                outputs: {}
            },
            {
                name: 'else',
                displayName: 'Else',
                comment: '否则执行以下操作',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: 'flowControls.if.end',
                displayName: 'End If',
                comment: '结束条件判断',
                isControl: false,
                isControlEnd: true,
                inputs: {},
                outputs: {}
            },
            {
                name: '54',
                displayName: 'For循环次数',
                isControl: true,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '9999',
                displayName: '循环结束标记',
                comment: '表示循环区域的尾部',
                isControl: false,
                isControlEnd: true,
                inputs: {},
                outputs: {}
            },
            {
                name: '111',
                displayName: 'While条件循环',
                isControl: true,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '55',
                displayName: '退出循环',
                comment: '仅在循环内生效',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '114',
                displayName: '继续循环',
                comment: '忽略本次循环,继续下一次循环',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '57',
                displayName: '终止流程',
                comment: '停止流程后续的所有操作并结束',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '93',
                displayName: '暂停流程',
                comment: '暂停当前流程。恢复流程需手动从页面上点击【恢复运行】',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    },
    {
        name: '0',
        displayName: '等待操作',
        icon: 'icon-dengdai',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                name: '20',
                displayName: '等待页面加载完成',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '53',
                displayName: '延迟等待',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '56',
                displayName: '等待元素',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    },
    {
        name: '0',
        displayName: 'Excel表格',
        icon: 'icon-excel',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                name: '81',
                displayName: '打开/新建Excel',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '82',
                displayName: '保存/另存为Excel',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '83',
                displayName: '关闭Excel',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '84',
                displayName: '循环Excel内容',
                isControl: true,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '9999',
                displayName: 'Excel循环结束标记',
                comment: '表示循环区域的尾部',
                isControl: false,
                isControlEnd: true,
                inputs: {},
                outputs: {}
            },
            {
                name: '85',
                displayName: '读取Excel内容',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '86',
                displayName: '写入内容至Excel',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '102',
                displayName: '读取Excel总行数',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    },
    {
        name: '0',
        displayName: '定时操作',
        icon: 'icon-dingshirenwu',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                name: '64',
                displayName: '定时器',
                isControl: true,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '9999',
                displayName: '定时器流程结束标记',
                comment: '表示定时器流程结束',
                isControl: false,
                isControlEnd: true,
                inputs: {},
                outputs: {}
            },
            {
                name: '65',
                displayName: '关闭定时器',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    },
    {
        name: '0',
        displayName: '数据处理',
        icon: 'icon-shujuchuli',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                name: '76',
                displayName: '打印日志',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '79',
                displayName: '产生随机数字',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '80',
                displayName: '产生随机字符串',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '67',
                displayName: '文本中提取数据',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '68',
                displayName: '获取当前时间',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '69',
                displayName: '数据转时间对象',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '73',
                displayName: '文本与JSON对象相互转换',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '74',
                displayName: '自定义变量数据',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '92',
                displayName: '文本操作',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '106',
                displayName: '追加新文本',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '110',
                displayName: 'Base64编解码',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    },
    {
        name: '0',
        displayName: '网络操作',
        icon: 'icon-wangluocaozuo',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                name: '77',
                displayName: 'http请求',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    },
    {
        name: '0',
        displayName: '对话框',
        icon: 'icon-duihuakuang',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                name: '101',
                displayName: '弹出输入对话框',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '103',
                displayName: '弹出选择文件对话框',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                name: '104',
                displayName: '弹出选择文件夹对话框',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    }
];

/**
 * 服务器加载的指令列表
 */

/**
 * 获取一个指令列表
 * @returns {Array}
 */
export function useDirective() {
    return directives;
}
