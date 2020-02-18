<template>
  <div>
    <div>
      <el-form ref="form-required" :rules="rules" :model="report" label-width="150px">
        <el-form-item label="Push Date" prop="placeTime">
          <el-date-picker v-model="report.placeTime" :disabled="true" type="date" placeholder="Select Date" value-format="yyyy-MM-dd" style="width:170px;" />
        </el-form-item>
        <el-form-item label="Start Date" prop="startedTime">
          <el-date-picker v-model="report.startedTime" type="date" placeholder="Select Date" value-format="yyyy-MM-dd" style="width:170px;" />
        </el-form-item>
        <el-form-item label="Ready Date" prop="readyTime">
          <el-date-picker v-model="report.readyTime" type="date" placeholder="Select Date" value-format="yyyy-MM-dd" style="width:170px;" />
        </el-form-item>
        <el-form-item label="Pick Man" prop="pickMan">
          <el-input v-model="report.pickMan" />
        </el-form-item>
        <el-form-item label="Lot" prop="lot">
          <el-input v-model="report.lot" />
        </el-form-item>
        <el-form-item label="Verified By" prop="confirmedBy">
          <el-input v-model="report.confirmedBy" />
        </el-form-item>
      </el-form>
    </div>
    <div style="text-align:center">
      <el-button type="success" @click="onFinishProcessingClicked">Finish Processing</el-button>
      <el-button type="info" @click="onUpdateClicked">Save&Update</el-button>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import { updateOrder } from '@/api/shipping'

export default {
    props: {
        shipOrder: Object,
        report: Object
    },
    data(){
        return {
            rules: {
                placeTime: [
                    { required: true, message: 'Please select a date', trigger: 'change' }
                ],
                startedTime: [
                    { required: true, message: 'Please select a date', trigger: 'change' }
                ],
                readyTime: [
                    { required: true, message: 'Please select a date', trigger: 'change' }
                ],
                confirmedBy: [
                    { required: true, message: 'Please assign a name', trigger: 'blur' }
                ],
                pickMan: [
                    { required: true, message: 'Please assign a name', trigger: 'blur' }
                ],
                lot: [
                    { required: true, message: 'Please input the temporary lot', trigger: 'blur' }
                ]
            }
        }
    },
    watch:{

    },
    methods:{
        transferDate: function(date) {
            return date === undefined ? '' : (date.substring(0, 4) === 1900 ? '-' : date.substring(0, 10))
        },
        onFinishProcessingClicked() {
            this.$refs['form-required'].validate((valid) => {
                if (valid) {
                    updateOrder(this.shipOrder.id, 'Finish', this.report).then(() => {
                        this.$emit('onOperationSuccess')
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        onUpdateClicked() {
            this.$refs['form-required'].validate((valid) => {
                if (valid) {
                    updateOrder(this.shipOrder.id, 'Save', this.report).then(() => {
                        this.$emit('onOperationSuccess')
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    },
    mounted() {
        this.report.placeTime = this.shipOrder.placeTime
        this.report.startedTime = this.shipOrder.startedTime
        this.report.confirmedBy = this.shipOrder.confirmedBy
        this.report.pickMan = this.shipOrder.pickMan
        this.report.lot = this.shipOrder.lot
    },
}
</script>

<style lang="scss" scoped>
    .input-bar{
      text-align: right
    }
</style>
