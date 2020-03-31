<template>
  <div>
    <el-form ref="form-required" :rules="rules" :model="service" label-width="150px">
      <el-form-item label="Charging Type" prop="chargingType">
        <el-select v-model="service.chargingType" placeholder="-- Please Select --">
          <el-option
            v-for="item in chargingTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Charging Name" prop="name">
        <el-input v-model="service.name" />
      </el-form-item>
      <el-form-item label="Rate" prop="rate">
        <el-input-number v-model="service.rate" :precision="2" :step="1" :min="0" />
      </el-form-item>
      <el-form-item label="UOM" prop="unit">
        <el-select v-model="service.unit" placeholder="-- Please Select --">
          <el-option
            v-for="item in units"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Description">
        <el-input v-model="service.description" :autosize="{ minRows: 2, maxRows: 6}" type="textarea" />
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

import { createNewService, updateService  } from '@/api/customer'

export default {
  props: {
      service: Object,
      customerId: Number,
      isEdit: Boolean
  },
  data(){
    return{
        chargingTypes: [
          {label: 'Receiving', value: 'Receiving'},
          {label: 'Operation', value: 'Operation'},
          {label: 'Storage', value: 'Storage'},
          {label: 'Shipping', value: 'Shipping'},
          {label: 'Other', value: 'Other'}
        ],
        units: [
          {label: 'CBM', value: 'CBM'},
          {label: 'CONTAINER', value: 'CONTAINER'},
          {label: 'CTNS', value: 'CTNS'},
          {label: 'WAITING HOUR', value: 'WH'},
          {label: 'WORK HOUR', value: 'HR'},
          {label: 'LABEL', value: 'LABEL'},
          {label: 'PC', value: 'PC'},
          {label: 'PLT', value: 'PLT'},
          {label: 'PO', value: 'PO'},
          {label: 'ORDER', value: 'ORDER'},
          {label: 'OTHER', value: 'OTHER'},
          {label: 'SET', value: 'SET'},
          {label: 'SHIPMENT', value: 'SHIPMENT'},
          {label: 'SKU', value: 'SKU'},
          {label: 'STORAGE', value: 'STORAGE'},
          {label: 'TRAILER', value: 'TRAILER'}
        ],
        rules: {
          name: [
            { required: true, message: 'Please input name', trigger: 'change' }
          ],
          chargingType: [
            { required: true, message: 'Please select type', trigger: 'change' }
          ],
          rate: [
            { required: true, message: 'Please input rate', trigger: 'change' }
          ],
          unit: [
            { required: true, message: 'Please select unit', trigger: 'change' }
          ],
        }
    }
  },
  methods:{
    onCreateClicked() {
      this.$refs['form-required'].validate((valid) => {
        if (valid)
        {
          createNewService(this.service).then(() => {
            this.$emit('reloadServices')
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    onUpdateClicked() {
      updateService(this.service.id, this.service).then(() => {
        this.$emit('reloadServices')
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
