import { DirectiveTree } from '@renderer/types/DirectiveTree';
import { ref } from 'vue';
const directives = ref<DirectiveTree[]>([]);

//网络加载数据
directives.value = [
    {
        id: '0',
        name: '浏览器操作',
        icon: 'icon-gugeliulanqi',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                id: '9',
                name: '启动浏览器',
                isControl: false,
                isControlEnd: false,
                comment: '启动${webType},保存至：${browser}',
                inputs: {
                    webType: {
                        name: '',
                        label: '浏览器类型',
                        value: '内置浏览器',
                        type: '',
                        required: true
                    }
                },
                outputs: {
                    browser: {
                        name: 'web_page',
                        type: 'chrome',
                        required: false
                    }
                }
            },
            {
                id: '2',
                name: '访问网页地址',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '1',
                name: '创建新标签页',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '3',
                name: '后退一步',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '4',
                name: '前进一步',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '5',
                name: '停止加载页面',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '6',
                name: '刷新当前页面',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '7',
                name: '关闭当前网页窗口',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '8',
                name: '关闭浏览器',
                comment: '关闭浏览器进程',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '10',
                name: '禁用/启用右键菜单',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '11',
                name: '禁用/启用显示图片',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '95',
                name: '允许/禁止弹出新窗口',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '96',
                name: '在新弹出网页上执行流程',
                isControl: true,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '97',
                name: '获取已打开标签页对象',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '98',
                name: '自动点击处理JS弹窗',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    },
    {
        id: '0',
        name: '鼠标操作',
        icon: 'icon-shubiao',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                id: '12',
                name: '启用鼠标移动轨迹',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '72',
                name: '获取元素坐标值',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '13',
                name: '移动鼠标到指定位置',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '14',
                name: '鼠标点击指定坐标位置',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '71',
                name: '鼠标拖拽',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '113',
                name: '在指定元素位置滚动鼠标滚轮',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    },
    {
        id: '0',
        name: '元素操作',
        icon: 'icon-yuansucaozuo',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                id: '16',
                name: '获取元素属性值',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '17',
                name: '判断指定的属性是否存在',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '18',
                name: '点击元素',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '19',
                name: 'css选择器点击',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '58',
                name: '获取相似元素个数',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '78',
                name: '填写输入框',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '89',
                name: '清空输入框',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '90',
                name: '设置元素属性',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '91',
                name: '删除元素属性',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '99',
                name: '设置下拉框',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '112',
                name: '设置复选框',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '100',
                name: '用代码方式操作元素对象',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    },
    {
        id: '0',
        name: '页面操作',
        icon: 'icon-yemiancaozuo',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                id: '21',
                name: '自动上下滚动页面',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '22',
                name: '每次加载页面前执行js',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '23',
                name: '每次加载页面后执行js',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '24',
                name: '查找指定内容的相似个数',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '25',
                name: '执行js代码',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '26',
                name: '上传附件',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '27',
                name: '下载文件',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '28',
                name: '页面截图',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '29',
                name: '保存网页到本地',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '30',
                name: '随机点击页面上的链接',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '15',
                name: '滚动网页',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    },
    {
        id: '0',
        name: '输入操作',
        icon: 'icon-jianpan',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                id: '31',
                name: '输入文字内容',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '59',
                name: '输入文字内容',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '32',
                name: '发送键盘消息',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    },
    {
        id: '0',
        name: '网页设置',
        icon: 'icon-wangyeshezhi',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                id: '33',
                name: '设置cookie',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '34',
                name: '清除所有的cookie',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '35',
                name: '设置代理',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '36',
                name: '清除浏览器的代理',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '37',
                name: '设置UserAgent',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '38',
                name: '设置屏幕尺寸大小',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '39',
                name: '启用触屏模式',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '40',
                name: '设置GPS(经纬度)',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '41',
                name: '设置陀螺仪',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    },
    {
        id: '0',
        name: '数据过滤与监听',
        icon: 'icon-shujuguolv',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                id: '42',
                name: '重定向URL地址',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '43',
                name: '监听网页请求与结果',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '75',
                name: '停止监听网页',
                comment: '结束抓取网页中的请求信息',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '87',
                name: '等待监听到数据',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '88',
                name: '清空监听到数据',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    },
    {
        id: '0',
        name: '数据操作',
        icon: 'icon-shujucaozuo',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                id: '46',
                name: '获取当前网址',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '47',
                name: '获取网页标题',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '48',
                name: '获取cookie',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '49',
                name: '获取当前网页内容',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    },
    {
        id: '0',
        name: '系统操作',
        icon: 'icon-xitongcaozuo',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                id: '51',
                name: '运行本地程序',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '70',
                name: '播放音频',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '94',
                name: '删除文件',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '50',
                name: '获取文件列表',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '45',
                name: '读取文本',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '44',
                name: '保存到文本',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '107',
                name: '设置剪切板内容',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '108',
                name: '获取剪切板文本',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '109',
                name: '清空剪切板',
                comment: '清空剪切板里的内容',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    },
    {
        id: '0',
        name: '流程控制',
        icon: 'icon-liuchengkongzhi',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                id: '52',
                name: 'IF条件',
                isControl: true,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '105',
                name: 'Else',
                comment: '否则执行以下操作',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '9999',
                name: 'End If',
                comment: '结束条件判断',
                isControl: false,
                isControlEnd: true,
                inputs: {},
                outputs: {}
            },
            {
                id: '54',
                name: 'For循环次数',
                isControl: true,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '9999',
                name: '循环结束标记',
                comment: '表示循环区域的尾部',
                isControl: false,
                isControlEnd: true,
                inputs: {},
                outputs: {}
            },
            {
                id: '111',
                name: 'While条件循环',
                isControl: true,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '55',
                name: '退出循环',
                comment: '仅在循环内生效',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '114',
                name: '继续循环',
                comment: '忽略本次循环,继续下一次循环',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '57',
                name: '终止流程',
                comment: '停止流程后续的所有操作并结束',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '93',
                name: '暂停流程',
                comment: '暂停当前流程。恢复流程需手动从页面上点击【恢复运行】',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    },
    {
        id: '0',
        name: '等待操作',
        icon: 'icon-dengdai',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                id: '20',
                name: '等待页面加载完成',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '53',
                name: '延迟等待',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '56',
                name: '等待元素',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    },
    {
        id: '0',
        name: 'Excel表格',
        icon: 'icon-excel',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                id: '81',
                name: '打开/新建Excel',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '82',
                name: '保存/另存为Excel',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '83',
                name: '关闭Excel',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '84',
                name: '循环Excel内容',
                isControl: true,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '9999',
                name: 'Excel循环结束标记',
                comment: '表示循环区域的尾部',
                isControl: false,
                isControlEnd: true,
                inputs: {},
                outputs: {}
            },
            {
                id: '85',
                name: '读取Excel内容',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '86',
                name: '写入内容至Excel',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '102',
                name: '读取Excel总行数',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    },
    {
        id: '0',
        name: '定时操作',
        icon: 'icon-dingshirenwu',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                id: '64',
                name: '定时器',
                isControl: true,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '9999',
                name: '定时器流程结束标记',
                comment: '表示定时器流程结束',
                isControl: false,
                isControlEnd: true,
                inputs: {},
                outputs: {}
            },
            {
                id: '65',
                name: '关闭定时器',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    },
    {
        id: '0',
        name: '数据处理',
        icon: 'icon-shujuchuli',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                id: '76',
                name: '打印日志',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '79',
                name: '产生随机数字',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '80',
                name: '产生随机字符串',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '67',
                name: '文本中提取数据',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '68',
                name: '获取当前时间',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '69',
                name: '数据转时间对象',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '73',
                name: '文本与JSON对象相互转换',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '74',
                name: '自定义变量数据',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '92',
                name: '文本操作',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '106',
                name: '追加新文本',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '110',
                name: 'Base64编解码',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    },
    {
        id: '0',
        name: '网络操作',
        icon: 'icon-wangluocaozuo',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                id: '77',
                name: 'http请求',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    },
    {
        id: '0',
        name: '对话框',
        icon: 'icon-duihuakuang',
        isControlEnd: false,
        inputs: {},
        outputs: {},
        children: [
            {
                id: '101',
                name: '弹出输入对话框',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '103',
                name: '弹出选择文件对话框',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            },
            {
                id: '104',
                name: '弹出选择文件夹对话框',
                isControl: false,
                isControlEnd: false,
                inputs: {},
                outputs: {}
            }
        ]
    }
];

/**
 * 获取一个指令列表
 * @returns {Array}
 */
export function useDirective() {
    return directives;
}
