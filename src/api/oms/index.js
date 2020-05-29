import request from '@/utils/request'

// get
export function depositOrderList(params) { //保证金订单 - 列表 / 查询
    return request({
        url: '/depositOrder',
        method: 'get',
        params: params
    })
}

// post
export function depositOrderById(params, id) { //保证金订单 - 确认收款
    return request({
        url: '/depositOrder/' + id,
        method: 'patch',
        data: params
    })
}

export function deleteDepositOrder(id) { //保证金订单 - 删除
    return request({
        url: '/depositOrder/' + id,
        method: 'delete'
    })
}

export function toolsOrderList(params) { //工具市场订单 - 列表 / 查询
    return request({
        url: '/toolsOrder',
        method: 'get',
        params: params
    })
}

export function toolsOrderById(params, id) { //工具市场订单 - 确认收款
    return request({
        url: '/toolsOrder/' + id,
        method: 'patch',
        data: params
    })
}

export function deleteToolsOrder(id) { //工具市场订单 - 删除
    return request({
        url: '/toolsOrder/' + id,
        method: 'delete',
    })
}

export function orderInvoiceList(params, type) { //订单发票 - 列表 / 查询
    return request({
        url: '/orderInvoice/' + type,
        method: 'get',
        params: params
    })
}

export function invoicedById(id) { //服务订单发票 - 开票
    return request({
        url: '/invoiced/' + id,
        method: 'get'
    })
}

export function orderRefundList(params) { //订单退款 - 列表 / 查询
    return request({
        url: '/orderRefund',
        method: 'get',
        params: params
    })
}

export function orderCommentList(params) { //订单评价 - 列表 / 查询
    return request({
        url: '/orderComment',
        method: 'get',
        params: params
    })
}

export function orderCommentHide(id, type) { //订单评价 - 隐藏
    return request({
        url: '/orderCommentHide/' + id + '/' + type,
        method: 'get',
    })
}

// get
export function clueOrderList(params) { //线索订单 - 列表 / 查询
    return request({
        url: '/clueOrder',
        method: 'get',
        params: params
    })
}

// post
export function clueOrderById(params, id) { //线索订单 - 确认收款
    return request({
        url: '/clueOrder/' + id,
        method: 'patch',
        data: params
    })
}

export function deleteClueOrder(id) { //线索订单 - 删除
    return request({
        url: '/clueOrder/' + id,
        method: 'delete'
    })
}
// get
export function clueIncOrderList(params) { //增值服务订单 - 列表 / 查询
    return request({
        url: '/clueIncOrder',
        method: 'get',
        params: params
    })
}

// post
export function clueIncOrderById(params, id) { //增值服务订单 - 确认收款
    return request({
        url: '/clueIncOrder/' + id,
        method: 'patch',
        data: params
    })
}

export function deleteClueIncOrder(id) { //增值服务订单 - 删除
    return request({
        url: '/clueIncOrder/' + id,
        method: 'delete'
    })
}