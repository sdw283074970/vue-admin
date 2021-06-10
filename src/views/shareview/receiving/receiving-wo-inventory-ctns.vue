<template>
  <div>
    <el-table
      v-if="isVisible"
      ref="inventory-ctns"
      :data="ctnInventoryData"
      stripe
      border
      :max-height="tableHight"
      style="width: 100%"
    >
      <el-table-column
        sortable
        prop="id"
        label="Ctn Id"
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
        prop="actualQuantity"
        align="center"
        label="Org Ctns"
        min-width="30%"
      />
      <el-table-column
        prop="availableCtns"
        align="center"
        label="Ava Ctns"
        min-width="30%"
      />
      <el-table-column
        prop="pickingCtns"
        align="center"
        label="Picking Ctns"
        min-width="30%"
      />
      <el-table-column
        prop="shippedCtns"
        align="center"
        label="Shipped Ctns"
        min-width="30%"
      />
      <el-table-column
        prop="holdCtns"
        align="center"
        label="Hold Ctns"
        width="100"
      />
      <el-table-column
        prop="location"
        label="Location"
        align="center"
        min-width="30%"
      />
      <el-table-column
        prop="memo"
        label="Memo"
        align="center"
        min-width="30%"
      />
      <el-table-column
        label="Operation"
        align="center"
        min-width="30%"
      >
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              Options<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :disabled="scope.row.residualQuantity==0&&scope.row.holdQuantity==0" @click.native="onUpdateClicked(scope.row.id, scope.row.holdCtns, scope.row.location, scope.row.availableCtns, scope.row.memo)">Update</el-dropdown-item>
              <el-dropdown-item @click.native="onHistoryClicked(scope.row.id)">History</el-dropdown-item>
              <el-dropdown-item :disabled="(scope.row.location==='Pallet')||(scope.row.actualQuantity!==scope.row.availableCtns)" @click.native="onReallocateClicked(scope.row.id)">Re-allocate</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="Ctn Outbound History"
      :visible.sync="ctnHistoryVisible"
      width="900px"
      top="5vh"
      :lock-scroll="false"
      append-to-body
    >
      <ctn-history :ctn-outbound-histories="ctnOutboundHistories" :history-sum="historySum" />
    </el-dialog>
    <el-dialog
      title="Update Cartons"
      :visible.sync="updateVisible"
      width="400px"
      top="8vh"
      :lock-scroll="false"
      append-to-body
    >
      <el-form ref="form-required" :rules="rules" :model="formData" label-width="150px">
        <el-col>
          <el-form-item label="Hold Ctns" prop="holdCtns">
            <el-input v-model="formData.holdCtns" type="number" :max="formData.availableCtns" @input="onInputChange" />
          </el-form-item>
          <el-form-item label="Location" prop="location">
            <el-input v-model="formData.location" :disabled="formData.location=='Pallet'" />
          </el-form-item>
          <el-form-item label="Memo" prop="memo">
            <el-input v-model="formData.memo" />
          </el-form-item>
          <p style="text-align:center">{{ 'Max holdable quantity: ' + formData.max + ' ctns' }}</p>
        </el-col></el-form>
      <div style="text-align:center">
        <el-button type="primary" @click="onUpdateConfirmClicked">Update</el-button>
        <el-button @click="updateVisible=false">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
import { getCtnHistories } from '@/api/inventory'
import { relocateItems, updateHoldCtns, updateLocation } from '@/api/receiving'

const validateAcquaintance = (rule, value, callback) => {
  // if (!value) {
  //   callback(new Error('Please enter valid hold ctns quanity'))
  // }
  value = Number(value)
  if (typeof value === 'number' && !isNaN(value)) {
    if (value < 0) {
      callback(new Error('Hold quantity cannot be smaller than 0'))
    } else {
      callback()
    }
  } else {
    callback(new Error('Please enter valid pallet number'))
  }
}
export default {
  props: {
    isVisible: false,
    ctnInventoryData: Array,
    customerCode: String
  },
  components: {
    "ctn-history": () => import('@/views/shareview/generic/generic-ctn-history')
  },
  data(){
    return {
      tableHight: window.innerHeight * 0.6,
      ctnOutboundHistories: [],
      updateVisible: false,
      ctnHistoryVisible: false,
      loading: false,
      formData: {
        id: 0,
        holdCtns: 0,
        location: '',
        memo: '',
        max: 0
      },
      historySum: {
        container: '',
        customerCode: '',
        shipmentId: '',
        amzRefId: '',
        warehouseCode: ''
      },
      rules: {
        holdCtns: [
          { validator: validateAcquaintance, trigger: 'blur' }                    
        ],
        location: [
          { required: true, message: 'Please input a location', trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    onHistoryClicked(id) {
      this.loading = true;
      getCtnHistories(id).then(body => {
        this.ctnHistoryVisible = true;
        this.ctnOutboundHistories = body.data;
        var obj = this.ctnInventoryData.find(x => x.id === id);
        this.historySum.container = obj.container;
        this.historySum.customerCode = this.customerCode;
        this.historySum.shipmentId = obj.shipmentId;
        this.historySum.amzRefId = obj.amzRefId;
        this.historySum.warehouseCode = obj.warehouseCode;
      })
      this.loading = false;
    },
    onUpdateClicked(id, holdCtns, location, availableCtns, memo) {
      this.formData.holdCtns = holdCtns
      this.formData.location = location
      this.formData.availableCtns = availableCtns
      this.formData.id = id
      this.updateVisible = true
      this.formData.memo = memo
      this.formData.max = holdCtns + availableCtns
    },
    onUpdateConfirmClicked() {
      this.$refs['form-required'].validate((valid) => {
          if (valid) {
            updateHoldCtns(this.formData.id, this.formData.holdCtns, this.formData.memo).then(() => {
              updateLocation(this.formData.id, this.formData.location).then(() => {
                this.$emit('reloadOrder')
                this.updateVisible = false
              })
            })
          } else {
              console.log('error submit!!');
              return false;
          }
      });
    },
    onReallocateClicked(id) {
      relocateItems(id, 'Carton').then(() => {
        this.$emit('reloadOrder')
        this.$message({
          message: 'Success',
          type: 'success'
        })
      })
    },
    onInputChange() {
      if (this.formData.holdCtns > this.formData.max)
        this.formData.holdCtns = this.formData.max
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
    .el-dropdown-link {
      cursor: pointer;
      color: #409EFF;
    }
    .el-icon-arrow-down {
      font-size: 12px;
    }
    .demonstration {
      display: block;
      color: #8492a6;
      font-size: 14px;
      margin-bottom: 20px;
    }
</style>
