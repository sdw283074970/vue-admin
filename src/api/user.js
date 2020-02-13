import request from '@/utils/request'
import csmRequest from '@/utils/request-no-interceptor'
import config from '@/scripts/global'

const baseURL = config.baseURL

export function login(data) {
  return request({
    url: baseURL + 'api/users/',
    method: 'get',
    params: { userName: data.username, password: data.password }
  })
}

export function getInfo(token) {
  return request({
    url: baseURL + 'api/users/',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: baseURL + 'api/users/',
    method: 'post'
  })
}

export function getAllUsers() {
  return csmRequest({
    url: 'api/users/',
    method: 'get'
  })
}

export function registerUser(email, role) {
  return csmRequest({
    url: 'api/users/?email=' + email + '&tire=' + role,
    method: 'post'
  })
}
