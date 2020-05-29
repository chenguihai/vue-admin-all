import request from '@/utils/request'

export function listItem(params) { //服务订单 - 列表 / 查询
    return request({
        url: '/serviceOrder',
        method: 'get',
        params: params
    })
}

export function confirmItem(params, id) { //服务订单 - 确认收款
    return request({
        url: '/serviceOrder/' + id,
        method: 'patch',
        data: params
    })
}

export function deleteItem(id) { //服务订单 - 删除
    return request({
        url: '/serviceOrder/' + id,
        method: 'delete',
    })
}

export function detailItem(id) { //服务订单 - 详情v2.0
    return request({
        url: '/serviceOrderDetail/' + id,
        method: 'get',
    })
}
export function getProolById(proof_id) { //服务订单 - 编辑收款
    return request({
        url: '/getProof/' + proof_id,
        method: 'get',
    })
}