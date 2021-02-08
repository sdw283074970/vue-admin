<template>
  <div class="dashboard-editor-container">
    <h1>Other Reports</h1>
    <div class="chart-wrapper">
      <h2>Inbound & Outbound Schedule Log Report</h2>
      <schedule-inbound-outbound :customer-code-options="customerCodeOptions" />
    </div>
    <div class="chart-wrapper">
      <h2>SKU Statement Report</h2>
      <sku-statement :customer-code-options="customerCodeOptions" />
    </div>
  </div>
</template>

<script>
// import { getReceivingOrdersByCustomerCode, createNewrReceivingOrder, getReceivingOrderInfo, updateReceivingOrderInfo, downloadFile } from '@/api/receiving'
// import { getShippingOrders, getCustomerCodes, getAddressCode, getShipOrderInfo, createNewShipOrder, updateShipOrderInfo } from '@/api/shipping'
// import { generateInvoiceByCustomerCode } from '@/api/accounting'
// import store from '@/store'
import { getCustomerCodes } from '@/api/shipping'

// const customerCode = store.getters.customerCode;

export default {
  components: {
    'schedule-inbound-outbound': () => import('@/views/officeview/reports/other/schedule-inbound-outbound'),
    'sku-statement': () => import('@/views/officeview/reports/other/sku-statement')
  },
  data() {
    return {
      activeNames: [],
      customerCodeOptions: []
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
    getCustomerCodes().then(
      body => {
        this.customerCodeOptions = body.data
      }
    )
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
    .input-bar{
      text-align: right
    }
</style>
