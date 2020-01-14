<template>
  <div>
    <h2>SKU: {{ adjustInfo.sku }}</h2>
    <el-form ref="form-required" :rules="rules" :model="adjustObj" label-width="150px">
      <h3>Picked Palltes From Inventory: {{ adjustInfo.currentPickingPlts }}</h3>
      <el-form-item label="Adjust:" prop="pltsAdjust">
        <el-input v-model="adjustObj.pltsAdjust" type="number" />
      </el-form-item>
      <h3>New Palltes Built by Warehouse: {{ adjustInfo.currentNewPlts }}</h3>
      <el-form-item label="Adjust:" prop="newPltsAdjust">
        <el-input v-model="adjustObj.newPltsAdjust" type="number" />
      </el-form-item>
      <h3>Total Outbound Pallets Quantity: {{ adjustInfo.currentOutboundPlts }}</h3>
      <el-form-item label="Adjust:" prop="outboundAdjust">
        <el-input v-model="adjustObj.outboundAdjust" type="number" />
      </el-form-item>
    </el-form>
    <div style="text-align:center">
      <el-button type="primary" @click="onAdjustClcicked">Adjust</el-button>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import { adjustPickDetail } from '@/api/shipping'

export default {
    props: {
      adjustInfo: Object,
      pickDetails: Array
    },
    data(){
        return {
            tableHight: window.innerHeight * 0.6,
            adjustObj: {
              pltsAdjust: 0,
              newPltsAdjust: 0,
              outboundAdjust: 0
            },
            rules: {
              pltsAdjust: [
                { required: true, message: 'Please input pallets quantity from the inventory', trigger: 'change' }
              ],
              newPltsAdjust: [
                { required: true, message: 'Please input new pallets quantity built', trigger: 'change' }
              ],
              outboundAdjust: [
                { required: true, message: 'Please input total outbound pallets quantity', trigger: 'change' }
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
        onAdjustClcicked() {
          adjustPickDetail(this.adjustInfo.id, this.adjustObj).then(() => {
            this.$emit('onAdjustSuccess', this.adjustInfo.id, this.adjustObj);
            this.$message({
              message: 'Adjust success',
              type: 'success'
            })
          }).catch(error => {
            this.$message({
              message: error.message,
              type: 'warning'
            })
          })
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
