import axios from 'axios'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'
// 创建axios实例
const service = axios.create({
        baseURL: process.env.BASE_API, // api的base_url
        timeout: 10000, // 请求超时时间
        debug: true
    })
    // request拦截器
service.interceptors.request.use(config => {
    config.headers['Authorization'] = 'Bearer ' + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    return config
}, error => {
    // Do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
})


// respone拦截器
service.interceptors.response.use(
    response => {
        /**
         * code为非1是抛错 可结合自己业务进行修改
         */
        const res = response.data
        if (res.code === 4001) {
            sessionStorage.clear();
            window.location.href = '/#/login';
            Message({
                message: res.data || res.message,
                type: 'error',
                duration: 1000
            })
            return Promise.reject(res.message)
        } else if (res.code === 401) { //没有权限
            Message({
                message: res.data || res.message,
                type: 'error',
                duration: 1000
            })
            return Promise.reject(res.data || res.message)
        } else {
            return response.data
        }
    }, error => {
        Message({
            message: error.message,
            type: 'error',
            duration: 3 * 1000
        })
        sessionStorage.clear();
        window.location.href = '/#/login';
        return Promise.reject(error)
    }
)

export default service