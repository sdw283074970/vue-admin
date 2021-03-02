<template>
  <div class="dashboard-editor-container">
    <h1>Reports</h1>
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
    'sku-statement': () => import('@/views/customerview/reports/sku-statement')
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
