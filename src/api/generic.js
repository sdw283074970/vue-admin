import request from '@/utils/request-no-interceptor'

export function getWarehouseLocations() {
  return request({
    url: 'api/fba/fbafilter/',
    method: 'get'
  })
}
