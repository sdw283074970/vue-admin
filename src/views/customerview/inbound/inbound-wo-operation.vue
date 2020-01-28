<template>
  <div>
    <h2>Operation</h2>
    <div style="margin-bottom:10px">
      <div style="margin-top:10px">
        <el-button type="primary" class="gb-button" :disabled="masterOrder.status!='New Created'" @click="onSubmitClicked()">Submit</el-button>
        <el-button type="warning" class="gb-button" :disabled="masterOrder.status!='Draft'" @click="onCallBackClicked()">Call Back</el-button>
        <el-button type="primary" class="gb-button" @click="inventoryVisible = true">View Inventory</el-button>
      </div>
    </div>
    <el-dialog
      title="Inventory"
      :visible.sync="inventoryVisible"
      width="85%"
      top="5vh"
      :lock-scroll="false"
    >
      <receiving-inventory :master-order="masterOrder" :plt-inventory-data="pltInventoryData" :ctn-inventory-data="ctnInventoryData" />
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable vue/require-prop-types */
/* eslint-disable vue/require-default-prop */
import { submitWO, CallbackWO } from '@/api/receiving'

export default {
  components: {
    'receiving-inventory': () => import('@/views/shareview/receiving/receiving-wo-inventory')
  },
  props: {
    masterOrder: {},
    orderDetails: Array,
    pltData: Array,
    ctnData: Array,
    pltInventoryData: Array,
    ctnInventoryData: Array
  },
  data() {
    return {
      inventoryVisible: false
    }
  },
  mounted() {

  },
  methods: {
    onSubmitClicked() {
      submitWO(this.masterOrder.id).then(() => {
        this.masterOrder.status = 'Draft'
        this.$message({
          message: 'Operation success',
          type: 'success',
          center: true
        })
      })
    },
    onCallBackClicked() {
      CallbackWO(this.masterOrder.id).then(() => {
        this.masterOrder.status = 'New Created'
        this.$message({
          message: 'Operation success',
          type: 'success',
          center: true
        })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
