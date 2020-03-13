<template>
  <div>
    <h3>Reference: {{ reference }}</h3>
    <h3>Invoice from: {{ orderType }}</h3>
    <h3>ORG PLTS: {{ originalPallets }} | PLTS: {{ pallets }} | CTNS: {{ cartons }}</h3>
    <el-form ref="form-required" :rules="rules" :model="service" label-width="150px">
      <el-form-item label="Date of Cost" prop="dateOfCost">
        <el-date-picker v-model="service.dateOfCost" type="date" placeholder="Select Date" value-format="yyyy-MM-dd" style="width:170px;" />
      </el-form-item>
      <el-form-item label="Charging Type" prop="chargingType">
        <el-select
          v-model="service.chargingType"
          placeholder="-- Please Select --"
          @change="onChargingTypeChange"
        >
          <el-option
            v-for="item in chargingTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="Charging Item"
        prop="chargingItem"
      >
        <el-select v-model="service.chargingItem" placeholder="-- Please Select --" @change="onChargingNameChange">
          <el-option
            v-for="item in chargingItemOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Cost" prop="cost">
        <el-input v-model="service.cost" />
      </el-form-item>
      <el-form-item label="Rate" prop="rate">
        <el-input v-model="service.rate" />
      </el-form-item>
      <el-form-item label="Quantity" prop="quantity">
        <el-input v-model="service.quantity" />
      </el-form-item>
      <el-form-item label="Description" prop="description">
        <p>{{ service.description }}</p>
      </el-form-item>
      <el-form-item label="Memo">
        <el-input v-model="service.memo" :autosize="{ minRows: 2, maxRows: 6}" type="textarea" />
      </el-form-item>
      <el-form-item label="Original Amount" prop="amount">
        <el-input v-model="service.amount" />
      </el-form-item>
      <el-form-item label="Discount" prop="discount">
        <el-input v-model="service.discount" />
      </el-form-item>
    </el-form>
    <div style="text-align:right;margin-right:7%">
      <el-button v-if="!isEdit" type="primary" @click="onChargeClicked">Charge</el-button>
      <el-button v-if="isEdit" type="primary" @click="onUpdateClicked">Update</el-button>
      <el-button @click="onCancelClicked">Cancel</el-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

import { getQuantityInfo, getChargingType, getChargingItemNames, getChargingDetailByName, createNewChargingDetail } from '@/api/accounting'

export default {
  props: {
      reference: String,
      customerId: Number,
      isEdit: Boolean,
      orderType: String
  },
  data(){
    return{
        originalPallets: 0,
        pallets: 0,
        cartons: 0,
        chargingTypeOptions: [],
        chargingItemOptions: [],
        service: {
            activity: '',
            amount: 0,
            chargingType: '',
            cost: 0,
            dateOfCost: '',
            discount: 1,
            memo: '',
            quantity: 0,
            rate: 0,
            unit: '',
            description: ''
        },
        rules: {
          dateOfCost: [
            { required: true, message: 'Please select a date', trigger: 'change' }
          ],
          chargingType: [
            { required: true, message: 'Please select a type', trigger: 'change' }
          ],
          chargingItem: [
            { required: true, message: 'Please select an item', trigger: 'change' }
          ],
          cost: [
            { required: true, message: 'Please input cost', trigger: 'change' }
          ],
          rate: [
            { required: true, message: 'Please input rate', trigger: 'change' }
          ],
          unit: [
            { required: true, message: 'Please select unit', trigger: 'change' }
          ],
          quantity: [
            { required: true, message: 'Please input quantity', trigger: 'change' }
          ],
          amount: [
            { required: true, message: 'Please input amount', trigger: 'change' }
          ],
          discount: [
            { required: true, message: 'Please input discount', trigger: 'change' }
          ]
        }
    }
  },
  methods:{
    onChargeClicked() {
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
      updateService(this.service.id, this.service).then(() => {
        this.$emit('reloadOrder')
      })
    },
    onCancelClicked() {
      this.$emit('closeDialog')
    },
    onChargingTypeChange(value) {
      getChargingItemNames(this.reference, this.orderType, value).then(body => {
          let that = this.chargingItemOptions
          body.data.forEach(e => {
              that.push({ value: e, label: e})
          })
      })
    },
    onChargingNameChange(value) {
      getChargingDetailByName(this.reference, this.orderType, value).then(body => {
          this.service.rate = body.data.rate
          this.service.unit = body.data.unit
          this.service.description = body.data.description
      })
    }
  },
  mounted() {
      getQuantityInfo(this.reference, this.orderType).then(body => {
          this.pallets = body.data.pallets
          this.cartons = body.data.cartons
          this.originalPallets = body.data.originalPallets
      })
      getChargingType(this.reference, this.orderType).then(body => {
          let that = this.chargingTypeOptions
          body.data.forEach(element => {
              that.push({ value: element, label: element})
          });
      })
  }
}
</script>

<style lang="scss" scoped>
    .input-bar{
      text-align: right
    }
</style>
