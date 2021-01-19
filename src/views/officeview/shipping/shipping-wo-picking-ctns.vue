<template>
  <div>
    <label>Container: </label><el-input v-model="container" placeholder="Container No." />
    <label>SKU: </label><el-input v-model="sku" placeholder="SKU No." />
    <label>Amz Ref: </label><el-input v-model="amzRef" placeholder="Amz Ref Id" />
    <label>warehouse: </label><el-input v-model="warehouseCode" placeholder="Warehouse Code" />
    <label>warehouse Location: </label>
    <el-select
      v-model="warehouseLocation"
      filterable
      collapse-tags
      placeholder="-- Warehouse --"
    >
      <el-option
        v-for="item in warehouseLocations"
        :key="item.warehouseCode"
        :label="item.warehouseCode + ' - ' + item.warehouseName"
        :value="item.warehouseCode"
      />
    </el-select>
    <el-button type="primary" :loading="loading" @click="searchHandler()">Search</el-button>
    <el-table
      ref="pick-table-ctns"
      :data="ctnsInventory"
      stripe
      border
      :height="tableHight"
      style="width: 100%"
    >
      <el-table-column
        sortable
        prop="id"
        label="Ctn Id"
        width="80"
      />
      <el-table-column
        prop="container"
        label="Container #"
        sortable=""
        width="200"
      />
      <el-table-column
        prop="shipmentId"
        sortable=""
        label="Shipment Id/SKU"
        width="200"
      />
      <el-table-column
        prop="amzRefId"
        sortable=""
        label="Amz Ref Id"
        width="200"
      />
      <el-table-column
        prop="warehouseCode"
        label="Whse Code"
        align="center"
        width="100"
      />
      <el-table-column
        prop="grossWeightPerCtn"
        label="G.W./Ctn"
        align="center"
        width="80"
      />
      <el-table-column
        prop="cbmPerCtn"
        label="CBM/Plt"
        align="center"
        width="80"
      />
      <el-table-column
        prop="actualQuantity"
        label="Org Ctns"
        align="center"
        width="80"
      />
      <el-table-column
        prop="availableCtns"
        label="Ava Ctns"
        align="center"
        width="80"
      />
      <el-table-column
        prop="location"
        label="Location"
        align="center"
        width="80"
      />
      <el-table-column
        prop="inboundDate"
        label="Inbound Date"
        sortable
        width="130"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ transferDate(scope.row.inboundDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="operation"
        label="operation"
      >
        <template slot-scope="scope">
          <el-input v-model="scope.row.selectedCtns" />
          <el-button @click="onPickAllClicked(scope.row.id)">All</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top:10px;text-align: right;">
      <el-button @click="onFillAllClicked">Auto Fill All</el-button>
      <el-button type="primary" @click="onConfirmPickClicked">Confirm Pick</el-button>
    </div>
  </div>
</template>

<script>
import { getCtnsInventory, confirmPickCtns } from '@/api/shipping'
import { correctNumber } from '@/scripts/validator'
import { getWarehouseLocations } from '@/api/generic'

export default {
  data() {
    return {
      ctnsInventory: [],
      container: '',
      sku: '',
      amzRef: '',
      warehouseCode: '',
      warehouseLocations: [],
      warehouseLocation: '',
      tableHight: window.innerHeight * 0.7,
      loading: false
    }
  },
  mounted() {
    getWarehouseLocations().then(
      body => {
        this.warehouseLocations = body.data
      }
    )
  },
  methods: {
    transferDate: function(date) {
      return date === undefined ? '' : (date.substring(0, 4) === '1900' ? '-' : date.substring(0, 10))
    },
    onFillAllClicked() {
      this.ctnsInventory.forEach(function(i) {
        i.selectedCtns = i.availableCtns
      })
    },
    onPickAllClicked(id) {
      this.ctnsInventory.find(function(i) {
        if (i.id === id) {
          i.selectedCtns = i.availableCtns
        }
      })
    },
    searchHandler() {
      if (this.warehouseLocation === '') {
        this.$message({
          message: 'Warehouse location is required',
          type: 'warning'
        })
      } else {
        this.loading = true
        getCtnsInventory(this.$route.params.shipOrderId, this.container, this.sku, this.amzRef, this.warehouseCode).then(body => {
          this.ctnsInventory = body.data
          this.loading = false
          this.$message({
            message: 'Search complete',
            type: 'success'
          })
        }).catch(e => {
          this.$message({
            message: 'Search failed',
            type: 'warning'
          })
          this.loading = false
        })
      }
    },
    correct(model, name, max, min) {
      correctNumber(model, name, max, min)
    },
    onConfirmPickClicked() {
      var obj = []
      this.ctnsInventory.forEach(x => {
        if (x.selectedCtns > 0 && x.selectedCtns <= x.availableCtns) {
          obj.push({
            id: x.id,
            pickQuantity: x.selectedCtns
          })
        }
      })
      confirmPickCtns(this.$route.params.shipOrderId, obj).then(() => {
        this.$emit('referashPickDetails')
        getCtnsInventory(this.$route.params.shipOrderId, this.container, this.sku, this.amzRef, this.warehouseCode).then(body => {
          this.ctnsInventory = body.data
        })
        this.$message({
          message: 'Pick Success',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
