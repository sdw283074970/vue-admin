<template>
  <div>
    <el-form ref="form-required" :rules="rules" :model="instruction" label-width="150px">
      <el-form-item v-if="!isResult" label="Description" prop="description">
        <el-input v-model="instruction.description" type="textarea" style="width:90%" maxlength="200" show-word-limit />
      </el-form-item>
      <el-form-item v-if="!isResult" label="Is Instruction">
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
      <el-form-item v-if="!isResult" label="Is Charging">
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
      <el-button v-if="isEdit&&!isResult" type="primary" @click="updateHandler">Update Description</el-button>
      <el-button v-if="isResult" type="primary" @click="resultHandler">Send Result</el-button>
      <el-button @click="onCancelClicked">Cancel</el-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

import { createNewInstruction, updateInstruction, resultInstruction } from '@/api/shipping'
import { ALPN_ENABLED } from 'constants';

export default {
  props: {
    instruction: {},
    step: Number,
    isResult: Boolean,
    isEdit: Boolean,
    visible: Boolean,
    reference: String,
    orderType: String
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
                createNewInstruction(this.reference, this.instruction.description, this.instruction.isChargingItem, this.instruction.isInstruction, this.orderType).then(body => {
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
                updateInstruction(this.instruction.id, this.instruction.description, this.instruction.isChargingItem, this.instruction.isInstruction).then(() => {
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
                resultInstruction(this.instruction.id, this.instruction.result).then(() => {
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
