import request from '@/utils/request'

export function serviceCat(params) {
    return request({
        url: 'getChildrenCategory/' + params,
        method: 'get'
    })
}

export function clueCustomerType() { //线索客户类型 - 列表 todo
    return request({
        url: 'clueCustomerType',
        method: 'get'
    })
}

export function getRealm() { //领域
    return request({
        url: 'getRealm',
        method: 'get'
    })
}
export function getUnit() { //单位
    return request({
        url: 'getUnit',
        method: 'get'
    })
}
export function getBank() { //银行
    return request({
        url: 'getBank',
        method: 'get'
    })
}
export function getJournalType() { //上刊媒体类型
    return request({
        url: 'getJournalType',
        method: 'get'
    })
}
export function getJournalTag() { //上刊画面标签
    return request({
        url: 'getJournalTag',
        method: 'get'
    })
}
export function getServiceTag() { //服务标签
    return request({
        url: 'getServiceTag',
        method: 'get'
    })
}
export function getTipOffType() { //举报类型
    return request({
        url: 'getTipOffType',
        method: 'get'
    })
}
export function getClueCustomerType() { //线索客户类型
    return request({
        url: 'getClueCustomerType',
        method: 'get'
    })
}
export function getRefundReason() { //退款原因
    return request({
        url: 'getRefundReason/1',
        method: 'get',
    })
}
export function removeFile(params) { //删除上传文件
    return request({
        url: 'removeFile',
        method: 'post',
        data: params
    })
}
export function updateProofById(id, params) { //服务订单 - 修改收款
    return request({
        url: 'updateProof/' + id,
        method: 'patch',
        data: params
    })
}