<template>
  <div>
    <h2>Control Panel</h2>
    <h3>Invoice Status: {{ masterOrder.invoiceStatus }}</h3>
    <div style="margin-bottom:10px">
      <div>
        <el-button class="gb-button" type="primary" :disabled="masterOrder.invoiceStatus!='Await'" @click="closeVisible=true">Close Order</el-button>

        <el-popover
          v-model="popVisible2"
          placement="top"
          width="295"
        >
          <p>The invoice status and closing date of this order will be reset.</p>
          <p>Are you sure you want to continue?</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="popVisible2 = false">No</el-button>
            <el-button type="primary" size="mini" @click="onOpenClicked">Yes</el-button>
          </div>
          <el-button slot="reference" class="gb-button" type="warning" :disabled="masterOrder.invoiceStatus=='Await'">Re-open Order</el-button>
        </el-popover>

        <el-button :disabled="step<3" class="gb-button" type="primary" @click="arrivedVisible=true">Set Arrived Date</el-button>
        <el-button type="info" class="gb-button" @click="inventoryVisible = true">View Inventory</el-button>
      </div>
    </div>
    <el-dialog
      title="Register Pallets Info"
      :visible.sync="registerVisible"
      top="5vh"
      width="85%"
      :lock-scroll="false"
    >
      <receiving-register :master-order="masterOrder" :order-details="orderDetails" @reloadOrder="reloadOrder" />
    </el-dialog>
    <el-dialog
      title="Close Order"
      :visible.sync="closeVisible"
      top="5vh"
      width="350px"
      :lock-scroll="false"
    >
      <div style="text-align:right">
        <label>Close Date: </label><el-date-picker v-model="closeDate" type="date" placeholder="Select close Date" value-format="yyyy-MM-dd" style="width:180px;" />
      </div>
      <div style="text-align:right;margin-right:20px">
        <label>Apply min-charge?</label>
        <el-switch
          v-model="isAppliedMinCharge"
          style="display: block"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="YES"
          inactive-text="NO"
        />
      </div>
      <div style="margin-top:20px;margin-right:10px;text-align:right">
        <el-popover
          v-model="popVisible1"
          placement="top"
          width="330"
        >
          <p>This order will be uneditable after this operation unless re-opren it.</p>
          <p>Are you sure you want to continue?</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="popVisible1 = false">No</el-button>
            <el-button type="primary" size="mini" @click="onCloseClicked">Yes</el-button>
          </div>
          <el-button slot="reference" class="gb-button" type="primary">Confirm Close</el-button>
        </el-popover>
      </div>
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
        <receiving-allocate :master-order="masterOrder" :plt-data="pltData" :ctn-data="ctnData" @reloadOrder="reloadOrder" />
      </el-dialog>

      <el-dialog
        title="Inventory"
        :visible.sync="inventoryVisible"
        width="85%"
        top="5vh"
        :lock-scroll="false"
      >
        <receiving-inventory :master-order="masterOrder" :plt-inventory-data="pltInventoryData" :ctn-inventory-data="ctnInventoryData" @reloadOrder="reloadOrder" />
      </el-dialog>
    </el-dialog></div>
</template>

<script>
/* eslint-disable vue/require-prop-types */
/* eslint-disable vue/require-default-prop */
import { setInboundDate } from '@/api/receiving'
import { CloseOrder, OpenOrder } from '@/api/accounting'

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
      closeVisible: false,
      popVisible1: false,
      popVisible2: false,
      isAppliedMinCharge: false,
      closeDate: '',
      arrivedTime: ''
    }
  },
  mounted() {

  },
  methods: {
    onCloseClicked() {
      if (this.closeDate) {
        this.popVisible1 = false
        CloseOrder(this.masterOrder.container, 'MasterOrder', this.closeDate, this.isAppliedMinCharge).then(() => {
          this.$emit('reloadOrder')
          this.closeVisible = false
        })
      } else {
        this.$message({
          message: 'Please select a close date',
          type: 'error'
        })
      }
    },
    onOpenClicked() {
      this.popVisible2 = false
      OpenOrder(this.masterOrder.container, 'MasterOrder').then(() => {
        this.$emit('reloadOrder')
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
    },
    reloadOrder() {
      this.$emit('reloadOrder')
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
