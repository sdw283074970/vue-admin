<template>
  <div>
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
    <el-button id="generic-filter-filter" type="primary" @click="onFilterClicked">Filter</el-button>
    <el-button id="generic-filter-reset" @click="onResetFilterClicked">Clean Filter</el-button>
  </div>
</template>
<script>
/* eslint-disable vue/require-default-prop */
import { invoiceStatus } from '@/scripts/dropdown'
import { eventBus } from '@/main'

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
      invoiceStatus: [],
      customerCodes: [],
      invoiceStatusOptions: invoiceStatus
    }
  },
  created() {
    eventBus.$on('onClearFilterClicked', () => {
      this.onResetFilterClicked()
    })
  },
  methods: {
    onFilterClicked() {
      var filter = {
        status: this.status,
        customerCodes: this.customerCodes,
        invoiceStatus: this.invoiceStatus,
        sortBy: this.sortBy,
        isDesc: this.isDesc
      }

      this.$emit('onFilterFinish', filter)
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
