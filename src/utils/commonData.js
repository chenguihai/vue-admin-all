import area from '@/utils/area';

export const statusList = [
    { label: "全部", value: '' },
    { label: "待审核", value: 0 },
    { label: "已通过", value: 1 },
    { label: "未通过", value: -1 }
];
export const examineStatus = [ //审核状态：0 待审核，1 已通过，2 未通过
    { label: "全部", value: '' },
    { label: "待审核", value: 0 },
    { label: "已通过", value: 1 },
    { label: "未通过", value: 2 }
];
export const examineData = [ //审核状态：0 待审核，1 已通过，2 未通过
    { name: '待审核', type: 'info' },
    { name: '已通过', type: 'success' },
    { name: '未通过', type: 'danger' },
];

export const payStatusD = [ //审核状态：1 待签署，2 待付款，3 已完成
    { label: "全部", value: '' },
    { label: "待签署", value: 1 },
    { label: "待付款", value: 2 },
    { label: "已完成", value: 3 }
];
export const shelfForm = [
    { label: "全部", value: "" },
    { label: "已下架", value: 0 },
    { label: "已上架", value: 1 }
];

export const aptitudeType = [ //资质类型：0 直营 1 一级代理 2 二级代理 3 其他
    {
        label: "全部",
        value: ''
    },
    {
        label: "直营媒体",
        value: 0
    },
    {
        label: "一级代理",
        value: 1
    },
    {
        label: "二级代理",
        value: 2
    },
    {
        label: "其他",
        value: 3
    }
];

export const proveWays = [{
        label: "全部",
        value: ''
    },
    {
        label: "营业执照+工牌",
        value: 1
    },
    {
        label: "营业执照+名片",
        value: 2
    }
];
// 开启状态：1开，0关
export const openState = [{
        label: "全部",
        value: ''
    },
    {
        label: "未开启",
        value: 0
    },
    {
        label: "开启",
        value: 1
    }
];
// 模板类型：1 线索模板，2 任务模板
export const templateType = [{
        label: "全部",
        value: ''
    },
    {
        label: "线索模板",
        value: 1
    },
    {
        label: "任务模板",
        value: 2
    }
];
//	订单退款  状态： 0 待处理,1 已退款,2 已拒绝,3 已取消
export const refundStatus = [{
        label: "全部",
        value: ''
    },
    {
        label: "待处理",
        value: 0
    },
    {
        label: "已退款",
        value: 1
    },
    {
        label: "已拒绝",
        value: 2
    },
    {
        label: "已取消",
        value: 3
    },
];
//评价等级：1 好评 2 中评 3 差评
export const evaluateGrades = [{
        label: "全部",
        value: ''
    },
    {
        label: "好评",
        value: 1
    },
    {
        label: "中评",
        value: 2
    },
    {
        label: "差评",
        value: 3
    }
];
// 订单状态:1 待托管,2 待接单,3 待签署,4 工作中,5 待验收,6 待评价,7 已成交,8 已冻结,9 未成交
export const orderStatus = ['全部', '待托管', '待接单', '待签署', '工作中', '待验收', '待评价', '已成交', '已冻结', '未成交'];

export const orderList = [ //订单状态：0 待支付，1 已成交
    { label: "全部", value: '' },
    { label: "待支付", value: 0 },
    { label: "已成交", value: 1 },
]
export const orderStatusList = [ //订单状态：0 待支付，1 已成交 2 未成交
    { label: "全部", value: '' },
    { label: "待支付", value: 0 },
    { label: "已成交", value: 1 },
    { label: "未成交", value: 2 },
]
export const transactionList = [
    { label: "全部", value: '' },
    { label: "待支付", value: 1 },
    { label: "已成交", value: 2 },
    { label: "未成交", value: 3 },
]

export const payList = [ // "pay_status": 0 待支付，1 已成交，2 未成交，3 已失效
    { label: "全部", value: '' },
    { label: "待支付", value: 0 },
    { label: "已成交", value: 1 },
    { label: "未成交", value: 2 },
    { label: "已失效", value: 3 },
]
export const lastTypeList = [ //	int	1 图片，2 视频
    { label: "全部", value: '' },
    { label: "图片", value: 1 },
    { label: "视频", value: 2 },
]
export const reportState = [ //处理状态：0 待审核，1 举报通过，2 举报失败
    { label: "全部", value: '' },
    { label: "待审核", value: 0 },
    { label: "举报通过", value: 1 },
    { label: "举报失败", value: 2 },
]
export const levelState = [ //级别 1 省，2 市，3 区/县
    { label: "全部", value: '' },
    { label: "省", value: 1 },
    { label: "市", value: 2 },
    { label: "区/县", value: 3 },
]

export const isShow = [{
        label: "全部",
        value: ''
    },
    {
        label: "不显示",
        value: 0
    },
    {
        label: "显示",
        value: 1
    },
]
export const timeObject = [
    { label: '今日', value: 'today' },
    { label: '昨日', value: 'tomorrow' },
    { label: '最近7天', value: 'week' },
    { label: '最近30天', value: 'month' }
]
export const cateData = [
    { label: "首页导航栏左侧", value: 1 },
    { label: "首页导航栏右侧", value: 2 },
    { label: "不显示", value: 0 }
]
export const BankList = ["招商银行", "农村商业银行", "工商银行"]

export function duplicateRemoval(value) {
    if (!value) {
        return ''
    }
    return Array.from(new Set(value.replace(/\s/g, '').split('|'))).join('|')
}

export function returnAddress(data = {}) {
    let areaList = JSON.parse(JSON.stringify(area))
    areaList.shift();
    let item = [],
        subItem = [];
    for (let i = 0; i < areaList.length; i++) {
        if (data.bl_province == areaList[i].id) {
            item = areaList[i].child || [];
            for (let j = 0; j < item.length; j++) {
                if (data.bl_city == item[j].id) {
                    subItem = item[j].child || [];
                    for (let k = 0; k < subItem.length; k++) {
                        if (data.bl_district == subItem[k].id) {
                            data.addressName = areaList[i].name + item[j].name + subItem[k].name;
                            return data;
                        }
                    }
                }
            }
        }
    }
    data.addressName = '';
    return data;
}

export const development = process.env.NODE_ENV === 'production'; // 环境
export const devAlyUrl = 'http://ltzm1.oss-cn-shenzhen.aliyuncs.com/';
export const proAlyUrl = 'https://img.ltzm66.com/';

export const imgUrl = development ? proAlyUrl : devAlyUrl;
export const uploadUrl = process.env.BASE_API + "/uploadImage";
export const upVideoUrl = process.env.BASE_API + "/uploadVideo";