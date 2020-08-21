<template>
  <div v-if="!isCtnView">
    <div style="text-align:right">
      <el-input
        v-model="search"
        style="width:250px"
        size="large"
        placeholder="Search..."
      />
    </div>
    <el-table
      ref="location-plts"
      show-summary
      :data="localTableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      stripe
      border
      :height="tableHight"
      style="width: 100%"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            ref="pick-table-plts-ctns"
            :data="props.row.inPalletCtnInventories"
            border
            show-summary
            stripe
          >
            <el-table-column
              prop="id"
              label="Ctn Id"
              width="70"
            />
            <el-table-column
              prop="shipmentId"
              label="Shipment Id/SKU"
              min-width="60%"
            />
            <el-table-column
              prop="amzRefId"
              label="Amz Ref Id"
              min-width="60%"
            />
            <el-table-column
              prop="subCustomer"
              label="Sub-customer"
              width="110"
            />
            <el-table-column
              prop="warehouseCode"
              label="Whse Code"
              width="110"
            />
            <el-table-column
              prop="grossWeightPerCtn"
              label="GW/CTN"
              width="80"
              align="center"
            />
            <el-table-column
              prop="cbmPerCtn"
              label="CBM/CTN"
              width="100"
              align="center"
            />
            <el-table-column
              prop="originalQuantity"
              label="Received Ctns"
              align="center"
              width="120"
            />
            <el-table-column
              prop="residualQuantity"
              align="center"
              label="Ava Ctns"
              width="100"
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
              width="100"
            />
            <el-table-column
              prop="location"
              label="Location"
              width="120"
            />
            <el-table-column
              prop="operation"
              label="operation"
              align="center"
              width="110"
            >
              <template slot-scope="scope">
                <el-button @click="onCtnHistoryClicked(scope.row.id)">History</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        prop="pltId"
        label="Plt Id"
        width="70"
      />
      <el-table-column
        prop="container"
        label="Container"
        width="150"
      />
      <el-table-column
        prop="shipmentId"
        label="Shipment Id"
        width="150"
      />
      <el-table-column
        prop="amzRefId"
        label="Amz Ref. Id"
        width="150"
      />
      <el-table-column
        prop="subCustomer"
        align="center"
        label="Sub-customer"
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
        prop="palletSize"
        align="center"
        label="Plt Size"
        width="70"
      />
      <el-table-column
        prop="actualPlts"
        align="center"
        label="Org Plts"
        width="70"
      />
      <el-table-column
        align="center"
        prop="pickingPlts"
        label="Processing Plts"
        width="90"
      />
      <el-table-column
        prop="availablePlts"
        align="center"
        label="Ava Plts"
        width="80"
      />
      <el-table-column
        align="center"
        label="Org In-plt Ctns"
        width="80"
      >
        <template slot-scope="scope">
          <font>{{ obj_sum(scope.row.inPalletCtnInventories, "originalQuantity").originalQuantity }}</font>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="Porcessing In-plt Ctns"
        width="90"
      >
        <template slot-scope="scope">
          <font>{{ obj_sum(scope.row.inPalletCtnInventories, "pickingCtns").pickingCtns }}</font>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="Ava In-plt Ctns"
        width="80"
      >
        <template slot-scope="scope">
          <font>{{ obj_sum(scope.row.inPalletCtnInventories, "residualQuantity").residualQuantity }}</font>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="Hold In-plt Ctns"
        width="90"
      >
        <template slot-scope="scope">
          <font>{{ obj_sum(scope.row.inPalletCtnInventories, "holdQuantity").holdQuantity }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="location"
        align="center"
        label="Location"
      />
      <el-table-column
        prop="operation"
        label="operation"
        align="center"
        width="110"
      >
        <template slot-scope="scope">
          <!-- <el-button @click="onPltHistoryClicked(scope.row.pltId)">History</el-button> -->
          <el-dropdown>
            <span class="el-dropdown-link">
              More<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :disabled="scope.row.availablePlts==0" @click.native="onUpdatePltsClicked(scope.row.pltId, scope.row.location)">Update</el-dropdown-item>
              <el-dropdown-item @click.native="onPltHistoryClicked(scope.row.id)">History</el-dropdown-item>
              <!-- <el-dropdown-item :disabled="scope.row.actualPlts!==scope.row.availablePlts" @click.native="onRelocateClicked(scope.row.id)">Re-allocate</el-dropdown-item> -->
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
      title="Update Pallet"
      :visible.sync="updatePltsVisible"
      width="400px"
      top="8vh"
      :lock-scroll="false"
      append-to-body
    >
      <el-form ref="form-required-plt" :rules="rules" :model="formData" label-width="150px">
        <el-col>
          <el-form-item label="Location" prop="location">
            <el-input v-model="formData.location" />
          </el-form-item>
        </el-col></el-form>
      <div style="text-align:center">
        <el-button type="primary" @click="onUpdatePltsConfirmClicked">Update</el-button>
        <el-button @click="updatePltsVisible=false">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
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
import { updateHoldCtns, updateLocation, updatePltLocation } from '@/api/receiving'

export default {
  props: {
    fbaPltInventories: {
      type: Array,
      default: null
    },
    isCtnView: Boolean
  },
  data() {
    return {
      updatePltsVisible: false,
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
    fbaPltInventories: function(val, oldVal) {
      this.localTableData = this.fbaPltInventories
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
      this.localTableData = this.fbaPltInventories.filter(data => {
        return Object.keys(data).some(key => {
          return String(data[key]).toLowerCase().indexOf(search.toLowerCase()) > -1
        })
      })
      this.totalEntries = this.localTableData.length
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    onCtnHistoryClicked(id) {
      this.$emit('onCtnHistoryClicked', id)
    },
    onPltHistoryClicked(id) {
      this.$emit('onPltHistoryClicked', id)
    },
    obj_sum(arr, ...param) {
      var temp = {}
      arr.forEach(function(item, index) {
        for (var k in item) {
          if (param.indexOf(k) >= 0) {
            if ((typeof item[k]) === 'string') {
              item[k] = item[k] * 1
            }
            if (temp[k]) {
              temp[k] += item[k]
            } else {
              temp[k] = item[k]
            }
          }
        }
      })
      return temp
    },
    doSearch() {
      clearTimeout(this.timer) // 清除延迟执行
      this.timer = setTimeout(() => { // 设置延迟执行
        this.onSearchChanged(this.search)
      }, 1000)
    },
    onUpdateClicked(id, holdCtns, location, availableCtns) {
      this.formData.holdCtns = holdCtns
      this.formData.location = location
      this.formData.availableCtns = availableCtns
      this.formData.id = id
      this.updateVisible = true
      this.formData.max = holdCtns + availableCtns
    },
    onUpdatePltsClicked(id, location) {
      this.formData.id = id
      this.formData.location = location
      this.updatePltsVisible = true
    },
    onUpdateConfirmClicked() {
      this.$refs['form-required'].validate((valid) => {
        if (valid) {
          updateHoldCtns(this.formData.id, this.formData.holdCtns).then(() => {
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
    onUpdatePltsConfirmClicked() {
      this.$refs['form-required-plt'].validate((valid) => {
        if (valid) {
          updatePltLocation(this.formData.id, this.formData.location).then(() => {
            this.$emit('reloadOrder')
            this.updatePltsVisible = false
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
