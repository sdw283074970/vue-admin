<template>
  <div>
    <label>Container: </label><el-input v-model="container" placeholder="Container No." />
    <label>SKU: </label><el-input v-model="sku" placeholder="SKU No." />
    <label>Amz Ref: </label><el-input v-model="amzRef" placeholder="Amz Ref Id" />
    <label>warehouse: </label><el-input v-model="warehouseCode" placeholder="Warehouse Code" />
    <el-button type="primary" :loading="loading" @click="searchHandler()">Search</el-button>
    <el-table
      ref="pick-table-plts"
      :data="pltsInventory"
      stripe
      border
      :height="tableHight"
      style="width: 100%"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            ref="pick-table-plts-ctns"
            :data="props.row.fbaCartonLocations"
            border
            stripe
          >
            <el-table-column
              sortable
              prop="id"
              label="Ctn Id"
              width="100"
            />
            <el-table-column
              sortable
              prop="shipmentId"
              label="SKU"
              min-width="60%"
            />
            <el-table-column
              sortable
              prop="amzRefId"
              label="Amz Ref Id"
              min-width="60%"
            />
            <el-table-column
              prop="warehouseCode"
              label="Whse Code"
              min-width="30%"
            />
            <el-table-column
              prop="grossWeightPerCtn"
              label="GW/Ctn"
              min-width="30%"
            />
            <el-table-column
              prop="cbmPerCtn"
              label="CBM/Ctn"
              min-width="30%"
            />
            <el-table-column
              prop="actualQuantity"
              label="Org Ctns"
              min-width="30%"
            />
            <el-table-column
              prop="availableCtns"
              label="Ava Ctns"
              min-width="30%"
            />
            <el-table-column
              prop="holdCtns"
              label="Hold Ctns"
              min-width="30%"
            />
            <el-table-column
              prop="operation"
              label="operation"
            >
              <template slot-scope="scope">
                <!-- <el-input v-model="scope.row.selectedCtns" v-only-number="{max:scope.row.availableCtns,min:0,precision:0}" @keyup="correct(scope.row.selectedCtns, scope.row.availableCtns, 0, 0)" /> -->
                <el-input v-model.number="scope.row.selectedCtns" @keyup.native="correct(scope.row, 'selectedCtns', scope.row.availableCtns, 0)" />
                <el-button @click="onPickAllCtnsClicked(props.row.id, scope.row.id)">All</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="text-align:right;margin-top:10px">
            <!-- <label>Number of Plts from Inventory: </label><el-input v-model.number="props.row.selectedPlts" v-only-number="{max:props.row.availablePlts,min:0,precision:0}" /> -->
            <label>Number of Plts from Inventory: </label><el-input v-model.number="props.row.selectedPlts" @keyup.native="correct(props.row, 'selectedPlts', props.row.availablePlts, 0)" />
            <!-- <label>Number of new Plts: </label><el-input v-model.number="props.row.newPlts" v-only-number="{max:9999,min:0,precision:0}" /> -->
            <label>Number of new Plts: </label><el-input v-model.number="props.row.newPlts" @keyup.native="correct(props.row, 'newPlts', 999999, 0)" />
          </div>
          <div style="margin-top:10px;text-align: right;">
            <el-button @click="onPickAllClicked(props.row.id)">Pick All</el-button>
            <el-button type="primary" @click="onConfirmClicked(props.row.id)">Confirm Pick</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="id"
        label="Plt Id"
        width="80"
      />
      <el-table-column
        prop="container"
        label="Container #"
        sortable=""
        min-width="60%"
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
        prop="palletSize"
        label="Pallet Size"
        min-width="30%"
      />
      <el-table-column
        prop="warehouseCode"
        label="Whse Code"
        min-width="35%"
      />
      <el-table-column
        prop="originalTotalCtns"
        label="Org Ctns"
        min-width="30%"
      />
      <el-table-column
        prop="currentAvailableCtns"
        label="Ava Ctns"
        min-width="30%"
      />
      <el-table-column
        prop="actualPlts"
        label="Org Plts"
        min-width="30%"
      />
      <el-table-column
        prop="availablePlts"
        label="Ava Plts"
        min-width="30%"
      />
      <el-table-column
        prop="location"
        label="Location"
      />
      <!-- <el-table-column
            prop="operation"
            label="operation"
            width="100">
            <template slot-scope="scope">
                <el-button @click="pickHandler(scope.row.id)">Pick</el-button>
            </template>
          </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
import { getPltsInventory, pickCtnsInPlts } from '@/api/shipping'
import { correctNumber } from '@/scripts/validator'

export default {
  data() {
    return {
      pltsInventory: [],
      container: '',
      sku: '',
      amzRef: '',
      warehouseCode: '',
      inventoryPlts: 0,
      newPlts: 0,
      tableHight: window.innerHeight * 0.7,
      loading: false
    }
  },
  mounted() {

  },
  methods: {
    onPickAllCtnsClicked(pltId, ctnId) {
      this.pltsInventory.find(function(i) {
        if (i.id === pltId) {
          i.fbaCartonLocations.find(function(c) {
            if (c.id === ctnId) {
              c.selectedCtns = c.availableCtns
            }
          })
        }
      })
    },
    onPickAllClicked(pltId) {
      var obj = this.pltsInventory.find(function(i) {
        if (i.id === pltId) {
          return i
        }
      })
      obj.selectedPlts = obj.availablePlts
      obj.fbaCartonLocations.forEach(function(i) {
        i.selectedCtns = i.availableCtns
      })
    },
    onConfirmClicked(id) {
      var plt = this.pltsInventory.find(function(i) {
        if (i.id === id) {
          return i
        }
      })
      var arr = []
      plt.fbaCartonLocations.forEach(function(i) {
        if (i.selectedCtns !== 0) {
          var obj = { 'id': i.id, 'pickQuantity': i.selectedCtns }
          arr.push(obj)
        }
      })
      pickCtnsInPlts(this.$route.params.shipOrderId, id, plt.selectedPlts, plt.newPlts, JSON.stringify(arr)).then(() => {
        this.$message({
          message: 'Success',
          type: 'success'
        })
        getPltsInventory(this.$route.params.shipOrderId, this.container, this.sku, this.amzRef, this.warehouseCode).then(body => {
          this.pltsInventory = body.data
        })
        this.$emit('referashPickDetails')
      })
    },
    correct(model, name, max, min) {
      correctNumber(model, name, max, min)
    },
    searchHandler() {
      this.loading = true
      getPltsInventory(this.$route.params.shipOrderId, this.container, this.sku, this.amzRef, this.warehouseCode).then(body => {
        this.pltsInventory = body.data
        this.loading = false
        this.$message({
          message: 'Search complete',
          type: 'success'
        }).catch(e => {
          this.$message({
            message: 'Search failed',
            type: 'warning'
          })
          this.loading = false
        })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
