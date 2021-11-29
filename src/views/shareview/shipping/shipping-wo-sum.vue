<template>
  <div>
    <h1>Shipping Order Detail Page</h1>
    <el-button @click="btnBackClicked">Back</el-button>
    <el-button class="gb-button" :disabled="step<3" :loading="loading" @click="downloadWOHandler()">Download WO</el-button>
    <el-button class="gb-button" :disabled="step<3" :loading="loading" @click="downloadBOLHandler()">Download BOL</el-button>
    <div style="margin-top:20px">
      <el-steps :active="step" finish-status="success" align-center>
        <el-step title="Start" description="Waiting for picking" />
        <el-step title="Step1: Picking" description="Waiting for drafting" />
        <el-step title="Step2: Draft" description="Waiting for pushing" />
        <el-step title="Step3: Pushed" description="Wairing for processing" />
        <el-step title="Step4: Processing" description="Waiting for ready" />
        <el-step title="Step5: Ready" description="Waiting for releasing" />
        <el-step :title="shipOrder.isPrereleasing ? 'Step6: Pre-released' : 'Step6: Released'" description="Waiting for confirming" />
        <el-step :title="step===9?'Cancelled':'Confirmed'" :description="step===9?'Order cancelled':'Order completed'" />
      </el-steps>
    </div>
    <div>
      <h2>Summary</h2>
      <el-form label-position="left" inline class="gb-table-expand" label-width="220px">
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
        <el-form-item label="Created Date">
          <span>{{ transferDate(shipOrder.createDate) }}</span>
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
        <el-form-item label="Cancelled Date">
          <span>{{ transferDate(shipOrder.cancelDate) }}</span>
        </el-form-item>
        <el-form-item label="Latest Invoice Generated Date">
          <span>{{ transferDate(shipOrder.closeDate) }}</span>
        </el-form-item>
        <el-form-item label="Created By">
          <span>{{ shipOrder.createBy }}</span>
        </el-form-item>
        <el-form-item label="Push By">
          <span>{{ shipOrder.placedBy }}</span>
        </el-form-item>
        <el-form-item label="Start Process By">
          <span>{{ shipOrder.startedBy }}</span>
        </el-form-item>
        <el-form-item label="Released By">
          <span>{{ shipOrder.releasedBy }}</span>
        </el-form-item>
        <el-form-item label="Shipped By">
          <span>{{ shipOrder.shippedBy }}</span>
        </el-form-item>
        <el-form-item label="Confirmed By">
          <span>{{ shipOrder.confirmedBy }}</span>
        </el-form-item>
        <el-form-item label="Warehouse Loc">
          <span>{{ shipOrder.warehouseLocation }}</span>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      title="Select Freight Charge"
      :visible.sync="bolVisible"
      top="5vh"
      width="350px"
      :lock-scroll="false"
    >
      <el-form ref="form-required" :rules="rules" :model="formData" label-width="130px">
        <el-form-item label="Freight Charge" prop="freightCharge">
          <el-select v-model="formData.freightCharge" placeholder="-- Please Select --">
            <el-option
              v-for="item in freightCharge"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Operator" prop="operator">
          <el-input v-model="formData.operator" disabled />
        </el-form-item>
      </el-form>
      <el-button :loading="loading" type="primary" @click="onDownloadClicked">Download</el-button>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable vue/require-prop-types */
/* eslint-disable handle-callback-err */
/* eslint-disable vue/require-default-prop */
import { generateWO, generateBOL } from '@/api/shipping'
import { downloadFile } from '@/api/receiving'
import { frieghtCharge } from '@/scripts/dropdown'
import store from '@/store'

export default {
  props: {
    shipOrder: {},
    step: Number
  },
  data() {
    return {
      loading: false,
      bolVisible: false,
      freightCharge: frieghtCharge,
      formData: {
        freightCharge: '',
        operator: store.getters.name
      },
      rules: {
        freightCharge: [
          { required: true, message: 'Please select freight charge', trigger: 'change' }
        ]
      }
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
      this.loading = true
      generateWO(this.shipOrder.id).then(body => {
        this.$message({
          message: 'Downloading...',
          type: 'success'
        })
        downloadFile(body.data, 'Work Order')
        this.loading = false
      }).catch(error => {
        this.loading = false
      })
    },
    downloadBOLHandler() {
      this.bolVisible = true
      this.formData.freightCharge = null
    },
    onDownloadClicked() {
      this.$refs['form-required'].validate((valid) => {
        if (valid) {
          this.loading = true
          generateBOL(this.shipOrder.id, this.formData.freightCharge, this.formData.operator).then(body => {
            this.$message({
              message: 'Downloading...',
              type: 'success'
            })
            downloadFile(body.data, 'BOL')
            this.loading = false
            this.bolVisible = false
          }).catch(error => {
            this.loading = false
            this.bolVisible = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
