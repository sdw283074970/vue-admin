import request from '@/utils/request-no-interceptor'
import store from '@/store'

export function getWarehouseLocations() {
  return request({
    url: 'api/fba/fbafilter/?userId=' + store.getters.userId,
    method: 'get'
  })
}
