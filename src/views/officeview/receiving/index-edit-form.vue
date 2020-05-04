<template>
  <div>
    <!-- <h2>{{ isEdit ? 'Create New Shipping Order' : 'Edit Shipping Order' }}</h2> -->
    <!-- <el-form ref="form-required" :rules="rules" :model="formData" label-width="150px">

        </el-form> -->
    <div>
      <el-form ref="form-required" :rules="rules" :model="formData" label-width="150px" style="float:left">
        <el-form-item label="CONTAINER #" prop="container">
          <el-input v-model="formData.container" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="CUSTOMER CODE" prop="customerCode">
          <el-select
            v-model="formData.customerCode"
            filterable
            placeholder="Input key word"
            :disabled="isEdit"
          >
            <el-option
              v-for="item in customerCodeOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="ETA" prop="eta">
          <el-date-picker v-model="formData.eta" type="date" placeholder="Select Date" value-format="yyyy-MM-dd" style="width:170px;" />
        </el-form-item>
        <el-form-item label="ORIGINAL PLTS" prop="originalPlts">
          <el-input v-model="formData.originalPlts" />
        </el-form-item>
        <el-form-item label="INBOUND TYPE" prop="inboundType">
          <el-select v-model="formData.inboundType" placeholder="-- Please Select --">
            <el-option
              v-for="item in inboundTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="UNLOADING TYPE" prop="unloadingType">
          <el-select v-model="formData.unloadingType" placeholder="-- Please Select --">
            <el-option
              v-for="item in unloadingTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="STORAGE TYPE" prop="storageType">
          <el-select v-model="formData.storageType" placeholder="-- Please Select --">
            <el-option
              v-for="item in storageTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="PALLETIZING" prop="palletizing">
          <el-select v-model="formData.palletizing" placeholder="-- Please Select --">
            <el-option
              v-for="item in palletizings"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="PLACE OF RECEIPT">
          <el-input v-model="formData.placeOfReceipt" />
        </el-form-item>
        <el-form-item label="PORT OF LOADING">
          <el-input v-model="formData.portOfLoading" />
        </el-form-item>
      </el-form>
      <el-form ref="form-optional" :model="formData" label-width="150px" style="float:right;margin-right:30px">
        <el-form-item label="CARRIER" prop="carrier">
          <el-input v-model="formData.carrier" />
        </el-form-item>
        <el-form-item label="SUB-CUSTOMER">
          <el-input v-model="formData.subCustomer" />
        </el-form-item>
        <el-form-item label="CONTAINER SIZE" prop="containerSize">
          <el-input v-model="formData.containerSize" />
        </el-form-item>
        <el-form-item label="VESSEL">
          <el-input v-model="formData.vessel" />
        </el-form-item>
        <el-form-item label="VOY">
          <el-input v-model="formData.voy" />
        </el-form-item>
        <el-form-item label="ETA PORT">
          <el-input v-model="formData.etaPort" />
        </el-form-item>
        <el-form-item label="DISCHARGE PORT">
          <el-input v-model="formData.portOfDischarge" />
        </el-form-item>
        <el-form-item label="DELIVERY PORT">
          <el-input v-model="formData.placeOfDelivery" />
        </el-form-item>
        <el-form-item label="SEAL NO.">
          <el-input v-model="formData.sealNnumber" />
        </el-form-item>
        <el-form-item label="INSTRUCTION">
          <el-input v-model="formData.instruction" />
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-bottom:20px;margin-left:40px">
      <el-button v-if="!isEdit" :loading="localLoading" type="primary" @click="createHandler">Create</el-button>
      <el-button v-if="isEdit" :loading="localLoading" type="primary" @click="updateHandler">Update</el-button>
      <el-button :loading="localLoading" @click="onCancelClicked">Cancel</el-button>
    </div>
  </div>
</template>

<script>
import { inboundTypes, unloadingTypes, storageTypes, palletizings } from '@/scripts/dropdown'

export default {
  props: {
    formData: {
      type: Object,
      default: null
    },
    shipOrderStatus: {
      type: String,
      default: ''
    },
    isEdit: Boolean,
    customerCodeOptions: {
      type: Array,
      default: null
    },
    destinationOptions: {
      type: Array,
      default: null
    },
    localLoading: Boolean
  },
  data() {
    return {
      loading: false,
      inboundTypes: inboundTypes,
      unloadingTypes: unloadingTypes,
      storageTypes: storageTypes,
      palletizings: palletizings,
      rules: {
        container: [
          { required: true, message: 'Please input container number', trigger: 'change' }
        ],
        customerCode: [
          { required: true, message: 'Please select customer code', trigger: 'change' }
        ],
        eta: [
          { required: true, message: 'Please select a date', trigger: 'change' }
        ],
        originalPlts: [
          { required: true, message: 'Please input the original Plts', trigger: 'change' }
        ],
        inboundType: [
          { required: true, message: 'Please select inbound type', trigger: 'change' }
        ],
        unloadingType: [
          { required: true, message: 'Please select unloading type', trigger: 'change' }
        ],
        storageType: [
          { required: true, message: 'Please select storage type', trigger: 'change' }
        ],
        palletizing: [
          { required: true, message: 'Please select palletizing', trigger: 'change' }
        ],
        carrier: [
          { required: true, message: 'This filed is required', trigger: 'change' }
        ],
        containerSize: [
          { required: true, message: 'This filed is required', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {

  },
  methods: {
    createHandler: function() {
      this.$refs['form-required'].validate((valid) => {
        if (valid) {
          this.localLoading = true
          this.$emit('onCreateConfirmedClicked')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateHandler: function() {
      this.$refs['form-required'].validate((valid) => {
        if (valid) {
          this.localLoading = true
          this.$emit('onEditConfirmedClicked', this.formData.id)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onCancelClicked: function() {
      this.$emit('onCancelClicked')
    }
  }
}
</script>

<style lang="scss" scoped>
    .input-bar{
      text-align: right
    }
</style>
