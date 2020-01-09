<template>
  <div>
    <h1>Shipping Work Order Page</h1>
    <el-button @click="btnBackClicked">Back</el-button>
    <el-button class="gb-button" :disabled="step<3" :loading="loading" @click="downloadWOHandler()">Download WO</el-button>
    <el-button class="gb-button" :disabled="step<3" :loading="loading" @click="downloadBOLHandler()">Download BOL</el-button>
    <div style="margin-top:20px">
      <el-steps :active="step" finish-status="success" align-center>
        <el-step title="Step1: Start" description="Waiting for picking" />
        <el-step title="Step2: Picking" description="Waiting for drafting" />
        <el-step title="Step3: Draft" description="Waiting for pushing" />
        <el-step title="Step4: Pushed" description="Wairing for processing" />
        <el-step title="Step5: Processing" description="Waiting for ready" />
        <el-step title="Step6: Ready" description="Waiting for releasing" />
        <el-step title="Step7: Released" description="Waiting for confirming" />
        <el-step title="Step8: Confirmed" description="Order completed" />
      </el-steps>
    </div>
    <div>
      <h2>Summary</h2>
      <el-form label-position="left" inline class="gb-table-expand">
        <el-form-item label="Order #">
          <span>{{ shipOrder.shipOrderNumber }}</span>
        </el-form-item>
        <el-form-item label="Order Type">
          <span>{{ shipOrder.orderType }}</span>
        </el-form-item>
        <el-form-item label="Customer">
          <span>{{ shipOrder.customerCode }}</span>
        </el-form-item>
        <el-form-item label="Sub-customer">
          <span>{{ shipOrder.subCustomer }}</span>
        </el-form-item>
        <el-form-item label="Carrier">
          <span>{{ shipOrder.carrier }}</span>
        </el-form-item>
        <el-form-item label="Destination">
          <span>{{ shipOrder.destination }}</span>
        </el-form-item>
        <el-form-item label="Pick Reference">
          <span>{{ shipOrder.pickReference }}</span>
        </el-form-item>
        <el-form-item label="BOL #">
          <span>{{ shipOrder.bolNumber }}</span>
        </el-form-item>
        <el-form-item label="Pick #">
          <span>{{ shipOrder.pickNumber }}</span>
        </el-form-item>
        <el-form-item label="PO #">
          <span>{{ shipOrder.purchaseOrderNumber }}</span>
        </el-form-item>
        <el-form-item label="QUick Instruction">
          <span>{{ shipOrder.instruction }}</span>
        </el-form-item>
        <el-form-item label="Placed Date">
          <span>{{ transferDate(shipOrder.placeTime) }}</span>
        </el-form-item>
        <el-form-item label="Start Time">
          <span>{{ transferDate(shipOrder.startedTime) }}</span>
        </el-form-item>
        <el-form-item label="Ready Time">
          <span>{{ transferDate(shipOrder.readyTime) }}</span>
        </el-form-item>
        <el-form-item label="Released Date">
          <span>{{ transferDate(shipOrder.releasedDate) }}</span>
        </el-form-item>
        <el-form-item label="Shipped Date">
          <span>{{ transferDate(shipOrder.shipDate) }}</span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/require-prop-types */
/* eslint-disable vue/require-default-prop */
import { generateWO, generateBOL } from "@/api/shipping"
import { downloadFile } from '@/api/receiving'

export default {
  props: {
    shipOrder: {},
    step: Number
  },
  data() {
    return {
      loading: false
    }
  },
  mounted() {

  },
  methods: {
    transferDate: function(date) {
      return date === undefined ? '' : (date.substring(0, 4) === '1900' ? '-' : date.substring(0, 10))
    },
    btnBackClicked: function() {
      this.$router.go(-1)
    },
    downloadWOHandler() {
      this.loading = true;
      generateWO(this.shipOrder.id).then(body => {
        this.$message({
          message: 'Downloading...',
          type: 'success'
        })
        downloadFile(body.data, 'Work Order');
        this.loading = false;
      }).catch(error => {
        this.loading = false;
      })
    },
    downloadBOLHandler() {
      this.loading = true;
      generateBOL(this.shipOrder.id).then(body => {
        this.$message({
          message: 'Downloading...',
          type: 'success'
        })
        downloadFile(body.data, 'BOL');
        this.loading = false;
      }).catch(error => {
        this.loading = false;
      })
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
