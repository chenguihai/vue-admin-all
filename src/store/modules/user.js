import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken, getName, setName, removeName, getId, setId, removeId } from '@/utils/auth'

const user = {
    state: {
        token: getToken(),
        //username: '',
        username: getName(),
        // avatar: '',
        user_id: getId(),
        roles: []
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_NAME: (state, username) => {
            state.username = username
                // state.name = username
        },
        // SET_AVATAR: (state, avatar) => {
        //   state.avatar = avatar
        // },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        //管理员id
        SET_ID: (state, user_id) => {
            state.user_id = user_id
        }
    },

    actions: {
        // 登录
        Login({ commit }, userInfo) {
            const username = userInfo.username.trim()
            return new Promise((resolve, reject) => {
                login(username, userInfo.password).then(res => {
                    const tokenStr = res.api_token
                    const name = res.username
                    const user_id = res.id
                        // setToken(tokenStr)
                        // commit('SET_TOKEN', tokenStr)
                    setName(name)
                        // commit('SET_NAME', name) //添加用户名
                    setId(user_id)
                        // commit('SET_ID', user_id)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取用户信息
        // GetInfo({ commit, state }) {
        //   return new Promise((resolve, reject) => {
        //     getInfo().then(response => {
        //       const data = response.data
        //       if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
        //         commit('SET_ROLES', data.roles)
        //       } else {
        //         reject('getInfo: roles must be a non-null array !')
        //       }
        //       commit('SET_NAME', data.username)
        //       commit('SET_AVATAR', data.icon)
        //       resolve(response)
        //     }).catch(error => {
        //       reject(error)
        //     })
        //   })
        // },

        // 登出
        LogOut({ commit, state }) {
            return new Promise((resolve, reject) => {
                logout().then((result) => {
                    commit('SET_TOKEN', '')
                    commit('SET_NAME', '')
                    commit('SET_ID', '')
                    commit('SET_ROLES', [])
                    removeToken()
                    removeName()
                    removeId()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 前端 登出
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                removeToken()
                resolve()
            })
        }
    }
}

export default user