import request from '@/utils/request'

export function managersList(params) { //管理员 - 列表 / 查询
    return request({
        url: '/admin',
        method: 'get',
        params
    })
}
export function managersAdd(params) { //管理员 - 新增
    return request({
        url: '/admin',
        method: 'post',
        data: params
    })
}
export function managersEdit(id, params) { //管理员 - 编辑
    return request({
        url: '/admin/' + id,
        method: 'patch',
        data: params
    })
}
export function managersDelete(id) { //管理员 - 删除
    return request({
        url: '/admin/' + id,
        method: 'delete'
    })
}
export function managersStatus(id, status) { //管理员 - 启用
    return request({
        url: `/admin/${id}/${status}`,
        method: 'get'
    })
}