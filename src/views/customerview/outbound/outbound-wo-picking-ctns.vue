<template>
  <div>
    <label>Container: </label><el-input v-model="container" placeholder="Container No." />
    <label>SKU: </label><el-input v-model="sku" placeholder="SKU No." />
    <label>Amz Ref: </label><el-input v-model="amzRef" placeholder="Amz Ref Id" />
    <label>warehouse: </label><el-input v-model="warehouseCode" placeholder="Warehouse Code" />
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
        width="100"
      />
      <el-table-column
        prop="grossWeightPerCtn"
        label="G.W./Ctn"
        width="100"
      />
      <el-table-column
        prop="cbmPerCtn"
        label="CBM/Plt"
        width="100"
      />
      <el-table-column
        prop="actualQuantity"
        label="Org Ctns"
        width="100"
      />
      <el-table-column
        prop="availableCtns"
        label="Ava Ctns"
        width="100"
      />
      <el-table-column
        prop="location"
        label="Location"
        width="100"
      />
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
      <el-button type="primary">Confirm Pick</el-button>
    </div>
  </div>
</template>

<script>
import { getCtnsInventory } from '@/api/shipping'

export default {
  data() {
    return {
      ctnsInventory: [],
      container: '',
      sku: '',
      amzRef: '',
      warehouseCode: '',
      tableHight: window.innerHeight * 0.7,
      loading: false
    }
  },
  mounted() {

  },
  methods: {
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
  }
}
</script>

<style lang="stylus" scoped>

</style>
