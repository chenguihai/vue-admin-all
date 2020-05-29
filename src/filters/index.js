import { imgUrl } from '@/utils/commonData'

export function orderStatus(type) { //订单状态 0: "待支付", 1: "已成交" 2 '已关闭' 3 '未成交'
    let name = ''
    switch (type) {
        case 0:
        case 'N':
            name = '待支付'
            break
        case 1:
        case 'Y':
            name = '已成交'
            break
        case 2:
            name = '已关闭';
            break;
        case 3:
        case 'L':
            name = '未成交';
            break;
    }
    return name
}

export function payStatusF(type) { // "pay_status": 0 待支付，1 已成交，2 未成交，3 已失效
    let name = ''
    switch (type) {
        case 0:
            name = '待支付'
            break
        case 1:
            name = '已成交'
            break
        case 2:
            name = '未成交';
            break;
        case 3:
            name = '已失效';
            break;
    }
    return name
}

export function orderStatusF(type) { //订单状态：1 待支付，2 已成交，3 未成交
    let name = ''
    switch (type) {
        case 1:
            name = '待支付'
            break
        case 2:
            name = '已成交'
            break
        case 3:
            name = '未成交';
            break;
    }
    return name
}

export function toolName(type) { //工具名称 	1 会员升级 2 技能类目 3 店铺装修
    let name = ''
    switch (type) {
        case 1:
            name = '会员升级'
            break
        case 2:
            name = '技能类目'
            break
        case 3:
            name = '店铺装修'
            break
    }
    return name
}

export function lastTypeF(type) { //上刊画面类型 int 1 图片，2 视频
    let name = ''
    switch (type) {
        case 1:
            name = '图片'
            break
        case 2:
            name = '视频'
            break
    }
    return name
}

export function invoiceType(type) { //	int	发票类型：1 普通，2 增值税
    let name = ''
    switch (type) {
        case 1:
            name = '增值税普通发票'
            break
        case 2:
            name = '增值税专用发票'
            break
    }
    return name
}

export function invoiceStatus(type) { //	int	发票状态：0 待开票，1 已开票
    let name = ''
    switch (type) {
        case 0:
            name = '待开票'
            break
        case 1:
            name = '已开票'
            break
    }
    return name
}

export function proveWay(type) { //证明方式：1 营业执照+工牌 2 营业执照+名片
    let name = ''
    switch (type) {
        case 1:
            name = '营业执照+工牌'
            break
        case 2:
            name = '营业执照+名片'
            break
    }
    return name
}

export function auditStatus(type) { //审核状态：0 待审核 1 已通过 -1 未通过 -2 店铺关闭
    let name = ''
    switch (type) {
        case 0:
            name = '待审核'
            break
        case 1:
            name = '已通过'
            break
        case -1:
            name = '未通过'
            break
        case -2:
            name = '店铺关闭'
            break
    }
    return name
}

export function auditList(type) { //审核状态：0 待审核 1 已通过 2 未通过
    let name = ''
    switch (type) {
        case 0:
            name = '待审核'
            break
        case 1:
            name = '已通过'
            break
        case 2:
            name = '未通过'
            break
    }
    return name
}

export function auditStatusLetter(type) { //审核状态：N 待审核 Y 不通过 S 通过
    let name = ''
    switch (type) {
        case 'N':
            name = '待审核'
            break
        case "Y":
            name = '未通过'
            break
        case "S":
            name = '已通过'
            break
    }
    return name
}

export function reportState(type) { //处理状态：0待审核，1 举报通过，2 举报失败
    let name = ''
    switch (type) {
        case 0:
            name = '待审核'
            break
        case 1:
            name = '举报通过'
            break
        case 2:
            name = '举报失败'
            break
    }
    return name
}

export function tagType(type) { //tag 类型 ：0 info  1 success -1 danger
    let name = 'info'
    switch (type) {
        case 0:
        case 'N':
            name = 'info';
            break;
        case 1:
        case 'S':
            name = 'success';
            break;
        case -1:
        case 2:
        case 'Y':
            name = 'danger';
            break;
    }
    return name
}

