import request from '@/utils/request-no-interceptor'
// import qs from 'qs'
// import config from '@/scripts/global'

export function getInvoices(reference, orderType) {
  return request({
    url: 'api/fbainvoicedetail/?reference=' + encodeURIComponent(reference) + '&invoiceType=' + orderType,
    method: 'get'
  })
}

export function updateInvoiceStatus(id, type) {
  return request({
    url: 'api/fbainvoicedetail/?invoiceDetailId=' + id + '&buttonType=' + type,
    method: 'put'
  })
}

export function CloseOrder(reference, type, date, isMinCharge) {
  return request({
    url: 'api/fba/fbainvoicedetail/?reference=' + encodeURIComponent(reference) + '&invoiceType=' + type + '&closeDate=' + date + '&isAppliedMinCharge=' + isMinCharge,
    method: 'put'
  })
}

export function OpenOrder(reference, type) {
  return request({
    url: 'api/fba/fbainvoicedetail/?reference=' + encodeURIComponent(reference) + '&invoiceType=' + type,
    method: 'put'
  })
}

export function markOrderShipped(id, date) {
  return request({
    url: 'api/fba/fbashiporder/?shipOrderId=' + id + '&operationDate=' + date + '&operation=ChangeStatus',
    method: 'put'
  })
}
