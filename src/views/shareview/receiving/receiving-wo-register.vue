<template>
  <div>
    <h1>Register Pallets Info</h1>
    <h2>Container: {{ masterOrder.container }}</h2>
    <h2>Customer: {{ masterOrder.customerCode }}</h2>
    <el-table
      ref="table"
      :data="orderDetails"
      stripe
      border
      height="500"
      style="width: 100%"
      @selection-change="onSelectionChange"
    >
      <el-table-column
        sortable
        prop="id"
        label="Rcv Id"
        width="100"
      />
      <el-table-column
        prop="shipmentId"
        sortable=""
        label="Shipment Id/SKU"
        min-width="60%"
      />
      <el-table-column
        prop="amzRefId"
        sortable=""
        label="Amz Ref Id"
        min-width="60%"
      />
      <el-table-column
        prop="warehouseCode"
        label="Whse Code"
        min-width="30%"
      />
      <el-table-column
        prop="howToDeliver"
        label="Delivery"
        min-width="30%"
      />
      <el-table-column
        prop="actualGrossWeight"
        align="center"
        label="G.W."
        min-width="20%"
      />
      <el-table-column
        prop="actualCBM"
        align="center"
        label="CBM"
        min-width="20%"
      />
      <el-table-column
        prop="actualQuantity"
        label="Actual Quantity"
        align="center"
        min-width="30%"
      />
      <el-table-column
        align="center"
        label="Unlaied Quantity"
        min-width="30%"
      >
        <template slot-scope="scope">
          <font>{{ scope.row.actualQuantity - scope.row.comsumedQuantity }}</font>
        </template>
      </el-table-column>
      <!-- <el-table-column
        type="selection"
        :selectable="isDisabled"
        disabled="true"
        width="60"
      /> -->
      <el-table-column
        label="Ctns/Pack"
        align="center"
        width="140"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.ctnsPerLocation" type="number" style="width:100px" />
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top:10px;text-align:right;">
      <el-button disabled>Detail Pack</el-button>
      <el-button @click="packVisible = true">Rough Pack</el-button>
    </div>
    <el-dialog
      title="Rough Pack"
      :visible.sync="packVisible"
      width="450px"
      :lock-scroll="false"
      append-to-body
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm">
        <el-form-item label="Packed Plt Quantity" prop="pltNumber">
          <el-input v-model.number="ruleForm.pltNumber" />
        </el-form-item>
        <el-form-item label="Packed PLt Size" prop="pltSize">
          <el-select v-model="ruleForm.pltSize" placeholder="Select Size">
            <el-option label="P1(Standard Size)" value="P1" />
            <el-option label="P2(2X Standard Size)" value="P2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="onPackCliced()">Pack</el-button>
          <el-button @click="resetForm('ruleForm')">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
import { packPlts } from '@/api/receiving'

const validateAcquaintance = (rule, value, callback) => {
  if (!value) {
    callback(new Error('Please enter valid pallet number'))
  }
  value = Number(value)
  if (typeof value === 'number' && !isNaN(value)) {
    if (value < 1) {
      callback(new Error('Pallet number cannot be smaller than 1'))
    } else {
      callback()
    }
  } else {
    callback(new Error('Please enter valid pallet number'))
  }
}

export default {
  props: {
    masterOrder: {},
    orderDetails: Array
  },
  data() {
      return {
          step: 0,
          search: '',
          filteredData : [],
          packVisible: false,
          totalEntries: 0,
          currentPage: 1,
          pageSize: 20,
          formLabelWidth : '200px',
          checkBoxData: [],
          customerCodeFilter : [],
          ruleForm: {
              pltNumber: 0,
              pltSize: 'P1'
          },
          rules: {
            pltNumber: [
                { validator: validateAcquaintance, trigger: 'blur' }                    
            ],
            pltSize: [
                { required: true, message: 'Please select size', trigger: 'change' },
            ]
          }
      };
  },
  methods:{
    onPackCliced() {
      var obj = []

      this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            // if (this.checkBoxData)
            // {
            //   this.checkBoxData.forEach(row => {
            //     obj.push({
            //       id: row.id,
            //       quantity: 0
            //     })
            //   })
            //   packPlts(this.masterOrder.id, this.ruleForm.pltNumber, this.ruleForm.pltSize, obj).then(() => {
            //     this.checkBoxData.forEach(row => {
            //       var order = this.orderDetails.find(x => x.id == row.id);
            //       order.comsumedQuantity = order.actualQuantity;
            //     })
            //     this.$refs.table.clearSelection();
            //   })
            //   this.packVisible = false;
            //     this.$message({
            //       message: 'Pack success',
            //       type: 'success'
            //     })
            // }
            this.orderDetails.forEach(row => {
              if (row.ctnsPerLocation != 0 && row.ctnsPerLocation != '' && row.ctnsPerLocation != null && row.ctnsPerLocation != undefined && row.ctnsPerLocation <= (row.actualQuantity - row.comsumedQuantity) && row.ctnsPerLocation > 0)
              {
                obj.push({
                  id: row.id,
                  quantity: row.ctnsPerLocation
                })
              }
            })
            packPlts(this.masterOrder.id, this.ruleForm.pltNumber, this.ruleForm.pltSize, obj).then(() => {
              this.$emit('reloadOrder')
            })
            this.packVisible = false;
            this.$message({
              message: 'Pack success',
              type: 'success'
            })
          } else {
              console.log('error submit!!');
              return false;
          }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    isDisabled(row, index) {
      if (row.actualQuantity - row.comsumedQuantity)
       return 1;
      else
        return 0;
    },
    onSelectionChange(val) {
      this.checkBoxData = val;
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
