<template>
  <div>
    <div>
      <h2>Summary</h2>
      <el-form label-position="left" inline class="gb-table-expand">
        <el-form-item label="Customer Code">
          <span>{{ inventoryResults.customer }}</span>
        </el-form-item>
        <el-form-item label="Date Range">
          <span>{{ transferDate(inventoryResults.startDate) + ' ~ ' + transferDate(inventoryResults.closeDate) }}</span>
        </el-form-item>
        <el-form-item label="Ava In-plt Ctns">
          <span>{{ inventoryResults.totalInPalletCtns }}</span>
        </el-form-item>
        <el-form-item label="Ava Losse Ctns">
          <span>{{ inventoryResults.currentLooseCtns }}</span>
        </el-form-item>
        <el-form-item label="Ava ttl Plts">
          <span>{{ inventoryResults.currentTotalPlts }}</span>
        </el-form-item>
        <el-form-item label="Processing Plts">
          <span>{{ inventoryResults.totalPickingPlts }}</span>
        </el-form-item>
        <el-form-item label="Ava ttl Ctns">
          <span>{{ inventoryResults.currentTotalCtns }}</span>
        </el-form-item>
        <el-form-item label="Processing Ctns">
          <span>{{ inventoryResults.totalPickingCtns }}</span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

export default {
  props: {
    inventoryResults: {}
  },
  data() {
    return {
    }
  },
  mounted() {

  },
  methods: {
    transferDate: function(date) {
      return date === undefined ? '' : (date.substring(0, 4) === 1900 ? '-' : date.substring(0, 10))
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
