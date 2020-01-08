<template>
  <div>
    <h2>Control Panel</h2>
    <div style="margin-bottom:10px">
      <div>
        <el-button class="gb-button" disabled>Push WO</el-button>
        <el-button class="gb-button" disabled>Recall WO</el-button>
        <el-button class="gb-button" disabled>Push Status</el-button>
        <el-button class="gb-button" disabled>Reverse Status</el-button>
      </div>
      <div style="margin-top:10px">
        <el-button class="gb-button" disabled>Auto Receive</el-button>
        <el-button class="gb-button" @click="registerVisible = true">Register Plt Info</el-button>
        <el-button class="gb-button" @click="allocateVisible = true">Allocate Location</el-button>
        <el-button class="gb-button" @click="inventoryVisible = true">View Inventory</el-button>
      </div>
    </div>
    <el-dialog
      title="Register Pallets Info"
      :visible.sync="registerVisible"
      top="5vh"
      width="85%"
      :lock-scroll="false"
    >
      <receiving-register :master-order="masterOrder" :order-details="orderDetails" />
    </el-dialog>
    <el-dialog
      title="Allocate Location"
      :visible.sync="allocateVisible"
      width="85%"
      top="5vh"
      :lock-scroll="false"
    >
      <receiving-allocate :master-order="masterOrder" :plt-data="pltData" :ctn-data="ctnData" />
    </el-dialog>
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
export default {
  components: {
    'receiving-register': () => import('@/views/shareview/receiving/receiving-wo-register'),
    'receiving-allocate': () => import('@/views/shareview/receiving/receiving-wo-allocate'),
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
      registerVisible: false,
      allocateVisible: false,
      inventoryVisible: false
    }
  },
  mounted() {

  },
  methods: {
    test() {
      this.$emit('childOrderDetails', this.masterOrder.id)
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
