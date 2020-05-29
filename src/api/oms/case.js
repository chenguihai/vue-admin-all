import request from '@/utils/request'

export function listItem(type, params) { //案例传记订单 - 列表 / 查询
    return request({
        url: '/caseBiogOrder/' + type,
        method: 'get',
        params: params
    })
}

export function confirmItem(id, params) { //案例传记订单 -  确认收款
    return request({
        url: '/caseBiogOrder/' + id,
        method: 'patch',
        data: params
    })
}

export function deleteItem(id) { //案例传记订单 -  删除
    return request({
        url: '/caseBiogOrder/' + id,
        method: 'delete',
    })
}