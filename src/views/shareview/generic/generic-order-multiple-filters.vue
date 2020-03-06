<template>
  <div>
    <el-select
      v-model="status"
      multiple
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
      v-model="customerCodes"
      multiple
      collapse-tags
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
      v-model="invoiceStatus"
      multiple
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
      v-model="sortBy"
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
      v-model="isDesc"
      active-color="#13ce66"
      inactive-color="#13ce66"
      active-text="Desc"
      inactive-text="Asce"
    />
    <el-button type="primary" @click="onFilterClicked">Filter</el-button>
    <el-button @click="onResetFilterClicked">Reset Filter</el-button>
  </div>
</template>
<script>
/* eslint-disable vue/require-default-prop */
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
      invoiceStatusOptions: [{
        label: 'Await',
        value: 'Await'
      }, {
        label: 'Closed',
        value: 'Closed'
      }]
    }
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
      this.sortBy = ''
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>
