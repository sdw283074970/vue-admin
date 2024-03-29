import request from '@/utils/request-no-interceptor'
// import qs from 'qs'
import config from '@/scripts/global'

const baseURL = config.baseURL

export function getShippingOrders() {
  return request({
    url: 'api/fba/fbashiporder/',
    method: 'get'
  })
}

export function getShippingOrdersByCustomerCode(customerCode) {
  return request({
    url: 'api/fba/fbashiporder/?customerCode=' + customerCode,
    method: 'get'
  })
}

export function getSO(id) {
  return request({
    url: 'api/fba/fbashiporder/?shipOrderId=' + id + '&operation=Get',
    method: 'get'
  })
}

export function getPickDetails(id) {
  return request({
    url: 'api/fba/fbapickdetail/?shipOrderId=' + id,
    method: 'get'
  })
}

export function getPltsInventory(id, container, sku, amzRef, warehouseCode, warehouseLocation) {
  return request({
    url: 'api/fba/fbainventory/?shipOrderId=' + id + '&container=' + encodeURIComponent(container) + '&sku=' + encodeURIComponent(sku) + '&amzRef=' + encodeURIComponent(amzRef) + '&warehouseCode=' + encodeURIComponent(warehouseCode) + '&warehouseLocation=' + encodeURIComponent(warehouseLocation) + '&inventoryType=Pallet',
    method: 'get'
  })
}

export function getCtnsInventory(id, container, sku, amzRef, warehouseCode, warehouseLocation) {
  return request({
    url: 'api/fba/fbainventory/?shipOrderId=' + id + '&container=' + encodeURIComponent(container) + '&sku=' + encodeURIComponent(sku) + '&amzRef=' + encodeURIComponent(amzRef) + '&warehouseCode=' + encodeURIComponent(warehouseCode) + '&warehouseLocation=' + encodeURIComponent(warehouseLocation) + '&inventoryType=Carton',
    method: 'get'
  })
}

export function getInstructions(shipOrderId) {
  return request({
    url: 'api/fba/fbashiporder/?shipOrderId=' + shipOrderId + '&operation=WO',
    method: 'get'
  })
}

export function getCustomerCodes() {
  return request({
    url: 'api/uppervendor/?departmentCode=FBA',
    method: 'get'
  })
}

export function onAdjustClcicked(id, obj) {
  return request({
    url: '/api/fba/fbapickdetail/?pickDetailId=7576&pltsAdjust=0&newPltsAdjust=2&outboundAdjust=2',
    method: 'put'
  })
}

export function getAddressCode() {
  return request({
    url: 'api/fbaaddressmanagement/',
    method: 'get'
  })
}

export function getShipOrderInfo(id) {
  return request({
    url: 'api/fba/fbashipOrder/?shipOrderId=' + id + '&operation=Update',
    method: 'get'
  })
}

export function createNewShipOrder(data) {
  return request({
    url: 'api/fba/fbashiporder/',
    method: 'post',
    data: data
  })
}

export function updateShipOrderInfo(id, data) {
  return request({
    url: 'api/fba/fbashiporder/?shipOrderId=' + id,
    method: 'put',
    data: data
  })
}
export function pickCtnsInPlts(shipOrderId, inventoryId, quantity, newQuantity, data) {
  return request({
    url: 'api/fba/fbapickdetail/?shipOrderId=' + shipOrderId + '&inventoryLocationId=' + inventoryId + '&quantity=' + quantity + '&newQuantity=' + newQuantity + '&inventoryType=Pallet',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'application/json' }
  })
}

export function confirmPickCtns(shipOrderId, data) {
  return request({
    url: 'api/fba/fbapickdetail/?shipOrderId=' + shipOrderId + '&inventoryLocationId=0&quantity=0&newQuantity=0&inventoryType=Carton',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'application/json' }
  })
}

export function putbackPickDetail(pickDetailId) {
  return request({
    url: 'api/fba/fbapickdetail/?pickDetailId=' + pickDetailId,
    method: 'delete'
  })
}

export function resetInstructions(shipOrderId) {
  return request({
    url: 'api/fba/fbashiporder/?referenceId=' + shipOrderId + '&orderType=ShipOrder&operation=Reset',
    method: 'put'
  })
}

export function createNewInstruction(shipOrderNumber, description, isChargingItem, isInstruction, orderType) {
  return request({
    url: 'api/fbainvoicedetail/?reference=' + encodeURIComponent(shipOrderNumber) + '&invoiceType=' + orderType + '&description=' + encodeURIComponent(description) + '&isChargingItem=' + isChargingItem + '&isInstruction=' + isInstruction,
    method: 'post'
  })
}

export function createNewInstructionByModel(data) {
  return request({
    url: 'api/fbainvoicedetail/',
    method: 'post',
    data: data
  })
}

export function deleteInstruction(id) {
  return request({
    url: 'api/fba/fbainvoicedetail/?chargingItemDetailId=' + id,
    method: 'delete'
  })
}

export function updateInstruction(id, description, isChargingItem, isInstruction) {
  return request({
    url: 'api/fba/fbashiporder/?chargingDetailId=' + id + '&comment=' + encodeURIComponent(description) + '&isChargingItem=' + isChargingItem + '&isInstruction=' + isInstruction + '&operation=UpdateInstruction',
    method: 'put'
  })
}

export function updateInstructionbyModel(operation, data) {
  return request({
    url: 'api/fba/fbashiporder/?operation=' + operation,
    method: 'put',
    data: data
  })
}

