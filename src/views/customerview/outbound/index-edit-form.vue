<template>
  <div>
    <!-- <h2>{{ isEdit ? 'Create New Shipping Order' : 'Edit Shipping Order' }}</h2> -->
    <el-form ref="form-required" :rules="rules" :model="formData" label-width="150px">
      <el-form-item label="Ship Order #" prop="shipOrderNumber">
        <el-input v-model="formData.shipOrderNumber" :disabled="formData.status=='Picking'||formData.status=='New Created'?false:true" />
      </el-form-item>
      <el-form-item label="Customer Code" prop="customerCode">
        <el-select
          v-model="formData.customerCode"
          filterable
          disabled
          placeholder="Input key word"
        >
          <el-option
            v-for="item in customerCodeOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Warehouse loc" prop="warehouseLocation">
        <el-select
          v-model="formData.warehouseLocation"
          filterable
          collapse-tags
          placeholder="-- Warehouse --"
        >
          <el-option
            v-for="item in warehouseLocations"
            :key="item.warehouseCode"
            :label="item.warehouseCode + ' - ' + item.warehouseName"
            :value="item.warehouseCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Order Type">
        <el-radio-group v-model="formData.orderType">
          <el-radio label="Standard" />
          <el-radio label="Ecommerce" />
          <el-radio label="LooseCarton" />
          <el-radio label="Adjustment" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="ETS" prop="ets">
        <el-date-picker v-model="formData.ets" type="date" placeholder="Select Date" value-format="yyyy-MM-dd" style="width:170px" />
      </el-form-item>
      <el-form-item label="Ets Time Rnage" prop="etsTimeRange">
        <el-input v-model="formData.etsTimeRange" placeholder="Input Time Range" style="width:170px" />
      </el-form-item>
      <el-form-item label="Destination" prop="destination">
        <el-select
          v-model="formData.destination"
          filterable
          allow-create
          default-first-option
          placeholder="Input key word"
        >
          <el-option
            v-for="item in destinationOptions"
            :key="item.warehouseCode"
            :label="item.warehouseCode"
            :value="item.warehouseCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Carrier" prop="carrier">
        <el-input v-model="formData.carrier" />
      </el-form-item>
      <el-form-item label="Quick Instruction">
        <el-input v-model="formData.instruction" />
      </el-form-item>
    </el-form>
    <div>
      <el-form ref="form" :model="formData" label-width="150px" style="float:left">
        <el-form-item label="Sub-customer">
          <el-input v-model="formData.subCustomer" />
        </el-form-item>
        <el-form-item label="Pick Reference">
          <el-input v-model="formData.pickReference" />
        </el-form-item>
        <el-form-item label="Batch #">
          <el-input v-model="formData.batchNumber" />
        </el-form-item>
      </el-form>
      <el-form ref="form" :model="formData" label-width="150px" style="float:right;margin-right:30px">
        <el-form-item label="BOL #">
          <el-input v-model="formData.bolNumber" />
        </el-form-item>
        <el-form-item label="Pick #">
          <el-input v-model="formData.pickNumber" />
        </el-form-item>
        <el-form-item label="PO #">
          <el-input v-model="formData.purchaseOrderNumber" />
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-bottom:20px;margin-left:40px">
      <el-button v-if="!isEdit" type="primary" @click="createHandler">Create</el-button>
      <el-button v-if="isEdit" type="primary" @click="updateHandler">Update</el-button>
      <el-button @click="onCancelClicked">Cancel</el-button>
    </div>
  </div>
</template>

<script>
import { outboundOrderCreateRules } from '@/scripts/rules'
import { getWarehouseLocations } from '@/api/generic'

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
    }
  },
  data() {
    return {
      loading: false,
      warehouseLocations: [],
      rules: outboundOrderCreateRules
    }
  },
  mounted() {
    getWarehouseLocations().then(
      body => {
        this.warehouseLocations = body.data
      }
    )
  },
  methods: {
    createHandler: function() {
      this.$refs['form-required'].validate((valid) => {
        if (valid) {
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
