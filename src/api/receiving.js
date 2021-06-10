import request from '@/utils/request-no-interceptor'
// import qs from 'qs'
import config from '@/scripts/global'

const baseURL = config.baseURL

export function getReceivingOrders() {
  return request({
    url: 'api/fba/fbamasterorder/',
    method: 'get'
  })
}

export function getReceivingOrdersByCustomerCode(customerCode) {
  return request({
    url: 'api/fba/fbamasterorder/?customerCode=' + customerCode,
    method: 'get'
  })
}

export function getRO(id) {
  return request({
    url: 'api/fba/fbamasterorder/?masterOrderId=' + id + '&operation=Get',
    method: 'get'
  })
}

export function getOrderDetails(id) {
  return request({
    url: 'api/fba/fbaorderdetail/?masterOrderId=' + id,
    method: 'get'
  })
}

export function getInstructions(id) {
  return request({
    url: 'api/fba/fbamasterorder/?masterOrderId=' + id + '&operation=WO',
    method: 'get'
  })
}

export function getPallets(id) {
  return request({
    url: 'api/fba/fbaallocating/?masterOrderId=' + id,
    method: 'get'
  })
}

export function getCartons(id) {
  return request({
    url: 'api/fba/WarehouseOperation/?masterOrderId=' + id,
    method: 'get'
  })
}

export function getPltsInventory(id) {
  return request({
    url: 'api/fba/fbainventory/?masterOrderId=' + id + '&inventoryType=Pallet',
    method: 'get'
  })
}

export function getCtnsInventory(id) {
  return request({
    url: 'api/fba/fbainventory/?masterOrderId=' + id + '&inventoryType=Carton',
    method: 'get'
  })
}

export function createNewrReceivingOrder(data) {
  return request({
    url: '/api/fba/fbamasterorder/0',
    method: 'post',
    data: data
  })
}

export function getReceivingOrderInfo(id) {
  return request({
    url: '/api/fbamasterorder/?masterOrderId=' + id + '&operation=Get',
    method: 'get'
  })
}

export function updateReceivingOrderInfo(id, data) {
  return request({
    url: '/api/fba/fbamasterorder/?masterOrderId=' + id,
    method: 'post',
    data: data
  })
}

export function addNewSKU(id, data) {
  return request({
    url: '/api/fba/FBAOrderDetail/?masterOrderId=' + id,
    method: 'post',
    data: data
  })
}

export function getSKUInfo(id) {
  return request({
    url: '/api/fba/FBAOrderDetail/?orderDetailId=' + id,
    method: 'get'
  })
}

export function updateSKUInfo(id, data) {
  return request({
    url: '/api/fba/FBAOrderDetail/?orderDetailId=' + id + '&operation=Edit',
    method: 'put',
    data: data
  })
}

export function adjustSKUQuantity(id, data) {
  return request({
    url: '/api/fba/FBAOrderDetail/?orderDetailId=' + id + '&operation=Adjust',
    method: 'put',
    data: data
  })
}

export function deleteSKU(id) {
  return request({
    url: '/api/fba/FBAOrderDetail/?orderDetailId=' + id,
    method: 'delete'
  })
}
export function getUploadPackingListAction(id) {
  return baseURL + '/api/fba/FBAOrderDetail/?masterOrderId=' + id + '&operation=Upload'
}

export function getUploadLabelAction(id) {
  return baseURL + '/api/fba/FBAOrderDetail/?orderDetailId=' + id
}

export function getLabelFileList(id) {
  return request({
    url: '/api/fba/FBAOrderDetail/?orderDetailId=' + id + '&operation=Labels',
    method: 'get'
  })
}

export function deleteLabelFile(id, fileName) {
  return request({
    url: '/api/fba/FBAOrderDetail/?orderDetailId=' + id + '&fileName=' + encodeURIComponent(fileName),
    method: 'delete'
  })
}

export function downloadFile(path, fileName) {
  var url = config.baseURL + 'api/downloadfile/?fullPath=' + encodeURIComponent(path)
  var link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
}

export function createNewInstructionByCustomer(reference, description) {
  return request({
    url: '/api/FBAInvoiceDetail/?reference=' + encodeURIComponent(reference) + '&invoiceType=MasterOrder&description=' + encodeURIComponent(description),
    method: 'post'
  })
}

export function deleteInstruction(id) {
  return request({
    url: '/api/fba/fbainvoicedetail/?chargingItemDetailId=' + id,
    method: 'delete'
  })
}

export function updateInstructionByCustomer(id, description) {
  return request({
    url: '/api/fba/fbainvoicedetail/?chargingItemDetailId=' + id + '&description=' + encodeURIComponent(description),
    method: 'put'
  })
}

export function submitWO(id) {
  return request({
    url: '/api/fba/fbamasterOrder/?masterOrderId=' + id + '&operation=Submit',
    method: 'put'
  })
}

export function CallbackWO(id) {
  return request({
    url: '/api/fba/fbamasterOrder/?masterOrderId=' + id + '&operation=Callback',
    method: 'put'
  })
}

