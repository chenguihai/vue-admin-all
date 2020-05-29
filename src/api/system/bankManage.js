import request from '@/utils/request'

export function bank(params) { //银行管理 - 列表
    return request({
        url: '/bank',
        method: 'get',
        params
    })
}

export function addBank(data) { //银行管理 - 新增
    return request({
        url: '/bank',
        method: 'post',
        data
    })
}

export function editBank(id, data) { //银行管理 - 编辑
    return request({
        url: '/bank/' + id,
        method: 'patch',
        data
    })
}

export function deleteBank(id) { //银行管理 - 删除
    return request({
        url: '/bank/' + id,
        method: 'delete',
    })
}