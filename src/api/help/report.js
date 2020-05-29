import request from '@/utils/request'

export function tipOff(params) { //举报管理 - 列表 / 查询
    return request({
        url: '/tipOff',
        method: 'get',
        params: params
    })
}

export function tipOffCheck(params) { //举报管理 - 审核
    return request({
        url: '/tipOffCheck',
        method: 'post',
        data: params
    })
}

export function tipOffDo(params) { //举报管理 - 操作
    return request({
        url: '/tipOffDo',
        method: 'post',
        data: params
    })
}

export function tipOffDel(id) { //举报管理 - 删除
    return request({
        url: '/tipOff/' + id,
        method: 'delete',
    })
}

export function tipOffType(params) { //举报类型管理 - 列表
    return request({
        url: '/tipOffType',
        method: 'get',
        params: params
    })
}

export function tipOffTypeAdd(params) { //举报类型管理 - 新增
    return request({
        url: '/tipOffType',
        method: 'post',
        data: params
    })
}

export function tipOffTypeEdit(id, params) { //举报类型管理 - 编辑
    return request({
        url: '/tipOffType/' + id,
        method: 'patch',
        data: params
    })
}

export function tipOffTypeDel(id) { //举报类型管理 - 删除
    return request({
        url: '/tipOffType/' + id,
        method: 'delete'
    })
}
export function getAdminLog() { //举报类型管理 - 删除
    return request({
        url: '/getAdminLog',
        method: 'get'
    })
}