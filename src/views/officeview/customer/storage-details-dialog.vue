<template>
  <div>
    <el-form ref="form-required" :rules="rules" :model="ladder" label-width="150px">
      <el-form-item label="From" prop="from">
        <el-input v-model.number="ladder.from" controls-position="right" disabled>
          <template slot="append">{{ '(th) ' + storageTemp.chargePeriod }}</template>
        </el-input>
      </el-form-item>
      <el-form-item label="To" prop="to">
        <el-input v-model.number="ladder.to" controls-position="right">
          <template slot="append">{{ '(th) ' + storageTemp.chargePeriod }}</template>
        </el-input>
      </el-form-item>
      <el-form-item label="Fee" prop="fee">
        <el-input v-model.number="ladder.fee">
          <template slot="append">{{ storageTemp.currency + '/' + storageTemp.chargePeriod }}</template>
        </el-input>
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

import { createNewLadder, updateLadder  } from '@/api/customer'

export default {
  props: {
      ladder: Object,
      storageTemp: Object,
      isEdit: Boolean,
      tempDetails: Array,
      fromTime: Number
  },
  data(){
    const validateTo = (rule, value, callback) => {
        if (value < this.ladder.from) {
        callback(new Error('Cannot be smaller than FROM value'))
        } else {
        callback()
        }
    }
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
          to: [
            { required: true, message: 'This filed is required', trigger: 'change' },
            { type: 'number', message: 'This filed must be number', trigger: 'change' },
            { validator: validateTo, trigger: 'change'}
          ],
          fee: [
            { required: true, message: 'This filed is required', trigger: 'change' },
            { type: 'number', message: 'This filed must be number'}
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
    },
    onToChange(val) {
        alert('@')
        if (typeof val === 'number' && val < this.ladder.from)
            this.ladder.to = this.ladder.from
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
    .el-input{
      width:200px
    }
</style>
