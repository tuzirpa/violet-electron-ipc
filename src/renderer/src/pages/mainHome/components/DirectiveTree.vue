<script setup lang="tsx">
import BtnTip from '@renderer/components/BtnTip.vue';
import { ElInput, ElTree } from 'element-plus';
import { ref, watch } from 'vue';

// 添加逻辑
interface Tree {
    paretObjName: string,
    paretObjIcon?: string,
    childenList?: Tree[],
    parentIndex?: number,
    task_id?: number,
    need_edit?: boolean,
    enable?: boolean,     // 是否启用
    sub_task?: boolean,   // 是否是子任务
    remark?: string,     // 备注
    endid?: number,
}

const handleNodeClick = (data: Tree) => {
    console.log(data)
}

const data: Tree[] = [
    {
        "paretObjName": "浏览器操作",
        "paretObjIcon": "icon-gugeliulanqi",
        "childenList": [
            {
                "paretObjName": "启动浏览器",
                "parentIndex": 0,
                "task_id": 9,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            }, {
                "paretObjName": "访问网页地址",
                "parentIndex": 0,
                "task_id": 2,
                "need_edit": true,
                "enable": true,
                "sub_task": false

            }, {
                "paretObjName": "创建新标签页",
                "parentIndex": 0,
                "task_id": 1,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "后退一步",
                "parentIndex": 0,
                "task_id": 3,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "前进一步",
                "parentIndex": 0,
                "task_id": 4,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "停止加载页面",
                "parentIndex": 0,
                "task_id": 5,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "刷新当前页面",
                "parentIndex": 0,
                "task_id": 6,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },

            {
                "paretObjName": "关闭当前网页窗口",
                "parentIndex": 0,
                "task_id": 7,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "关闭浏览器",
                "parentIndex": 0,
                "task_id": 8,
                "need_edit": false,
                "enable": true,
                "sub_task": false,
                "remark": "关闭浏览器进程"
            },
            {
                "paretObjName": "禁用/启用右键菜单",
                "parentIndex": 0,
                "task_id": 10,
                "need_edit": true,
                "enable": false,
                "sub_task": false
            },
            {
                "paretObjName": "禁用/启用显示图片",
                "parentIndex": 0,
                "task_id": 11,
                "need_edit": true,
                "enable": false,
                "sub_task": false
            },
            {
                "paretObjName": "允许/禁止弹出新窗口",
                "parentIndex": 0,
                "task_id": 95,
                "need_edit": true,
                "enable": false,
                "sub_task": false
            },
            {
                "paretObjName": "在新弹出网页上执行流程",
                "parentIndex": 0,
                "task_id": 96,
                "need_edit": true,
                "enable": false,
                "sub_task": true
            },
            {
                "paretObjName": "获取已打开标签页对象",
                "parentIndex": 0,
                "task_id": 97,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "自动点击处理JS弹窗",
                "parentIndex": 0,
                "task_id": 98,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            }
        ]
    },
    {
        "paretObjName": "鼠标操作",
        "paretObjIcon": "icon-shubiao",
        "childenList": [
            {
                "paretObjName": "启用鼠标移动轨迹",
                "parentIndex": 1,
                "task_id": 12,
                "need_edit": true,
                "enable": false,
                "sub_task": false
            },
            {
                "paretObjName": "获取元素坐标值",
                "parentIndex": 1,
                "task_id": 72,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "移动鼠标到指定位置",
                "parentIndex": 1,
                "task_id": 13,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "鼠标点击指定坐标位置",
                "parentIndex": 1,
                "task_id": 14,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "鼠标拖拽",
                "parentIndex": 1,
                "task_id": 71,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "在指定元素位置滚动鼠标滚轮",
                "parentIndex": 1,
                "task_id": 113,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            }
        ]
    },
    {
        "paretObjName": "元素操作",
        "paretObjIcon": "icon-yuansucaozuo",
        "childenList": [
            {
                "paretObjName": "获取元素属性值",
                "parentIndex": 2,
                "task_id": 16,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "判断指定的属性是否存在",
                "parentIndex": 2,
                "task_id": 17,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "点击元素",
                "parentIndex": 2,
                "task_id": 18,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "css选择器点击",
                "parentIndex": 2,
                "task_id": 19,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            }
            ,
            {
                "paretObjName": "获取相似元素个数",
                "parentIndex": 2,
                "task_id": 58,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "填写输入框",
                "parentIndex": 2,
                "task_id": 78,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "清空输入框",
                "parentIndex": 2,
                "task_id": 89,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "设置元素属性",
                "parentIndex": 2,
                "task_id": 90,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "删除元素属性",
                "parentIndex": 2,
                "task_id": 91,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "设置下拉框",
                "parentIndex": 2,
                "task_id": 99,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "设置复选框",
                "parentIndex": 2,
                "task_id": 112,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "用代码方式操作元素对象",
                "parentIndex": 2,
                "task_id": 100,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            }

        ]
    },
    {
        "paretObjName": "页面操作",
        "paretObjIcon": "icon-yemiancaozuo",
        "childenList": [

            {
                "paretObjName": "自动上下滚动页面",
                "parentIndex": 3,
                "task_id": 21,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "每次加载页面前执行js",
                "parentIndex": 3,
                "task_id": 22,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "每次加载页面后执行js",
                "parentIndex": 3,
                "task_id": 23,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "查找指定内容的相似个数",
                "parentIndex": 3,
                "task_id": 24,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "执行js代码",
                "parentIndex": 3,
                "task_id": 25,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "上传附件",
                "parentIndex": 3,
                "task_id": 26,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "下载文件",
                "parentIndex": 3,
                "task_id": 27,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "页面截图",
                "parentIndex": 3,
                "task_id": 28,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "保存网页到本地",
                "parentIndex": 3,
                "task_id": 29,
                "need_edit": true,
                "enable": false,
                "sub_task": false
            },
            {
                "paretObjName": "随机点击页面上的链接",
                "parentIndex": 3,
                "task_id": 30,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "滚动网页",
                "parentIndex": 3,
                "task_id": 15,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            }
        ]
    },
    {
        "paretObjName": "输入操作",
        "paretObjIcon": "icon-jianpan",
        "childenList": [
            {
                "paretObjName": "输入文字内容",
                "parentIndex": 4,
                "task_id": 31,
                "need_edit": true,
                "enable": false,
                "sub_task": false
            },
            {
                "paretObjName": "输入文字内容",
                "parentIndex": 4,
                "task_id": 59,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "发送键盘消息",
                "parentIndex": 4,
                "task_id": 32,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            }
        ]
    },
    {
        "paretObjName": "网页设置",
        "paretObjIcon": "icon-wangyeshezhi",
        "childenList": [
            {
                "paretObjName": "设置cookie",
                "parentIndex": 5,
                "task_id": 33,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "清除所有的cookie",
                "parentIndex": 5,
                "task_id": 34,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "设置代理",
                "parentIndex": 5,
                "task_id": 35,
                "need_edit": true,
                "enable": false,
                "sub_task": false
            },
            {
                "paretObjName": "清除浏览器的代理",
                "parentIndex": 5,
                "task_id": 36,
                "need_edit": false,
                "enable": false,
                "sub_task": false
            },
            {
                "paretObjName": "设置UserAgent",
                "parentIndex": 5,
                "task_id": 37,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "设置屏幕尺寸大小",
                "parentIndex": 5,
                "task_id": 38,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "启用触屏模式",
                "parentIndex": 5,
                "task_id": 39,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "设置GPS(经纬度)",
                "parentIndex": 5,
                "task_id": 40,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "设置陀螺仪",
                "parentIndex": 5,
                "task_id": 41,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            }
        ]
    },
    {
        "paretObjName": "数据过滤与监听",
        "paretObjIcon": "icon-shujuguolv",
        "childenList": [
            {
                "paretObjName": "重定向URL地址",
                "parentIndex": 6,
                "task_id": 42,
                "need_edit": true,
                "enable": false,
                "sub_task": false
            },
            {
                "paretObjName": "监听网页请求与结果",
                "parentIndex": 6,
                "task_id": 43,
                "need_edit": true,
                "enable": true,
                "sub_task": false,
                "endid": 2
            },
            {
                "paretObjName": "停止监听网页",
                "parentIndex": 6,
                "task_id": 75,
                "need_edit": true,
                "enable": true,
                "sub_task": false,
                "remark": "结束抓取网页中的请求信息"
            },
            {
                "paretObjName": "等待监听到数据",
                "parentIndex": 6,
                "task_id": 87,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "清空监听到数据",
                "parentIndex": 6,
                "task_id": 88,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            }

        ]
    },
    {
        "paretObjName": "数据操作",
        "paretObjIcon": "icon-shujucaozuo",
        "childenList": [
            {
                "paretObjName": "获取当前网址",
                "parentIndex": 7,
                "task_id": 46,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "获取网页标题",
                "parentIndex": 7,
                "task_id": 47,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "获取cookie",
                "parentIndex": 7,
                "task_id": 48,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "获取当前网页内容",
                "parentIndex": 7,
                "task_id": 49,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            }
        ]
    },
    {
        "paretObjName": "系统操作",
        "paretObjIcon": "icon-xitongcaozuo",
        "childenList": [
            {
                "paretObjName": "运行本地程序",
                "parentIndex": 8,
                "task_id": 51,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "播放音频",
                "parentIndex": 8,
                "task_id": 70,
                "need_edit": true,
                "enable": false,
                "sub_task": false
            },
            {
                "paretObjName": "删除文件",
                "parentIndex": 8,
                "task_id": 94,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "获取文件列表",
                "parentIndex": 8,
                "task_id": 50,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "读取文本",
                "parentIndex": 8,
                "task_id": 45,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "保存到文本",
                "parentIndex": 8,
                "task_id": 44,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "设置剪切板内容",
                "parentIndex": 8,
                "task_id": 107,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "获取剪切板文本",
                "parentIndex": 8,
                "task_id": 108,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "清空剪切板",
                "parentIndex": 8,
                "task_id": 109,
                "need_edit": false,
                "enable": true,
                "sub_task": false,
                "remark": "清空剪切板里的内容"
            }
        ]
    },
    {
        "paretObjName": "流程控制",
        "paretObjIcon": "icon-liuchengkongzhi",
        "childenList": [
            {
                "paretObjName": "IF条件",
                "parentIndex": 9,
                "task_id": 52,
                "need_edit": true,
                "enable": true,
                "sub_task": true,
                "endid": 2
            }, {
                "paretObjName": "Else",
                "parentIndex": 9,
                "task_id": 105,
                "need_edit": false,
                "enable": true,
                "sub_task": false,
                "remark": "否则执行以下操作"
            },
            {
                "paretObjName": "End If",
                "parentIndex": 9,
                "task_id": 9999,
                "need_edit": false,
                "enable": true,
                "sub_task": false,
                "remark": "结束条件判断"
            },
            {
                "paretObjName": "For循环次数",
                "parentIndex": 9,
                "task_id": 54,
                "need_edit": true,
                "enable": true,
                "sub_task": true,
                "endid": 4
            },
            {
                "paretObjName": "循环结束标记",
                "parentIndex": 9,
                "task_id": 9999,
                "need_edit": false,
                "enable": true,
                "sub_task": false,
                "remark": "表示循环区域的尾部"
            },
            {
                "paretObjName": "While条件循环",
                "parentIndex": 9,
                "task_id": 111,
                "need_edit": true,
                "enable": true,
                "sub_task": true,
                "endid": 4
            },
            {
                "paretObjName": "退出循环",
                "parentIndex": 9,
                "task_id": 55,
                "need_edit": false,
                "enable": true,
                "sub_task": false,
                "remark": "仅在循环内生效"
            },
            {
                "paretObjName": "继续循环",
                "parentIndex": 9,
                "task_id": 114,
                "need_edit": false,
                "enable": true,
                "sub_task": false,
                "remark": "忽略本次循环,继续下一次循环"
            },
            {
                "paretObjName": "终止流程",
                "parentIndex": 9,
                "task_id": 57,
                "need_edit": false,
                "enable": true,
                "sub_task": false,
                "remark": "停止流程后续的所有操作并结束"
            },
            {
                "paretObjName": "暂停流程",
                "parentIndex": 9,
                "task_id": 93,
                "need_edit": false,
                "enable": true,
                "sub_task": false,
                "remark": "暂停当前流程。恢复流程需手动从页面上点击【恢复运行】"
            }
        ]
    },
    {
        "paretObjName": "等待操作",
        "paretObjIcon": "icon-dengdai",
        "childenList": [
            {
                "paretObjName": "等待页面加载完成",
                "parentIndex": 10,
                "task_id": 20,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "延迟等待",
                "parentIndex": 10,
                "task_id": 53,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "等待元素",
                "parentIndex": 10,
                "task_id": 56,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            }
        ]
    },
    {
        "paretObjName": "Excel表格",
        "paretObjIcon": "icon-excel",
        "childenList": [
            {
                "paretObjName": "打开/新建Excel",
                "parentIndex": 11,
                "task_id": 81,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "保存/另存为Excel",
                "parentIndex": 11,
                "task_id": 82,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "关闭Excel",
                "parentIndex": 11,
                "task_id": 83,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "循环Excel内容",
                "parentIndex": 11,
                "task_id": 84,
                "need_edit": true,
                "enable": true,
                "sub_task": true,
                "endid": 4
            },
            {
                "paretObjName": "Excel循环结束标记",
                "parentIndex": 11,
                "task_id": 9999,
                "need_edit": false,
                "enable": true,
                "sub_task": false,
                "remark": "表示循环区域的尾部"
            },

            {
                "paretObjName": "读取Excel内容",
                "parentIndex": 11,
                "task_id": 85,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "写入内容至Excel",
                "parentIndex": 11,
                "task_id": 86,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "读取Excel总行数",
                "parentIndex": 11,
                "task_id": 102,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            }

        ]
    },
    {
        "paretObjName": "定时操作",
        "paretObjIcon": "icon-dingshirenwu",
        "childenList": [
            {
                "paretObjName": "定时器",
                "parentIndex": 12,
                "task_id": 64,
                "need_edit": true,
                "enable": true,
                "sub_task": true,
                "endid": 1
            },
            {
                "paretObjName": "定时器流程结束标记",
                "parentIndex": 12,
                "task_id": 9999,
                "need_edit": false,
                "enable": true,
                "sub_task": false,
                "remark": "表示定时器流程结束"
            },
            {
                "paretObjName": "关闭定时器",
                "parentIndex": 12,
                "task_id": 65,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            }
        ]
    },
    {
        "paretObjName": "数据处理",
        "paretObjIcon": "icon-shujuchuli",
        "childenList": [
            {
                "paretObjName": "打印日志",
                "parentIndex": 13,
                "task_id": 76,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "产生随机数字",
                "parentIndex": 13,
                "task_id": 79,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "产生随机字符串",
                "parentIndex": 13,
                "task_id": 80,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "文本中提取数据",
                "parentIndex": 13,
                "task_id": 67,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "获取当前时间",
                "parentIndex": 13,
                "task_id": 68,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "数据转时间对象",
                "parentIndex": 13,
                "task_id": 69,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "文本与JSON对象相互转换",
                "parentIndex": 13,
                "task_id": 73,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "自定义变量数据",
                "parentIndex": 13,
                "task_id": 74,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "文本操作",
                "parentIndex": 13,
                "task_id": 92,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "追加新文本",
                "parentIndex": 13,
                "task_id": 106,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            },
            {
                "paretObjName": "Base64编解码",
                "parentIndex": 13,
                "task_id": 110,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            }

        ]
    },
    {
        "paretObjName": "网络操作",
        "paretObjIcon": "icon-wangluocaozuo",
        "childenList": [
            {
                "paretObjName": "http请求",
                "parentIndex": 14,
                "task_id": 77,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            }

        ]
    },
    {
        "paretObjName": "对话框",
        "paretObjIcon": "icon-duihuakuang",
        "childenList": [
            {
                "paretObjName": "弹出输入对话框",
                "parentIndex": 15,
                "task_id": 101,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            }, {
                "paretObjName": "弹出选择文件对话框",
                "parentIndex": 15,
                "task_id": 103,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            }, {
                "paretObjName": "弹出选择文件夹对话框",
                "parentIndex": 15,
                "task_id": 104,
                "need_edit": true,
                "enable": true,
                "sub_task": false
            }

        ]
    }
]

