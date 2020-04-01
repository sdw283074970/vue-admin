<template>
  <div>
    <el-form ref="form-required" :rules="rules" :model="ladder" label-width="80px">
      <el-form-item label="From" prop="from">
        <el-input v-model.number="ladder.from" controls-position="right" disabled>
          <template slot="append">{{ '(th) ' + storageTemp.chargePeriod }}</template>
        </el-input>
      </el-form-item>
      <el-form-item label="To" prop="to">
        <el-input v-model.number="ladder.to" controls-position="right" :disabled="isEdit">
          <template slot="append">{{ '(th) ' + storageTemp.chargePeriod }}</template>
        </el-input>
      </el-form-item>
      <el-form-item label="Fee" prop="fee">
        <el-input v-model="ladder.fee">
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
// import { validators, validateNumber } from '@/scripts/validator'
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
      if (!value) {
        callback(new Error('This filed is required'))
      }
      value = Number(value)
      if (typeof value === 'number' && !isNaN(value)) {
        if (value < this.ladder.from) {
          callback(new Error('Cannot be smaller than FROM value'))
        } else {
          callback()
        }
      } else {
        callback(new Error('Please enter valid number'))
      }
    }

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
            { validator: validateTo, trigger: 'change'}
          ],
          fee: [
            { validator: validatePrice, trigger: 'change'}
          ]
        }
    }
  },
  methods:{
    onCreateClicked() {
      this.$refs['form-required'].validate((valid) => {
        if (valid)
        {
          createNewLadder(this.storageTemp.id, this.ladder.from, this.ladder.to, this.ladder.fee).then(() => {
            this.$emit('reloadStorageDetails')
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    onUpdateClicked() {
      updateLadder(this.ladder.id, this.ladder.from, this.ladder.to, this.ladder.fee).then(() => {
        this.$emit('reloadStorageDetails')
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
