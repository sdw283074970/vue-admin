import request from '@/utils/request-no-interceptor'
// import config from '@/scripts/global'

// const baseURL = config.baseURL

export function getCustomerDB() {
  return request({
    url: 'api/fba/fbaindex/',
    method: 'get'
  })
}
