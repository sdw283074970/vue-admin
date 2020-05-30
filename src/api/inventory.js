import request from '@/utils/request-no-interceptor'
// import qs from 'qs'
// import config from '@/scripts/global'

// const baseURL = config.baseURL

export function getInventoryByDate(code, startDate, endDate) {
  return request({
    url: 'api/fba/fbainventoryindex/?customerCode=' + code + '&startDate=' + startDate + '&closeDate=' + endDate,
    method: 'get'
  })
}

export function getCtnHistories(id) {
  return request({
    url: 'api/fba/FBAinventory/?locationId=' + id + '&locationType=Carton',
    method: 'get'
  })
}

export function getPltHistories(id) {
  return request({
    url: 'api/fba/FBAinventory/?locationId=' + id + '&locationType=Pallet',
    method: 'get'
  })
}

export function downloadInventoryReport(code, startDate, endDate) {
  return request({
    url: 'api/fba/FBAInventoryIndex/?customerCode=' + code + '&startDate=' + startDate + '&closeDate=' + endDate + '&operation=DownloadFile',
    method: 'get'
  })
}
