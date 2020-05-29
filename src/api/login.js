import request from '@/utils/request'
//登入
export function login(params) {
    return request({
        url: '/login',
        method: 'post',
        data: params
    })
}
//拉取用户信息
export function getInfo() {
    return request({
        url: '/admin/info',
        method: 'get',
    })
}
//登出
export function logout() {
    return request({
        url: '/logout',
        method: 'post'
    })
}

export function getCaptcha() { //获取验证码
    return request({
        url: '/captcha',
        method: 'get'
    })
}