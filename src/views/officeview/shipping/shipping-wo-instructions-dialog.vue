<template>
  <div>
    <el-form ref="form-required" :rules="rules" :model="instruction" label-width="150px">
      <el-form-item v-if="!isResult" label="Description" prop="description">
        <el-input v-model="instruction.description" type="textarea" style="width:90%" maxlength="200" show-word-limit />
      </el-form-item>
      <el-form-item v-if="!isResult&&!isWarehouse" label-width="550px" label="Is Instruction (visible to warehouse, office, customer)">
        <el-switch
          v-model="instruction.isInstruction"
          style="margin-left:10px"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="Yes"
          inactive-text="No"
          :disabled="step>2"
        />
      </el-form-item>
      <el-form-item v-if="!isResult&&!isWarehouse" label-width="550px" label="Is Operation (visible to warehouse, office)">
        <el-switch
          v-model="instruction.isOperation"
          style="margin-left:10px"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="Yes"
          inactive-text="No"
        />
      </el-form-item>
      <el-form-item v-if="!isResult&&!isWarehouse" label-width="550px" label="Is Charging (visible to office only)">
        <el-switch
          v-model="instruction.isChargingItem"
          style="margin-left:10px"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="Yes"
          inactive-text="No"
        />
      </el-form-item>
      <el-form-item v-if="isResult" label="Result" prop="result">
        <el-input v-model="instruction.result" type="textarea" style="width:90%" maxlength="200" show-word-limit />
      </el-form-item>
    </el-form>
    <div style="text-align:right;margin-right:7%">
      <el-button v-if="!isEdit" type="primary" @click="createHandler">Create</el-button>
      <el-button v-if="isEdit&&!isResult&&!isWarehouse" type="primary" @click="updateHandler">Update Description</el-button>
      <el-button v-if="isWarehouse" type="primary" @click="onCommentClicked">Update Comment</el-button>
      <el-button v-if="isResult" type="primary" @click="resultHandler">Send Result</el-button>
      <el-button @click="onCancelClicked">Cancel</el-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

import { createNewInstruction, updateInstruction, resultInstruction, updateComment, createNewInstructionByModel, updateInstructionbyModel } from '@/api/shipping'
import { ALPN_ENABLED } from 'constants';

export default {
  props: {
    instruction: {},
    step: Number,
    isResult: Boolean,
    isEdit: Boolean,
    visible: Boolean,
    reference: String,
    orderType: String,
    isWarehouse: Boolean
  },
  data(){
    return{
        // isChargingItem: this.instruction.isChargingItem,
        // isChargingItemLocal: false,
        rules: {
          description: [
            { required: true, message: 'Please input description', trigger: 'change' }
          ],
          result: [
            { required: true, message: 'Please input result', trigger: 'change' }
          ]
        }
    }
  },
  // 同时computed和watch变量isChargingItem是为了监视父模块传来的值的变化，还要满足有setter传用户输入的新值
//   computed: {
//     isChargingItem: function(){ return this.instruction.isChargingItem },
//   },
//   watch: {
//     isChargingItem: function(val){ this.isChargingItemLocal = val}
//   },
  methods:{
    createHandler: function(){
        this.$refs['form-required'].validate((valid) => {
            if (valid) {
                createNewInstructionByModel(this.instruction).then(body => {
                    this.$emit('onCreatedSucceed', body.data);
                    this.$emit('onCancelClicked');
                })
            } else {
                console.log('error submit!!');
                return false;
            }
        });
    },
    updateHandler: function(){
        this.$refs['form-required'].validate((valid) => {
            if (valid) {
                updateInstructionbyModel('UpdateInstruction', this.instruction).then(() => {
                    this.$emit('onUpdateSucceed');
                    this.$emit('onCancelClicked');
                });
            }
            else {
                console.log('error submit!!');
                return false;
            }
        });
    },
    resultHandler: function(){
        this.$refs['form-required'].validate((valid) => {
            if (valid) {
                updateInstructionbyModel('UpdateResult', this.instruction).then(() => {
                    this.$emit('onResultSucceed');
                    this.$emit('onCancelClicked');
                });
            } else {
                console.log('error submit!!');
                return false;
            }
        });
    },
    onCancelClicked: function(){
        this.$emit('onCancelClicked');
    },
    onCommentClicked() {
        this.$refs['form-required'].validate((valid) => {
            if (valid) {
                updateInstructionbyModel('UpdateComment', this.instruction).then(() => {
                    this.$emit('onUpdateSucceed');
                    this.$emit('onCancelClicked');
                });
            }
            else {
                console.log('error submit!!');
                return false;
            }
        });
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