export function paymentMethod(type) { //	支付方式：1 支付宝,2 微信, 3 线下, 4 余额
    let name = ''
    let types = +type;
    switch (types) {
        case 1:
            name = '支付宝'
            break
        case 2:
            name = '微信'
            break
        case 3:
            name = '线下'
            break
        case 4:
            name = '余额'
            break
    }
    return name
}

export function aptitudeType(type) { //资质类型：0 直营媒体 1 一级代理 2 二级代理 3 其他
    let name = ''
    switch (type) {
        case 0:
            name = '直营媒体'
            break
        case 1:
            name = '一级代理'
            break
        case 2:
            name = '二级代理'
            break
        case 3:
            name = '其他'
            break

    }
    return name
}

export function templateType(type) { // 模板类型：1 线索模板，2 任务模板
    let name = ''
    switch (type) {
        case 1:
            name = '线索模板'
            break
        case 2:
            name = '任务模板'
            break
    }
    return name
}

export function serviceStatus(type) { ////订单状态：1 待托管,2 待接单,3 待签署,4 工作中,5 待验收,6 待评价,7 已成交,8 已冻结,9 未成交
    let data = ['', '待托管', '待接单', '待签署', '工作中', '待验收', '待评价', '已成交', '已冻结', '未成交']
    return data[type]
}

export function hotWordF(type) {
    let data = ['', '服务', '店铺', '线索', '任务', '其他']
    return data[type]
}

export function paymentStatusF(type) { //代付处理状态：1 待签署，2 待付款，3 已完成
    let data = ['', '待签署', '待付款', '已完成']
    return data[type]
}

export function settleTypeF(type) { //    "settle_type": 1 凌天众媒代付
    let data = ['', '凌天众媒代付']
    return data[type]
}

export function evaluateGrade(type) { //评价等级：1 好评 2 中评 3 差评
    let name = ''
    switch (type) {
        case 1:
            name = '好评'
            break
        case 2:
            name = '中评'
            break
        case 3:
            name = '差评'
            break
    }
    return name
}

export function isShow(type) { //是否显示：0 不显示 1 显示
    let name = ''
    switch (type) {
        case 0:
            name = '不显示'
            break
        case 1:
            name = '显示'
            break
    }
    return name
}

export function isArranged(type) { //是否客服包办：N 否 Y 是
    let name = '否'
    switch (type) {
        case 'N':
        case 2:
            name = '否'
            break
        case "Y":
        case 1:
            name = '是'
            break
    }
    return name
}

export function isArrangedTag(type) { //是否客服包办：N 否 Y 是
    let name = 'danger'
    switch (type) {
        case 'N':
            name = 'danger';
            break;
        case "Y":
            name = 'success';
            break;
    }
    return name
}

export function clueStatus(type) { //线索状态：N:已关闭,Y:未关闭
    let name = ''
    switch (type) {
        case 'N':
            name = '已关闭'
            break
        case "Y":
            name = '未关闭'
            break
    }
    return name
}

export function refundStatus(type) { //	订单退款  状态：0 待处理,1 已退款,2 已拒绝,3 已取消
    let name = ''
    switch (type) {
        case 0:
            name = '待处理'
            break
        case 1:
            name = '已退款'
            break
        case 2:
            name = '已拒绝'
            break
        case 3:
            name = '已取消'
            break
    }
    return name
}

export function orderType(type) { //1 购买服务 2 投标任务
    let name = ''
    switch (type) {
        case 1:
            name = '购买服务'
            break
        case 2:
            name = '投标任务'
            break
    }
    return name
}

export function transactionType(type) { //交易类型：1 缴纳 -1 退还 -2 扣除
    let name = ''
    switch (type) {
        case 1:
            name = '缴纳'
            break
        case -1:
            name = '退还'
            break
        case -2:
            name = '扣除'
            break
    }
    return name
}