export function getEfiles(reference, orderType) {
  return request({
    url: '/api/fba/FBAEfolder/?reference=' + encodeURIComponent(reference) + '&orderType=' + orderType,
    method: 'get'
  })
}

export function discardFile(id) {
  return request({
    url: '/api/fba/fbaefolder/?fileId=' + id,
    method: 'put'
  })
}

export function downloadEfile(id) {
  return request({
    url: '/api/fba/fbaefolder/?fileId=' + id,
    method: 'get'
  })
}

export function resetInstructions(masterOrderId) {
  return request({
    url: '/api/fba/fbashiporder/?referenceId=' + masterOrderId + '&orderType=MasterOrder&operation=Reset',
    method: 'put'
  })
}

export function pushMasterOrder(id, date) {
  return request({
    url: '/api/fbamasterorder/?masterOrderId=' + id + '&operationDate=' + date + '&operation=Push',
    method: 'put'
  })
}

export function recallMasterOrder(id) {
  return request({
    url: '/api/fbamasterorder/?masterOrderId=' + id + '&operation=Callback',
    method: 'put'
  })
}

export function generateReceivingReceipt(id) {
  return request({
    url: '/api/fba/FBAOrderDetail/?masterOrderId=' + id + '&operation=Download',
    method: 'get'
  })
}

export function generateWO(id) {
  return request({
    url: '/api/fba/FbaMasterOrder/?masterOrderId=' + id + '&operation=Download',
    method: 'get'
  })
}

export function getCustomerCodeFilters() {
  return request({
    url: '/api/uppervendor/?departmentCode=FBA&version=V2',
    method: 'get'
  })
}

export function setInboundDate(id, date) {
  return request({
    url: 'api/warehouseinboundlog/?masterOrderId=' + id + '&operationDate=' + date + '&operation=MarkInboundDate',
    method: 'put'
  })
}

export function getFilteredDate(orderType, filter) {
  return request({
    url: 'api/fbamasterorder/?sku=' + encodeURIComponent(filter.sku.trim()) + '&orderType=' + orderType,
    method: 'get'
  })
}

export function getWarehouseInboundOrders() {
  return request({
    url: 'api/WarehouseInboundLog/',
    method: 'get'
  })
}

export function changeOrderStatus(id, operation) {
  return request({
    url: 'api/fbamasterorder/?masterOrderId=' + id + '&operation=' + operation,
    method: 'put'
  })
}

export function autoReceive(id) {
  return request({
    url: 'api/fba/FBAOrderDetail/?masterOrderId=' + id,
    method: 'put'
  })
}

export function finishProcessing(id, operation, data) {
  return request({
    url: 'api/warehouseinboundlog/?masterOrderId=' + id + '&operation=' + operation,
    method: 'put',
    data: data
  })
}

export function packPlts(id, quantity, pltSize, data) {
  return request({
    url: 'api/fba/warehouseoperation/?masterOrderId=' + id + '&pltQuantity=' + quantity + '&pltSize=' + pltSize + '&doesAppliedLabel=true&hasSortingMarking=true&isOversizeOrOverwidth=false&packType=RoughPack&isSelectedByCheckBox=false',
    method: 'post',
    data: data
  })
}

export function replayPlt(id) {
  return request({
    url: 'api/fba/FBAAllocating/?palletId=' + id,
    method: 'delete'
  })
}

export function allocateLocation(id, type, obj) {
  return request({
    url: 'api/fba/fbaallocating/?masterOrderId=' + id + '&inventoryType=' + type,
    method: 'post',
    data: obj
  })
}

export function relocateItems(id, type) {
  return request({
    url: 'api/fba/fbainventory/?locationId=' + id + '&locationType=' + type,
    method: 'delete'
  })
}

export function updateHoldCtns(id, ctns, memo) {
  return request({
    url: 'api/FBAInventory/?cartonId=' + id + '&holdCtns=' + ctns + '&memo=' + encodeURIComponent(memo),
    method: 'put'
  })
}

export function updateLocation(id, location) {
  return request({
    url: 'api/fbainventory/?locationId=' + id + '&locationValue=' + location + '&locationtype=Carton',
    method: 'put'
  })
}

export function updatePltLocation(id, location) {
  return request({
    url: 'api/fbainventory/?locationId=' + id + '&locationValue=' + location + '&locationtype=Pallet',
    method: 'put'
  })
}

export function getFilteredMasterOrders(filter) {
  return request({
    url: 'api/fba/fbafilter/?orderType=MasterOrder',
    method: 'post',
    data: filter
  })
}

export function deleteReceivingOrder(grandNumber) {
  return request({
    url: 'api/fba/fbamasterorder/?grandNumber=' + grandNumber,
    method: 'delete'
  })
}

export function sendFile(id) {
  return request({
    url: '/api/fba/fbaefolder/?fileId=' + id,
    method: 'post'
  })
}
