<template>
  <div>
    <h2>Control Panel</h2>
    <div style="margin-bottom:10px">
      <div>
        <el-button class="gb-button" type="primary" :disabled="step>2" @click="onPushClicked">Push WO</el-button>
        <el-button class="gb-button" type="warning" :disabled="step!=3" @click="onRecallClicked">Recall WO</el-button>
        <el-button :disabled="!step>2" class="gb-button" type="primary" @click="arrivedVisible=true">Mark Arrived</el-button>
        <el-button class="gb-button" disabled>Push Status</el-button>
        <el-button class="gb-button" disabled>Reverse Status</el-button>
      </div>
      <div style="margin-top:10px">
        <el-button class="gb-button" disabled>Auto Receive</el-button>
        <el-button class="gb-button" @click="registerVisible = true">Register Plt Info</el-button>
        <el-button class="gb-button" @click="onAllocateClicked">Allocate Location</el-button>
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
      title="Select Arrive Date"
      :visible.sync="arrivedVisible"
      top="5vh"
      width="350px"
      :lock-scroll="false"
    >
      <el-date-picker v-model="arrivedTime" type="date" placeholder="Select Arrive Date" value-format="yyyy-MM-dd" style="width:180px;" />
      <el-button type="primary" @click="onConfirmArrivedTimeClicked">Confirm</el-button>
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
import { pushMasterOrder, recallMasterOrder, setInboundDate } from '@/api/receiving'

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
    ctnInventoryData: Array,
    step: Number
  },
  data() {
    return {
      registerVisible: false,
      allocateVisible: false,
      inventoryVisible: false,
      arrivedVisible: false,
      arrivedTime: ''
    }
  },
  mounted() {

  },
  methods: {
    onPushClicked() {
      pushMasterOrder(this.masterOrder.id).then(() => {
        this.masterOrder.status = 'Incoming'
        this.$message({
          message: 'Push success',
          type: 'success'
        })
      })
    },
    onRecallClicked() {
      recallMasterOrder(this.masterOrder.id).then(() => {
        this.masterOrder.status = 'New Created'
        this.$message({
          message: 'Recall success',
          type: 'success'
        })
      })
    },
    onConfirmArrivedTimeClicked() {
      if (this.arrivedTime === '') {
        this.$message({
          message: 'Please select an arrived date',
          type: 'error'
        })
      } else {
        setInboundDate(this.masterOrder.id, this.arrivedTime).then(() => {
          this.masterOrder.status = 'Arrived'
          this.arrivedVisible = false
          this.$message({
            message: 'Success!',
            type: 'success'
          })
        })
      }
    },
    onAllocateClicked() {
      this.allocateVisible = true
      this.$emit('refreshPackingList')
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
