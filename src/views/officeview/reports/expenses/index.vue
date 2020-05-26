<template>
  <div class="dashboard-editor-container">
    <h1>Expenses Reports</h1>
    <div class="chart-wrapper">
      <h2>Operation Charges Report</h2>
      <expense-operation :customer-code-options="customerCodeOptions" />
    </div>
    <div class="chart-wrapper">
      <h2>Storage Charges Report</h2>
      <expense-storage :customer-code-options="customerCodeOptions" />
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { getReceivingOrdersByCustomerCode, createNewrReceivingOrder, getReceivingOrderInfo, updateReceivingOrderInfo, downloadFile } from '@/api/receiving'
import { getShippingOrders, getCustomerCodes, getAddressCode, getShipOrderInfo, createNewShipOrder, updateShipOrderInfo } from '@/api/shipping'
import { generateInvoiceByCustomerCode } from '@/api/accounting'
import store from '@/store'

// const customerCode = store.getters.customerCode;

export default {
    data() {
        return {
            activeNames: [],
            customerCodeOptions: []
        };
    },
    components: {
      'expense-operation': () => import('@/views/officeview/reports/expenses/expense-operation'),
      'expense-storage': () => import('@/views/officeview/reports/expenses/expense-storage')
    },
    computed: {
    },
    watch:{
    },
    methods:{
    },
    mounted() {
      getCustomerCodes().then(
        body => {
          this.customerCodeOptions = body.data
        }
      )
    }
}
</script>

<style lang="scss" scoped>
    .input-bar{
      text-align: right
    }
</style>