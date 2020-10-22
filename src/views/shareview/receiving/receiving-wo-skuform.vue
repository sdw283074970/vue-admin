<template>
  <div>
    <el-form ref="form-required" :rules="rules" :model="formData" label-width="150px">
      <el-row type="flex" class="row-bg">
        <el-col :span="12">
          <el-form-item label="FBA Shmt ID/SKU" prop="shipmentId">
            <el-input v-model="formData.shipmentId" :disabled="isAdjust" />
          </el-form-item>
          <el-form-item label="Amz Ref ID" prop="amzRefId">
            <el-input v-model="formData.amzRefId" :disabled="isAdjust" />
          </el-form-item>
          <el-form-item label="FBA Whse Code" prop="warehouseCode">
            <el-input v-model="formData.warehouseCode" :disabled="isAdjust" />
          </el-form-item>
          <el-form-item label="How to Deliver">
            <el-input v-model="formData.howToDeliver" :disabled="isAdjust" />
          </el-form-item>
          <el-form-item label="Actual CBM" prop="actualCBM">
            <el-input v-model="formData.actualCBM" v-positive="'float'" :disabled="!isAdjust" />
          </el-form-item>
          <el-form-item label="Actual G.W." prop="actualGrossWeight">
            <el-input v-model="formData.actualGrossWeight" v-positive="'float'" :disabled="!isAdjust" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="GW(KG)" prop="grossWeight">
            <el-input v-model="formData.grossWeight" v-positive="'float'" :disabled="isAdjust" />
          </el-form-item>
          <el-form-item label="CBM" prop="cbm">
            <el-input v-model="formData.cbm" v-positive="'float'" :disabled="isAdjust" />
          </el-form-item>
          <el-form-item label="Quantity" prop="quantity">
            <el-input v-model="formData.quantity" :disabled="isAdjust||step>1" />
          </el-form-item>
          <el-form-item label="Barcode">
            <el-input v-model="formData.barcode" />
          </el-form-item>
          <el-form-item label="Is Oversize" prop="lotSize">
            <el-input v-model="formData.lotSize" />
          </el-form-item>
          <el-form-item label="Actual Quantity" prop="actualQuantity">
            <el-input v-model.number="formData.actualQuantity" :disabled="!isAdjust" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="Remark">
          <el-input v-model="formData.remark" type="textarea" style="width:620px" />
        </el-form-item>
      </el-row>
    </el-form>
    <div style="margin-bottom:20px;text-align:center">
      <el-button v-if="!isEdit && !isAdjust" type="primary" @click="addHandler">Add</el-button>
      <el-button v-if="isEdit" type="primary" @click="updateHandler">Update</el-button>
      <el-button v-if="isAdjust" type="primary" @click="adjustHandler">Adjust</el-button>
      <el-button @click="onCancelClicked">Close</el-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { addNewSKU } from '@/api/receiving'

export default {
  props: {
    formData: Object,
    isEdit: Boolean,
    isAdjust: Boolean,
    step: Number
  },
  data(){
    return{
        loading: false,
        rules: {
          shipmentId: [
            { required: true, message: 'Please input FBA Shipment Id or sku', trigger: 'change' }
          ],
          amzRefId: [
            { required: true, message: 'Please input Amz Reference Id or NA', trigger: 'change' }
          ],
          warehouseCode: [
            { required: true, message: 'Please input FBA whse Id or NA', trigger: 'change' }
          ],
          grossWeight: [
            { required: true, message: 'Please input the gross weight or 0', trigger: 'change' },
            // { type: 'number', message: 'Field must be number', trigger: 'change' }
          ],
          cbm: [
            { required: true, message: 'Please input CBM or 0', trigger: 'change' },
            // { type: 'decimal', message: 'Field must be number', trigger: 'change' }
          ],
          quantity: [
            { required: true, message: 'Please input the quantity', trigger: 'change' },
            // { type: 'number', message: 'Field must be number', trigger: 'change' }
          ],
          lotSize: [
            { required: true, message: 'Please verify if this item is over sized', trigger: 'change' },
          ],
          actualCBM: [
            { required: true, message: 'Please input the actual received CBM', trigger: 'change' },
            // { type: 'number', message: 'Field must be number', trigger: 'change' }
          ],
          actualGrossWeight: [
            { required: true, message: 'Please input the actual received gross weight', trigger: 'change' },
            // { type: 'number', message: 'Field must be number', trigger: 'change' }
          ],
          actualQuantity: [
            { required: true, message: 'Please input the actual received quantity', trigger: 'change' },
            { type: 'number', message: 'Field must be number', trigger: 'change' }
          ]
        }
    }
  },
  methods:{
      addHandler: function() {
        this.$refs['form-required'].validate((valid) => {
            if (valid) {
                this.$emit('onAddClicked', this.formData);
            } else {
                console.log('error submit!!');
                return false;
            }
        });
      },
      updateHandler: function() {
        this.$refs['form-required'].validate((valid) => {
            if (valid) {
                this.$emit('onEditConfirmedClicked', this.formData.id);
            } else {
                console.log('error submit!!');
                return false;
            }
        });
      },
      adjustHandler: function() {
        this.$refs['form-required'].validate((valid) => {
            if (valid) {
                this.$emit('onAdjustConfirmedClicked', this.formData.id);
            } else {
                console.log('error submit!!');
                return false;
            }
        });
      },
      onCancelClicked: function(){
          this.$emit('onCancelClicked');
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
