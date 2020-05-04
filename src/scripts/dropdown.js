const inboundTypes = [
  {
    value: 'FCL',
    label: 'FCL'
  },
  {
    value: 'LCL',
    label: 'LCL'
  },
  {
    value: 'LTL',
    label: 'LTL'
  },
  {
    value: 'FTL',
    label: 'FTL'
  },
  {
    value: 'LOOSE CTN',
    label: 'LOOSE CTN'
  },
  {
    value: 'RE-PALLETIZE',
    label: 'RE-PALLETIZE'
  },
  {
    value: 'OTHER',
    label: 'OTHER'
  },
  {
    value: 'SEE INSTRUCTION',
    label: 'SEE INSTRUCTION'
  },
  {
    value: 'NA',
    label: 'NA'
  }
]

export { inboundTypes }

const unloadingTypes = [
  {
    value: 'DROP-OFF',
    label: 'DROP-OFF'
  },
  {
    value: 'LIVE UNLOAD',
    label: 'LIVE UNLOAD'
  },
  {
    value: 'OTHER',
    label: 'OTHER'
  },
  {
    value: 'SEE INSTRUCTION',
    label: 'SEE INSTRUCTION'
  },
  {
    value: 'NA',
    label: 'NA'
  }
]

export { unloadingTypes }

const storageTypes = [
  {
    value: 'MIX',
    label: 'MIX'
  },
  {
    value: 'STORAGE',
    label: 'STORAGE'
  },
  {
    value: 'TRANSIT SHIPMENT',
    label: 'TRANSIT SHIPMENT'
  },
  {
    value: 'E-COMMERCE',
    label: 'E-COMMERCE'
  },
  {
    value: 'OTHER',
    label: 'OTHER'
  },
  {
    value: 'SEE INSTRUCTION',
    label: 'SEE INSTRUCTION'
  },
  {
    value: 'NA',
    label: 'NA'
  }
]

export { storageTypes }

const palletizings = [
  {
    value: 'NORMAL',
    label: 'NORMAL'
  },
  {
    value: '72',
    label: '<=72'
  },
  {
    value: '80',
    label: '<=80'
  },
  {
    value: 'DOUBLE STACK',
    label: 'DOUBLE STACK'
  },
  {
    value: 'OTHER',
    label: 'OTHER'
  },
  {
    value: 'SEE INSTRUCTION',
    label: 'SEE INSTRUCTION'
  },
  {
    value: 'NA',
    label: 'NA'
  }
]

export { palletizings }

const inboundOrderStatus = [
  { value: 'New Created', text: 'New Created' },
  { value: 'Draft', text: 'Draft' },
  { value: 'Incoming', text: 'Incoming' },
  { value: 'Arrived', text: 'Arrived' },
  { value: 'Processing', text: 'Processing' },
  { value: 'Received', text: 'Received' },
  { value: 'Registered', text: 'Registered' },
  { value: 'Allocated', text: 'Allocated' },
  { value: 'Confirmed', text: 'Confirmed' }
]

export { inboundOrderStatus }

const inboundOrderSortOption = [
  { text: 'Id', value: 'Id' },
  { text: 'Status', value: 'Status' },
  { text: 'Container #', value: 'Container' },
  { text: 'Customer Code', value: 'CustomerCode' },
  { text: 'Container Size', value: 'ContainerSize' },
  { text: 'Inbound Type', value: 'InboundType' },
  { text: 'Subcustomer Code', value: 'SubCustomer' },
  { text: 'Org Ctns', value: 'TotalCtns' },
  { text: 'Actual Ctns', value: 'ActualCtns' },
  { text: 'Org Plts', value: 'OriginalPlts' },
  { text: 'Actual Plts', value: 'ActualPlts' },
  { text: 'SKU #', value: 'SKUNumber' },
  { text: 'ETA', value: 'Eta' },
  { text: 'ATA', value: 'InboundDate' },
  { text: '$ Amount', value: 'TotalAmount' },
  { text: '$ Cost', value: 'TotalCost' },
  { text: '$ Net', value: 'Net' },
  { text: 'Invoice Status', value: 'InvoiceStatus' },
  { text: 'Close Date', value: 'CloseDate' }
]

export { inboundOrderSortOption }

const invoiceStatus = [{
  label: 'Await',
  value: 'Await'
}, {
  label: 'Generated',
  value: 'Generated'
}, {
  label: 'Closed',
  value: 'Closed'
}]

export { invoiceStatus }
