<template>
  <div>
    <h2>Control Panel</h2>
    <h3>Invoice Status: {{ shipOrder.invoiceStatus }}</h3>
    <div style="margin-bottom:10px">
      <div>
        <el-button :disabled="step>2" class="gb-button" type="primary" @click="onPushClicked">Approve And Push</el-button>
        <el-button class="gb-button" type="primary" :disabled="shipOrder.invoiceStatus!='Await'" @click="closeVisible=true">Close Order</el-button>

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
          <el-button slot="reference" class="gb-button" type="warning" :disabled="shipOrder.invoiceStatus=='Await'">Re-open Order</el-button>
        </el-popover>
        <el-button :disabled="step!=6" class="gb-button" type="primary" @click="shippedVisible=true">Set Shipped Date</el-button>
      </div>
    </div>

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

    </el-dialog>

    <el-dialog
      title="Select Shipped Date"
      :visible.sync="shippedVisible"
      top="5vh"
      width="350px"
      :lock-scroll="false"
    >
      <div style="text-align:right">
        <label>Shipped Date:</label>
        <el-date-picker v-model="shippedDate" type="date" placeholder="Select a date" value-format="yyyy-MM-dd" style="width:180px;" />
      </div>
      <div style="text-align:right;margin-right:10px">
        <el-popover
          v-model="popVisible3"
          placement="top"
          width="420"
        >
          <p>This operation is unreversible.</p>
          <p>You will take 100% responsibility for this operation.</p>
          <p>Are you sure you want to continue?</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="popVisible3 = false">No, I am going to double check this order</el-button>
            <el-button type="primary" size="mini" @click="onShippedClicked">Yes, I understand and will take all responsibilities</el-button>
          </div>
          <el-button slot="reference" class="gb-button" type="primary">Confirm Shipping</el-button>
        </el-popover>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable vue/require-prop-type-constructor */
/* eslint-disable vue/require-default-prop */
/* eslint-disable vue/require-prop-types */
import { pushShipOrderStatus } from '@/api/shipping'
import { CloseOrder, OpenOrder, markOrderShipped } from '@/api/accounting'

export default {
  props: {
    shipOrder: {},
    step: 0
  },
  data() {
    return {
      closeVisible: false,
      popVisible1: false,
      popVisible2: false,
      popVisible3: false,
      shippedVisible: false,
      isAppliedMinCharge: false,
      closeDate: '',
      shippedDate: ''
    }
  },
  computed: {
    today: function() {
      var date = new Date()
      return date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + date.getDate().toString()
    }
  },
  watch: {
    step: function(val) {
      if (val === 1) {
        this.pushVisible = true
        this.recallVisible = false
      } else if (val >= 2 && val < 6) {
        this.pushVisible = false
        this.recallVisible = true
      } else {
        this.pushVisible = false
        this.recallVisible = false
      }
    }
  },
  mounted() {

  },
  methods: {
    onCloseClicked() {
      if (this.closeDate) {
        this.popVisible1 = false
        CloseOrder(this.shipOrder.shipOrderNumber, 'ShipOrder', this.closeDate, this.isAppliedMinCharge).then(() => {
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
      OpenOrder(this.shipOrder.shipOrderNumber, 'ShipOrder').then(() => {
        this.$emit('reloadOrder')
      })
    },
    onPushClicked() {
      pushShipOrderStatus(this.$route.params.shipOrderId, this.today).then(() => {
        this.$emit('reloadOrder')
      })
    },
    onShippedClicked() {
      this.popVisible3 = false
      if (this.shippedDate) {
        markOrderShipped(this.shipOrder.id, this.shippedDate).then(() => {
          this.$emit('reloadOrder')
          this.shippedVisible = false
        })
      } else {
        this.$message({
          message: 'Please select a shipped date',
          type: 'error'
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
