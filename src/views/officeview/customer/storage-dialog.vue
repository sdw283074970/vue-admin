<template>
  <div>
    <el-form ref="form-required" :rules="rules" :model="storageTemp" label-width="150px">
      <el-form-item label="Template Name" prop="templateName">
        <el-input v-model="storageTemp.templateName" />
      </el-form-item>
      <el-form-item label="Customer Code" prop="customerCode">
        <el-input v-model="storageTemp.customerCode" disabled />
      </el-form-item>
      <el-form-item label="Period" prop="chargePeriod">
        <el-select v-model="storageTemp.chargePeriod" placeholder="-- Please Select --" @change="$forceUpdate()">
          <el-option
            v-for="item in chargePeriods"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Currency" prop="currency">
        <el-select v-model="storageTemp.currency" placeholder="-- Please Select --">
          <el-option
            v-for="item in currencies"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div style="text-align:right;margin-right:7%">
      <el-button v-if="!isEdit" type="primary" @click="onCreateClicked">Add</el-button>
      <el-button v-if="isEdit" type="primary" @click="onUpdateClicked">Update</el-button>
      <el-button @click="onCancelClicked">Cancel</el-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

import { createNewStorageTemp, updateStorageTemp  } from '@/api/customer'

export default {
  props: {
      storageTemp: Object,
      customerId: Number,
      isEdit: Boolean
  },
  data(){
    return{
        chargePeriods: [
          {label: 'Day', value: 'Day'},
          {label: 'Week', value: 'Week'},
          {label: 'Month', value: 'Month'}
        ],
        currencies: [
          {label: 'USD', value: 'USD'},
          {label: 'RMB', value: 'RMB'},
          {label: 'EUR', value: 'EUR'}
        ],
        rules: {
          templateName: [
            { required: true, message: 'This filed is required', trigger: 'change' }
          ],
          customerCode: [
            { required: true, message: 'This filed is required', trigger: 'change' }
          ],
          chargePeriod: [
            { required: true, message: 'This filed is required', trigger: 'change' }
          ],
          currency: [
            { required: true, message: 'This filed is required', trigger: 'change' }
          ]
        }
    }
  },
  methods:{
    onCreateClicked() {
      this.$refs['form-required'].validate((valid) => {
        if (valid)
        {
          createNewStorageTemp(this.storageTemp.templateName, this.storageTemp.customerCode, this.storageTemp.chargePeriod, this.storageTemp.currency).then(() => {
            this.$emit('reloadStorage')
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    onUpdateClicked() {
      updateStorageTemp(this.storageTemp.id, this.storageTemp.templateName, this.storageTemp.customerCode, this.storageTemp.chargePeriod, this.storageTemp.currency).then(() => {
        this.$emit('reloadStorage')
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
