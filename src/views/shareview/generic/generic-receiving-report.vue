<template>
  <div>
    <div>
      <el-form ref="form-required" :rules="rules" :model="report" label-width="150px" style="float:left">
        <el-form-item label="Arrived Date" prop="inboundDate">
          <el-date-picker v-model="report.inboundDate" type="date" placeholder="Select Date" value-format="yyyy-MM-dd" style="width:170px;" />
        </el-form-item>
        <el-form-item label="Finish Date" prop="unloadFinishTime">
          <el-date-picker v-model="report.unloadFinishTime" type="date" placeholder="Select Date" value-format="yyyy-MM-dd" style="width:170px;" />
        </el-form-item>
        <el-form-item label="Trailer Ava Date" prop="availableTime">
          <el-date-picker v-model="report.availableTime" type="date" placeholder="Select Date" value-format="yyyy-MM-dd" style="width:170px;" />
        </el-form-item>
      </el-form>
      <el-form ref="form-optional" :rules="rules" :model="report" label-width="150px" style="float:right;margin-right:30px">
        <el-form-item label="Trailer Out Date" prop="outTime">
          <el-date-picker v-model="report.outTime" type="date" placeholder="Select Date" value-format="yyyy-MM-dd" style="width:170px;" />
        </el-form-item>
        <el-form-item label="Dock Number" prop="dockNumber">
          <el-input v-model="report.dockNumber" />
        </el-form-item>
        <el-form-item label="Verified By" prop="verifiedBy">
          <el-input v-model="report.verifiedBy" />
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
import { finishProcessing } from '@/api/receiving'

export default {
    props: {
        masterOrder: Object,
        report: Object
    },
    data(){
        return {
            rules: {
                inboundDate: [
                    { required: true, message: 'Please select a date', trigger: 'change' }
                ],
                unloadFinishTime: [
                    { required: true, message: 'Please select a date', trigger: 'change' }
                ],
                availableTime: [
                    { required: true, message: 'Please select a date', trigger: 'change' }
                ],
                verifiedBy: [
                    { required: true, message: 'Please assign a name', trigger: 'change' }
                ],
                dockNumber: [
                    { required: true, message: 'Please input the dock number', trigger: 'change' }
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
                    if (this.report.outTime === '')
                    {
                        this.report.outTime = '1900-01-01'
                    }

                    finishProcessing(this.masterOrder.id, 'Report', this.report).then(() => {
                        this.masterOrder.inboundDate = this.report.inboundDate
                        this.masterOrder.unloadFinishTime = this.report.unloadFinishTime
                        this.masterOrder.outTime = this.report.outTime
                        this.masterOrder.availableTime = this.report.availableTime
                        this.masterOrder.dockNumber = this.report.dockNumber
                        this.masterOrder.verifiedBy = this.report.verifiedBy
                        this.masterOrder.status = 'Received'
                        this.reportVisible = false
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
                    if (this.report.outTime === '')
                    {
                        this.report.outTime = '1900-01-01'
                    }

                    finishProcessing(this.masterOrder.id, 'Update', this.report).then(() => {
                        this.masterOrder.inboundDate = this.report.inboundDate
                        this.masterOrder.unloadFinishTime = this.report.unloadFinishTime
                        this.masterOrder.outTime = this.report.outTime
                        this.masterOrder.availableTime = this.report.availableTime
                        this.masterOrder.dockNumber = this.report.dockNumber
                        this.masterOrder.verifiedBy = this.report.verifiedBy
                        this.masterOrder.status = 'Received'
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

    },
}
</script>

<style lang="scss" scoped>
    .input-bar{
      text-align: right
    }
</style>
