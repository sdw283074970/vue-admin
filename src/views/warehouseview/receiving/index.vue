<template>
  <div class="gb-maincontainer">
    <h1>Receiving Manager</h1>
    <receiving-index-table
      :table-data="tableData"
      :loading="loading"
      :customer-code-filters="customerCodeFilters"
      @onFilterConfirmed="onFilterConfirmed"
      @onRefreshClicked="onRefreshClicked"
    />
  </div>
</template>

<script>

import { getCustomerCodeFilters, getFilteredDate, getWarehouseInboundOrders } from '@/api/receiving'
import { getCustomerCodes } from '@/api/shipping'

export default {
  components: {
    'receiving-index-table': () => import('@/views/warehouseview/receiving/index-table')
  },
  data() {
    return {
      loading: true,
      tableData: [],
      totalEntries: 0,
      customerCodeOptions: [],
      customerCodeFilters: [],
      destinationOptions: [],
      isEdit: false,
      editVisible: false,
      filterVisible: false,
      filteredData: [],
      dialogFormVisible: false,
      shipOrderStatus: '',
      efileVisible: false,
      efiles: [],
      reference: '',
      orderType: 'MasterOrder'
    }
  },
  watch: {
  },
  mounted() {
    getWarehouseInboundOrders().then(body => {
      this.tableData = body.data.reverse()
      this.filteredData = body.data
      this.totalEntries = body.data.length
      this.loading = false
    })

    getCustomerCodes().then(body => {
      this.customerCodeOptions = body.data
    })

    getCustomerCodeFilters().then(body => {
      this.customerCodeFilters = body.data
    })
  },
  methods: {
    onFilterConfirmed(filter) {
      this.loading = true
      getFilteredDate('MasterOrder', filter).then(body => {
        this.tableData = body.data.reverse()
        this.filteredData = body.data
        this.totalEntries = body.data.length
        this.loading = false

        this.$message({
          message: 'Success!',
          type: 'success'
        })
      })
    },
    onRefreshClicked() {
      this.loading = true
      getWarehouseInboundOrders().then(body => {
        this.tableData = body.data.reverse()
        this.filteredData = body.data
        this.totalEntries = body.data.length
        this.loading = false
        this.$message({
          message: 'Success!',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    .input-bar{
      text-align: right
    }
</style>