export function settleType(type) { //	结算类型：1 服务订单，2 任务订单，3 案例订单，4 传记订单，5 上刊画面订单
    let name = ''
    switch (type) {
        case 1:
            name = '服务订单'
            break
        case 2:
            name = '任务订单'
            break
        case 3:
            name = '案例订单'
            break
        case 4:
            name = '传记订单'
            break
        case 5:
            name = '上刊画面订单'
            break
    }
    return name
}

export function incomeType(type) { //	收入类型：1 技术服务费 2 广告线索销售 3 增值服务销售 4 工具销售
    let name = ''
    switch (type) {
        case 1:
            name = '技术服务费'
            break
        case 2:
            name = '广告线索销售'
            break
        case 3:
            name = '增值服务销售'
            break
        case 4:
            name = '工具销售'
            break
    }
    return name
}

export function cashOutType(type) { //提现类型：1 余额 2 保证金 3 代付
    let name = ''
    switch (type) {
        case 1:
            name = '余额'
            break
        case 2:
            name = '保证金'
            break
        case 3:
            name = '代付'
            break
    }
    return name
}

export function levelTypeF(type) { //级别：0 中国；1 省；2 市；3 区/县
    let name = ''
    switch (type) {
        case 0:
            name = '中国'
            break
        case 1:
            name = '省'
            break
        case 2:
            name = '市'
            break
        case 3:
            name = '区/县'
            break
    }
    return name
}

export function examineStatus(type) { //审核状态：1 待审核,2 审核失败,3 打款中,4 已提现
    let name = ''
    switch (type) {
        case 1:
            name = '待审核'
            break
        case 2:
            name = '审核失败'
            break
        case 3:
            name = '打款中'
            break
        case 4:
            name = '已提现'
            break
    }
    return name
}

export function reasonTypeF(type) { ////原因类型：1 用户申请退款，2 用户关闭需求，3 服务商放弃订单，4 用户取消订单
    let name = ''
    switch (type) {
        case 1:
            name = '用户申请退款'
            break
        case 2:
            name = '用户关闭需求'
            break
        case 3:
            name = '服务商放弃订单'
            break
        case 4:
            name = '用户取消订单'
            break
    }
    return name
}

export function statusFilter(status) {
    const statuses = {
        '0': '不显示',
        '1': '左侧',
        '2': '右侧',
    }
    return statuses[status]
};

export function floorFilter(status) {
    const statuses = {
        '0': '不显示',
        '1': '显示',
    }
    return statuses[status]
};

export function completePicture(url) { //拼接图片前缀
    return url ? imgUrl + url + '?x-oss-process=image/resize,m_fill,h_60,w_100' : ''
}

export function brandPicture(url) { //拼接图片前缀
    return url ? imgUrl + url + '?x-oss-process=image/resize,m_fill,h_51,w_115' : ''
}

export function imgPrefixF(url) { //拼接图片前缀
    return url ? imgUrl + url : ''
}

export function previewPicture(url = '') { //拼接图片前缀
    if (url.includes('thirdwx')) { //微信图片
        return url;
    } else if (Array.isArray(url)) {
        let arr = []
        for (let i = 0; i < url.length; i++) {
            if (url[i]) {
                arr.push(imgUrl + url[i])
            }
        }
        return arr
    } else {
        return url ? [imgUrl + url] : []
    }
}

export function ymdFilter(time) { //拼接图片前缀

    return time ? time.split(' ')[0] : ''
}

export function previewListPicture(arr) { //拼接图片前缀
    let data = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i]) {
            data.push(imgUrl + arr[i])
        }
    }
    return data
}

export function formatTimeStamp(time) {
    if (time === '0' || time == null) {
        return ''
    }
    let now = new Date(time * 1000)
    let year = now.getFullYear(),
        month = now.getMonth() + 1,
        date = now.getDate(),
        hour = now.getHours(),
        minute = now.getMinutes(),
        second = now.getSeconds();
    return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
}

export function prefixUrlF(url) { // 拼接前缀跳转到商品商城
    const { protocol, hostname } = location
    return (protocol + '//' + hostname + url).replace(/admin/, 'www')
}

export function splitSpaceF(time) { // 以空格分离时间年月日
    if (!time) {
        return ''
    }
    return time.split(' ')[0]
}