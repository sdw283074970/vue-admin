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

export function getQuantityInfo(reference, orderType) {
  return request({
    url: 'api/FBAInvoiceDetail/?reference=' + encodeURIComponent(reference) + '&invoiceType=' + orderType + '&ajaxStep=0',
    method: 'get'
  })
}

export function getChargingType(reference, orderType) {
  return request({
    url: 'api/FBAInvoiceDetail/?reference=' + encodeURIComponent(reference) + '&invoiceType=' + orderType + '&ajaxStep=1',
    method: 'get'
  })
}

export function getChargingItemNames(reference, orderType, type) {
  return request({
    url: 'api/FBAInvoiceDetail/?reference=' + encodeURIComponent(reference) + '&invoiceType=' + orderType + '&chargingType=' + encodeURIComponent(type),
    method: 'get'
  })
}

export function getChargingDetailByName(reference, orderType, name) {
  return request({
    url: 'api/FBAInvoiceDetail/?reference=' + encodeURIComponent(reference) + '&invoiceType=' + orderType + '&itemName=' + encodeURIComponent(name),
    method: 'get'
  })
}

export function createNewChargingDetail(reference, orderType, data) {
  return request({
    url: 'api/fbainvoicedetail/?reference=' + encodeURIComponent(reference) + '&invoiceType=' + orderType,
    method: 'post',
    data: data
  })
}

export function getChargingInfo(id) {
  return request({
    url: 'api/fbainvoicedetail/?invoiceDetailId=' + id,
    method: 'get'
  })
}

export function updateChargingDetail(id, data) {
  return request({
    url: 'api/fbainvoicedetail/?invoiceDetailId=' + id,
    method: 'put',
    data: data
  })
}

export function deleteChargingDetail(id) {
  return request({
    url: 'api/invoicedetail/' + id,
    method: 'delete'
  })
}

export function generateInvoice(reference, type) {
  return request({
    url: 'api/fba/FBAReportDonwload/?reference=' + reference + '&invoicetype=' + type,
    method: 'get'
  })
}
