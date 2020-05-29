import request from '@/utils/request'

export function requestList(params) { //角色管理 - 列表 / 查询
    return request({
        url: '/adminRole',
        method: 'get',
        params
    })
}
export function requestAdd(params) { //角色管理 - 新增
    return request({
        url: '/adminRole',
        method: 'post',
        data: params
    })
}
export function requestEdit(id, params) { //角色管理 - 编辑
    return request({
        url: '/adminRole/' + id,
        method: 'patch',
        data: params
    })
}
export function requestDelete(id) { //角色管理 - 删除
    return request({
        url: '/adminRole/' + id,
        method: 'delete'
    })
}
export function requestStatus(id, status) { //角色管理 - 启用
    return request({
        url: `/adminRole/${id}/${status}`,
        method: 'get'
    })
}
export function requestSetAuth(data) { //角色管理 - 设置权限
    return request({
        url: `/setAuth`,
        method: 'post',
        data
    })
}
export function requestPermission() { //权限列表
    return request({
        url: `/adminPermission`,
        method: 'get',
    })
}