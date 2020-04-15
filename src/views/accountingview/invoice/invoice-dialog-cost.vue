<template>
  <div>
    <h3>Reference: {{ reference }}</h3>
    <h3>Invoice from: {{ orderType }}</h3>
    <h3>ORG PLTS: {{ originalPallets }} | PLTS: {{ pallets }} | CTNS: {{ cartons }}</h3>
    <el-form ref="form-required" :rules="rules" :model="service" label-width="150px">
      <el-row>
        <el-col :span="12"><div>
          <el-form-item label="Date of Cost" prop="dateOfCost">
            <el-date-picker v-model="service.dateOfCost" type="date" placeholder="Select Date" value-format="yyyy-MM-dd" style="width:170px;" />
          </el-form-item>
          <el-form-item label="Cost Name" prop="activity">
            <el-input v-model="service.activity" />
          </el-form-item>
        </div></el-col>
        <el-col :span="12"><div>
          <el-form-item label="Cost" prop="cost">
            <el-input v-model="service.cost" />
          </el-form-item>
        </div></el-col>
      </el-row>
      <el-row>
        <el-col :span="21"><div>
          <el-form-item label="Description" prop="description">
            <p>{{ service.description }}</p>
          </el-form-item>
          <el-form-item label="Memo">
            <el-input v-model="service.memo" :autosize="{ minRows: 2, maxRows: 6}" type="textarea" />
          </el-form-item></div></el-col>
      </el-row>
    </el-form>
    <div style="text-align:right;margin-right:7%">
      <el-button v-if="!isEdit" type="primary" @click="onAddClicked">Add</el-button>
      <el-button @click="onCancelClicked">Cancel</el-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

import { getQuantityInfo, getChargingType, getChargingItemNames, getChargingDetailByName, createNewChargingDetail, updateChargingDetail } from '@/api/accounting'

export default {
  props: {
      reference: String,
      customerId: Number,
      isEdit: Boolean,
      orderType: String,
      service: Object,
      invoiceStatus: String
  },
  data(){
    const validatePrice = (rule, value, callback) => {
      if (value === undefined || value === null || value === '') {
        callback(new Error('This filed is required'))
      }
      value = Number(value)
      if (typeof value === 'number' && !isNaN(value)) {
        callback()
      } else {
        callback(new Error('Please enter valid number'))
      }
    }

    return{
        originalPallets: 0,
        pallets: 0,
        cartons: 0,
        chargingTypeOptions: [],
        chargingItemOptions: [],
        rules: {
          dateOfCost: [
            { required: true, message: 'Please select a date', trigger: 'change' }
          ],
          activity: [
            { required: true, message: 'Please select an item', trigger: 'change' }
          ],
          cost: [
            { required: true, message: 'Please input cost', trigger: 'change' }
          ]
        }
    }
  },
  methods:{
    onAddClicked() {
      this.$refs['form-required'].validate((valid) => {
        if (valid)
        {
          createNewChargingDetail(this.reference, this.orderType, this.service).then(() => {
            this.$emit('reloadOrder')
          this.$emit('closeDialog')
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    onUpdateClicked() {      
      this.service.invoiceType = this.orderType
      updateChargingDetail(this.service.id, this.service).then(() => {
        this.$emit('reloadOrder')
      })
    },
    onCancelClicked() {
      this.$emit('closeDialog')
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
    .input-bar{
      text-align: right
    }
</style>