const defaultProps = {
    children: 'childenList',
    label: 'paretObjName',
}

const searchValue = ref('');
const searchIcon = <i class="iconfont icon-sousuo"></i>

const treeRef = ref<InstanceType<typeof ElTree>>()

watch(searchValue, (val) => {
    treeRef.value!.filter(val)
})
const filterNode = (value: string, data: Tree, _node: Node) => {
    if (!value) return true
    return data.paretObjName.includes(value)
}

</script>

<template>
    <div class="tree-container viewbox text-xs font-sans">
        <div class="px-2 py-1 viewbox gap-4">
            <div class="header flex justify-between items-center mt-2 gap-1">
                <div class="w-8 font-bold text-sm">指令</div>
                <div class="flex-1">
                    <ElInput class="h-6 overflow-hidden" :prefix-icon="searchIcon" v-model="searchValue" placeholder="搜索指令"
                        clearable />
                </div>
                <BtnTip :icon="'icon-zhankai'" text="展开全部指令" class="px-0.5 py-0.5 text-xs text-gray-400" />
                <BtnTip :icon="'icon-fanhui'" text="隐藏" class="px-0.5 p-0.5 text-xs text-gray-400" />
            </div>
            <div class="wrapbox">
                <el-tree ref="treeRef" style="--el-tree-node-content-height:34px;" :data="data" :props="defaultProps"
                    @node-click="handleNodeClick" :filter-node-method="filterNode">
                    <template #default="{ data }">
                        <div class="tree-node py-2 flex items-center gap-1 align-middle">
                            <i class="iconfont text-xl" :class="data.paretObjIcon"></i>
                            <span>{{ data.paretObjName }}</span>
                        </div>
                    </template>
                </el-tree>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
// 添加样式

:deep(.el-tree-node__label) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

:deep(.el-tree-node) {
    border-radius: 6px;
    overflow: hidden;
}
</style>
