<template>
  <div>
    <el-table
      v-if="isVisible"
      ref="allocating-plts"
      :data="pltData"
      stripe
      border
      height="500"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="Plt Id"
        width="60"
      />
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            ref="table-allocate-plts"
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
          </el-table>
        </template>
      </el-table-column>
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
        width="100"
      />
      <el-table-column
        prop="warehouseCode"
        label="Whse Code"
        width="100"
      />
      <el-table-column
        prop="actualQuantity"
        label="Ttl Ctns"
        width="80"
      />
      <el-table-column
        prop="actualPallets"
        label="Ttl Plts"
        width="70"
      />
      <el-table-column
        prop="comsumedPallets"
        label="TBA Plts"
        width="80"
      >
        <template
          slot-scope="scope"
        >
          <font>{{ scope.row.actualPallets - scope.row.comsumedPallets }}</font>
        </template>
      </el-table-column>
      <el-table-column
        type="selection"
        width="50"
      />
      <el-table-column
        label="Location"
        align="center"
        min-width="35%"
      >
        <template>
          <el-input style="width:100px" />
        </template>
      </el-table-column>
      <el-table-column
        label="Operation"
        align="center"
        min-width="30%"
      >
        <template slot-scope="scope">
          <el-button @click="onRelayClicked(scope.row.id)">Relay</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
/* eslint-disable */
import { getRO, getOrderDetails, getPallets, getCartons, getPltsInventory, getCtnsInventory, getInstructions, resetInstructions, replayPlt } from '@/api/receiving'

export default {
  props: {
    isVisible: false,
    pltData: Array
  },
  methods:{
      onRelayClicked(id){
          replayPlt(id).then(() => {
            // let index = this.pltData.map(x => x.id).indexOf(id)
            // this.pltData.splice(index, 1)
            this.$emit('reloadOrder')
            this.$message({
                message: 'Relay success',
                type: 'success'
            })
          })
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
