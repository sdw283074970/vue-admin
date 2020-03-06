<template>
  <div>
    <el-form ref="form-required" :rules="rules" :model="template" label-width="150px">
      <el-form-item label="Description" prop="description">
        <el-input v-model="template.description" type="textarea" style="width:90%" maxlength="200" show-word-limit />
      </el-form-item>
      <el-form-item label-width="550px" label="Is customer's instruction(visible to warehouse, office, customer)">
        <el-switch
          v-model="template.isInstruction"
          style="margin-left:10px"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="Yes"
          inactive-text="No"
        />
      </el-form-item>
      <el-form-item label-width="550px" label="Is inner operation(visible to warehouse, office)">
        <el-switch
          v-model="template.isOperation"
          style="margin-left:10px"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="Yes"
          inactive-text="No"
        />
      </el-form-item>
      <el-form-item label-width="550px" label="Is charging item(visible to office only)">
        <el-switch
          v-model="template.isCharging"
          style="margin-left:10px"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="Yes"
          inactive-text="No"
        />
      </el-form-item>
      <el-form-item label-width="550px" label="Is Apply To Master Order">
        <el-switch
          v-model="template.isApplyToMasterOrder"
          style="margin-left:10px"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="Yes"
          inactive-text="No"
        />
      </el-form-item>
      <el-form-item label-width="550px" label="Is Apply To Ship Order">
        <el-switch
          v-model="template.isApplyToShipOrder"
          style="margin-left:10px"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="Yes"
          inactive-text="No"
        />
      </el-form-item>
      <el-form-item label-width="550px" label="Is Apply To All Customer">
        <el-switch
          v-model="template.isApplyToAll"
          :disabled="isEdit"
          style="margin-left:10px"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="Yes"
          inactive-text="No"
        />
      </el-form-item>
    </el-form>
    <div style="text-align:right;margin-right:7%">
      <el-button v-if="!isEdit" type="primary" @click="onCreateClicked">Create</el-button>
      <el-button v-if="isEdit" type="primary" @click="onUpdateClicked">Update</el-button>
      <el-button @click="onCancelClicked">Cancel</el-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

import { createNewInstructionTemplate, updateInstructionTemplate } from '@/api/customer'

export default {
  props: {
      template: Object,
      customerId: Number,
      isEdit: Boolean
  },
  data(){
    return{
        // isChargingItem: this.instruction.isChargingItem,
        // isChargingItemLocal: false,
        rules: {
          description: [
            { required: true, message: 'Please input description', trigger: 'change' }
          ]
        }
    }
  },
  methods:{
    onCreateClicked() {
      createNewInstructionTemplate(this.customerId, this.template).then(() => {
        this.$emit('reloadTemplates')
      })
    },
    onUpdateClicked() {
      updateInstructionTemplate(this.template.id, this.template).then(() => {
        this.$emit('reloadTemplates')
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