export function updateComment(id, description, isChargingItem, isInstruction) {
  return request({
    url: 'api/fba/fbashiporder/?chargingDetailId=' + id + '&comment=' + encodeURIComponent(description) + '&isChargingItem=' + isChargingItem + '&isInstruction=' + isInstruction + '&operation=UpdateComment',
    method: 'put'
  })
}

export function confirmInstruction(id, status) {
  return request({
    url: 'api/warehouseindex/?chargingItemDetailId=' + id + '&operation=' + status,
    method: 'put'
  })
}

export function finishInstruction(id) {
  return request({
    url: 'api/warehouseindex/?chargingItemDetailId=' + id + '&operation=Finish',
    method: 'put'
  })
}

export function resultInstruction(id, description) {
  return request({
    url: 'api/fba/fbashiporder/?chargingDetailId=' + id + '&comment=' + encodeURIComponent(description) + '&isChargingItem=true&&isInstruction=true&&operation=UpdateResult',
    method: 'put'
  })
}

export function pushShipOrderStatus(shipOrderId, operationDate) {
  return request({
    url: 'api/fba/fbashiporder/?shipOrderId=' + shipOrderId + '&operationDate=' + operationDate + '&operation=ChangeStatus',
    method: 'put'
  })
}

export function markShipOrderReleased(shipOrderId, operationDate, isPrereleasing) {
  return request({
    url: 'api/fba/fbashiporder/?shipOrderId=' + shipOrderId + '&operationDate=' + operationDate + '&isPrereleasing=' + isPrereleasing,
    method: 'put'
  })
}

export function reverseShipOrderStatus(shipOrderId, operationDate) {
  return request({
    url: 'api/fba/fbashiporder/?shipOrderId=' + shipOrderId + '&operationDate=' + operationDate + '&operation=ReverseStatus',
    method: 'put'
  })
}

export function createNewInstructionByCustomer(reference, description) {
  return request({
    url: 'api/FBAInvoiceDetail/?reference=' + encodeURIComponent(reference) + '&invoiceType=ShipOrder&description=' + encodeURIComponent(description),
    method: 'post'
  })
}

export function submitShipOrder(id) {
  return request({
    url: 'api/FBAShipOrder/?shipOrderId=' + id + '&operation=Submit',
    method: 'put'
  })
}

export function getOrderDetailId(id) {
  return request({
    url: 'api/FBAPickDetail/?cartonId=' + id,
    method: 'get'
  })
}

export function getUploadLabelAction(id) {
  return baseURL + '/api/fba/FBAPickDetail/?pickDetailCartonId=' + id
}

export function getLabelFileList(id) {
  return request({
    url: '/api/fba/FBAPickDetail/?pickDetailCartonId=' + id + '&operation=Labels',
    method: 'get'
  })
}

export function deleteLabelFile(id, fileName) {
  return request({
    url: '/api/fba/FBAPickDetail/?pickDetailCartonId=' + id + '&fileName=' + encodeURIComponent(fileName),
    method: 'delete'
  })
}

export function generateWO(id) {
  return request({
    url: '/api/fba/fbapickdetail/?shipOrderId=' + id + '&operation=Download',
    method: 'get'
  })
}

export function generateBOL(id, freightCharge, operator) {
  return request({
    url: '/api/fba/fbashipOrder/?shipOrderId=' + id + '&freightCharge=' + freightCharge + '&operatorName=' + operator,
    method: 'get'
  })
}

export function adjustPickDetail(id, obj) {
  return request({
    url: 'api/fba/fbapickdetail/?pickDetailId=' + id + '&pltsAdjust=' + obj.pltsAdjust + '&newPltsAdjust=' + obj.newPltsAdjust + '&outboundAdjust=' + obj.outboundAdjust,
    method: 'put'
  })
}

export function getWarehouseOutboundOrders() {
  return request({
    url: 'api/WarehouseIndex/?operation=GET',
    method: 'get'
  })
}

export function updateOrder(id, operation, report) {
  return request({
    url: 'api/warehouseIndex/?shipOrderId=' + id + '&operation=' + operation,
    method: 'put',
    data: report
  })
}

export function getFilteredShipOrders(filter) {
  return request({
    url: 'api/fba/fbafilter/?orderType=ShipOrder',
    method: 'post',
    data: filter
  })
}

export function deleteShippingOrder(id) {
  return request({
    url: 'api/fba/fbashiporder/?shipOrderId=' + id,
    method: 'delete'
  })
}

export function cancelOrder(reference, cancelDate, orderType) {
  return request({
    url: 'api/fba/fbashiporder/?reference=' + reference + '&cancelDate=' + cancelDate + '&orderType=' + orderType,
    method: 'put'
  })
}

export function getDate(shipOrderId) {
  return request({
    url: 'api/fba/fbashiporder/?shipOrderId=' + shipOrderId + '&operation=GetDate',
    method: 'get'
  })
}

export function updateAllDate(shipOrderId, data) {
  return request({
    url: 'api/fba/fbashiporder/?shipOrderId=' + shipOrderId + '&operation=UpdateDate',
    method: 'put',
    data: data
  })
}

export function putbackToNewLocation(pickDetailId, newLocation) {
  return request({
    url: 'api/fba/fbapickdetail/?pickDetailId=' + pickDetailId + '&newLocation=' + newLocation,
    method: 'delete'
  })
}