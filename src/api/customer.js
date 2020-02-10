import request from '@/utils/request-no-interceptor'
// import config from '@/scripts/global'

// const baseURL = config.baseURL

export function getCustomerDB() {
  return request({
    url: 'api/fba/fbaindex/',
    method: 'get'
  })
}

export function createCustomer(data) {
  return request({
    url: 'api/customermanagement/',
    method: 'post',
    data: data
  })
}

export function updateCustomer(data) {
  return request({
    url: 'api/customermanagement/',
    method: 'put',
    data: data
  })
}
