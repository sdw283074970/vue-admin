<template>
  <div class="gb-maincontainer">
    <h1>Expenses Reports</h1>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="Export Operation Expenses Report" name="1">
        <expense-operation :customer-code-options="customerCodeOptions" />
      </el-collapse-item>
      <el-collapse-item title="Export Storage Expenses Report" name="2">
        <expense-storage :customer-code-options="customerCodeOptions" />
      </el-collapse-item>
      <el-collapse-item title="Comming Soon" name="3" />
      <el-collapse-item title="Comming Soon" name="4" />
      <el-collapse-item title="Comming Soon" name="5" />
      <el-collapse-item title="Comming Soon" name="6" />
      <el-collapse-item title="Comming Soon" name="7" />
      <el-collapse-item title="Comming Soon" name="8" />
      <el-collapse-item title="Comming Soon" name="9" />
      <el-collapse-item title="Comming Soon" name="10" />
      <el-collapse-item title="Comming Soon" name="11" />
      <el-collapse-item title="Comming Soon" name="12" />
      <el-collapse-item title="Comming Soon" name="13" />
      <el-collapse-item title="Comming Soon" name="14" />
      <el-collapse-item title="Comming Soon" name="15" />
    </el-collapse>
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