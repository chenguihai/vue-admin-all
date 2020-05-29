import Cookies from 'js-cookie'
//登入的token
const TokenKey = 'loginToken'

export function getToken() {
  // return Cookies.get(TokenKey)
  return sessionStorage.getItem('token')
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

const username = 'username'

export function getName() {
  return Cookies.get(username)
}

export function setName(name) {
  return Cookies.set(username, name)
}

export function removeName() {
  return Cookies.remove(username)
}

const user_id = 'user_id'
export function getId() {
  return Cookies.get(user_id)
}

export function setId(id) {
  return Cookies.set(user_id,id)
}

export function removeId() {
  return Cookies.remove(user_id)
}
