<template>
  <div v-if="isCtnView">
    <div style="text-align:right">
      <el-input
        v-model="search"
        style="width:250px"
        size="large"
        placeholder="Search..."
      />
    </div>
    <el-table
      ref="location-ctns"
      show-summary
      :data="localTableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      stripe
      border
      :height="tableHight"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="Ctn Id"
        width="70"
      />
      <el-table-column
        prop="container"
        label="Container"
        width="120"
      />
      <el-table-column
        prop="type"
        align="center"
        label="Storage Type"
        width="70"
      />
      <el-table-column
        prop="shipmentId"
        label="Shipment Id/SKU"
        align="center"
        width="160"
      />
      <el-table-column
        prop="amzRefId"
        label="Amz Ref Id"
        align="center"
        width="160"
      />

      <el-table-column
        prop="subCustomer"
        label="Sub-customer"
        width="110"
      />
      <el-table-column
        prop="warehouseCode"
        label="Whse Code"
        align="center"
        width="110"
      />
      <el-table-column
        prop="inboundDate"
        align="center"
        label="Inbound Date"
        width="110"
      >
        <template slot-scope="scope">
          <font>{{ transferDate(scope.row.inboundDate) }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="grossWeightPerCtn"
        label="GW/CTN"
        width="80"
        align="center"
      />
      <el-table-column
        prop="cbmPerCtn"
        label="CBM/CTN"
        width="80"
        align="center"
      />
      <el-table-column
        prop="originalQuantity"
        label="Received Ctns"
        align="center"
        width="80"
      />
      <el-table-column
        prop="residualQuantity"
        align="center"
        label="Ava Ctns"
        width="80"
      />
      <el-table-column
        prop="pickingCtns"
        align="center"
        label="Processing Ctns"
        width="90"
      />
      <el-table-column
        prop="holdQuantity"
        align="center"
        label="Hold Ctns"
        width="80"
      />
      <el-table-column
        prop="location"
        label="Location"
        align="center"
        width="80"
      />
      <el-table-column
        prop="warehouseLocation"
        label="WHS"
        align="center"
        width="60"
      />
      <el-table-column
        prop="operation"
        label="operation"
        align="center"
      >
        <template slot-scope="scope">
          <!-- <el-button @click="onHistoryClicked(scope.row.id)">History</el-button>-->
          <el-dropdown>
            <span class="el-dropdown-link">
              More<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :disabled="scope.row.residualQuantity==0&&scope.row.holdQuantity==0" @click.native="onUpdateClicked(scope.row.id, scope.row.holdQuantity, scope.row.location, scope.row.residualQuantity, scope.row.type)">Update</el-dropdown-item>
              <el-dropdown-item @click.native="onHistoryClicked(scope.row.id)">History</el-dropdown-item>
              <!-- <el-dropdown-item :disabled="(scope.row.type==='InPallet')||(scope.row.actualQuantity!==scope.row.availableCtns)" @click.native="onReallocateClicked(scope.row.id)">Re-allocate</el-dropdown-item> -->
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top:10px"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="20"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalEntries"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
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
          <el-form-item label="Hold Ctns" prop="holdQuantity">
            <el-input v-model="formData.holdQuantity" type="number" :max="formData.residualQuantity" @input="onInputChange" />
          </el-form-item>
          <el-form-item label="Location" prop="location">
            <el-input v-model="formData.location" :disabled="formData.type=='InPallet'" />
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
import { updateHoldCtns, updateLocation } from '@/api/receiving'

const validateAcquaintance = (rule, value, callback) => {
  if (!value && value !== 0) {
    callback(new Error('Please enter valid hold ctns quanity'))
  }
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
    fbaCtnInventories:
      { type: Array,
        default: null },
    isCtnView: Boolean
  },
  data() {
    return {
      updateVisible: false,
      tableHight: window.innerHeight * 0.6,
      currentPage: 1,
      pageSize: 20,
      search: '',
      totalEntries: 0,
      localTableData: [],
      formData: {
        id: 0,
        holdQuantity: 0,
        location: '',
        max: 0,
        type: ''
      },
      rules: {
        holdQuantity: [
          { validator: validateAcquaintance, trigger: 'blur' }
        ],
        location: [
          { required: true, message: 'Please input a location', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    search: function(val, oldVal) {
      this.onSearchChanged(val)
    },
    fbaCtnInventories: function(val, oldVal) {
      this.localTableData = this.fbaCtnInventories
      this.totalEntries = this.localTableData.length
    }
  },
  mounted() {
  },
  methods: {
    transferDate: function(date) {
      return date === undefined ? '' : (date.substring(0, 4) === 1900 ? '-' : date.substring(0, 10))
    },
    onSearchChanged(search) {
      this.currentPage = 1
      this.localTableData = this.fbaCtnInventories.filter(data => {
        return Object.keys(data).some(key => {
          return String(data[key]).toLowerCase().indexOf(search.toLowerCase()) > -1
        })
      })
      this.totalEntries = this.localTableData.length
    },
    doSearch() {
      clearTimeout(this.timer) // 清除延迟执行
      this.timer = setTimeout(() => { // 设置延迟执行
        this.onSearchChanged(this.search)
      }, 1000)
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    onHistoryClicked(id) {
      this.$emit('onCtnHistoryClicked', id)
    },
    onUpdateClicked(id, holdQuantity, location, availableCtns, type) {
      this.formData.holdQuantity = holdQuantity
      this.formData.location = type === 'InPallet' ? 'Pallet' : location
      this.formData.availableCtns = availableCtns
      this.formData.id = id
      this.updateVisible = true
      this.formData.max = holdQuantity + availableCtns
      this.formData.type = type
    },
    onUpdateConfirmClicked() {
      this.$refs['form-required'].validate((valid) => {
        if (valid) {
          updateHoldCtns(this.formData.id, this.formData.holdQuantity).then(() => {
            updateLocation(this.formData.id, this.formData.location).then(() => {
              this.$emit('reloadOrder')
              this.updateVisible = false
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onInputChange() {
      if (this.formData.holdQuantity > this.formData.max) { this.formData.holdQuantity = this.formData.max }
    }
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
