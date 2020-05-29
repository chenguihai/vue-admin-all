import request from '@/utils/request'

export function listItem(params) { //上刊画面订单 - 列表 / 查询
    return request({
        url: '/journalOrder',
        method: 'get',
        params: params
    })
}

export function confirmItem(params, id) { //上刊画面订单 -  确认收款
    return request({
        url: '/journalOrder/' + id,
        method: 'patch',
        data: params
    })
}

export function deleteItem(id) { //上刊画面订单 -  删除
    return request({
        url: '/journalOrder/' + id,
        method: 'delete',
    })
}