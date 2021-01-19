<template>
  <div>
    <!-- <el-button @click="test">test</el-button> -->
    <el-select
      v-model="warehouseLocation"
      filterable
      collapse-tags
      placeholder="-- Warehouse --"
    >
      <el-option
        v-for="item in warehouseLocations"
        :key="item.warehouseCode"
        :label="item.warehouseCode + ' - ' + item.warehouseName"
        :value="item.warehouseCode"
      />
    </el-select>
    <el-date-picker
      v-model="dateRange"
      type="daterange"
      range-separator="-"
      start-placeholder="From Date"
      end-placeholder="To Date"
      value-format="yyyy-MM-dd"
      :picker-options="pickerOptions"
    />
    <el-select
      id="generic-filter-status"
      v-model="status"
      multiple
      filterable
      collapse-tags
      placeholder="-- Status --"
    >
      <el-option
        v-for="item in statusFilters"
        :key="item.value"
        :label="item.text"
        :value="item.value"
      />
    </el-select>
    <el-select
      id="generic-filter-customer-code"
      v-model="customerCodes"
      multiple
      collapse-tags
      filterable
      placeholder="-- Customer Code --"
    >
      <el-option
        v-for="item in customerCodeFilters"
        :key="item.value"
        :label="item.text"
        :value="item.value"
      />
    </el-select>
    <el-select
      id="generic-filter-invoice-status"
      v-model="invoiceStatus"
      multiple
      filterable
      collapse-tags
      placeholder="-- Invoice Status --"
    >
      <el-option
        v-for="item in invoiceStatusOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select
      id="generic-filter-sort"
      v-model="sortBy"
      filterable
      placeholder="-- Sort By --"
    >
      <el-option
        v-for="item in sortByOptions"
        :key="item.value"
        :label="item.text"
        :value="item.value"
      />
    </el-select>
    <el-switch
      id="generic-filter-ordering"
      v-model="isDesc"
      active-color="#13ce66"
      inactive-color="#13ce66"
      active-text="Desc"
      inactive-text="Asce"
    />
    <el-button id="generic-filter-filter" type="primary" @click="onFilterClicked">Apply</el-button>
    <el-button id="generic-filter-reset" @click="onResetFilterClicked">Clean Filter</el-button>
  </div>
</template>
<script>
/* eslint-disable vue/require-default-prop */
import { invoiceStatus } from '@/scripts/dropdown'
import { eventBus } from '@/main'
import { getWarehouseLocations } from '@/api/generic'

export default {
  props: {
    customerCodeFilters: Array,
    statusFilters: Array,
    sortByOptions: Array
  },
  data() {
    return {
      sortBy: 'Id',
      isDesc: true,
      status: [],
      warehouseLocation: '',
      warehouseLocations: [],
      dateRange: '',
      invoiceStatus: [],
      customerCodes: [],
      invoiceStatusOptions: invoiceStatus,
      pickerOptions: {
        shortcuts: [{
          text: 'Last week',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: 'Last month',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: 'Last 3 months',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: 'Last year',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  mounted() {
    getWarehouseLocations().then(
      body => {
        this.warehouseLocations = body.data
      }
    )
  },
  created() {
    eventBus.$on('onClearFilterClicked', () => {
      this.onResetFilterClicked()
    })
  },
  methods: {
    transferDate: function(date) {
      return date === undefined ? '' : (date.substring(0, 4) === 1900 ? '-' : date.substring(0, 10))
    },
    onFilterClicked() {
      if (this.warehouseLocation === '' || this.dateRange === '') {
        this.$message({
          message: 'Warehouse Location and Date is required',
          type: 'warning'
        })
      } else {
        var filter = {
          warehouseLocation: this.warehouseLocation,
          fromDate: this.dateRange[0],
          toDate: this.dateRange[1],
          status: this.status,
          customerCodes: this.customerCodes,
          invoiceStatus: this.invoiceStatus,
          sortBy: this.sortBy,
          isDesc: this.isDesc
        }
        this.$emit('onFilterFinish', filter)
      }
    },
    onResetFilterClicked() {
      this.status = []
      this.customerCodes = []
      this.invoiceStatus = []
      this.isDesc = true
      this.sortBy = 'Id'
      eventBus.$emit('cleanFilter')
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>
