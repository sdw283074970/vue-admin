import request from '@/utils/request-no-interceptor'
// import config from '@/scripts/global'

// const baseURL = config.baseURL

export function getDashboard(data) {
  return request({
    url: 'api/fba/fbaindex/',
    method: 'get'
  })
}

export function getLinerChart(timeUnit, timeCount) {
  return request({
    url: 'api/fba/chart/?timeUnit=' + timeUnit + '&timeCount=' + timeCount,
    method: 'get'
  })
}

export function getInboundAndOutboundSchedule(startDate, endDate, isAdvaceOrderOnly, customerCode) {
  return request({
    url: 'api/fba/fbashiporder/?fromDate=' + startDate + '&toDate=' + endDate + '&isAdvaceOrderOnly=' + isAdvaceOrderOnly + '&customerCode=' + customerCode,
    method: 'get'
  })
}

export function getTransitShipmentReminder() {
  return request({
    url: 'api/fba/fbadashboard/?operation=GetTransitReminder',
    method: 'get'
  })
}

export function getSKUReport(startDate, endDate, sku, customerCode) {
  return request({
    url: 'api/fba/fbashiporder/?fromDate=' + startDate + '&toDate=' + endDate + '&sku=' + sku + '&customerCode=' + customerCode,
    method: 'get'
  })
}

export function getShipOrderLogs(shiporderId) {
  return request({
    url: '/api/fba/fbashiporder/?shipOrderId=' + shiporderId + '&operation=GetShipOrderLogs',
    method: 'get'
  })
}

export function getMasterOrderLogs(masterOrderId) {
  return request({
    url: '/api/fba/fbaMasterOrder/?masterOrderId=' + masterOrderId + '&operation=GetMasterOrderLogs',
    method: 'get'
  })
}
