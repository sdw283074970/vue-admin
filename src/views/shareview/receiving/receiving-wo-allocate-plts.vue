  <template>
    <div>
        <el-table
          :data="pltData"
          ref="allocating-plts"
          stripe
          border
          v-if="isVisible"
          height="500"
          style="width: 100%">
            <el-table-column
            sortable
            prop="id"
            label="Plt Id"
            width="80">
            </el-table-column>
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-table
                    :data="props.row.fbaCartonLocations"
                    ref="table-allocate-plts"
                    border
                    stripe>
                        <el-table-column
                            sortable
                            prop="id"
                            label="Ctn Id"
                            width="100">
                        </el-table-column>
                        <el-table-column
                            sortable
                            prop="shipmentId"
                            label="SKU"
                            min-width="60%">
                        </el-table-column>
                        <el-table-column
                            sortable
                            prop="amzRefId"
                            label="Amz Ref Id"
                            min-width="60%">
                        </el-table-column>
                        <el-table-column
                            prop="warehouseCode"
                            label="Whse Code"
                            min-width="30%">
                        </el-table-column>
                        <el-table-column
                            prop="grossWeightPerCtn"
                            label="GW/Ctn"
                            min-width="30%">
                        </el-table-column>
                        <el-table-column
                            prop="cbmPerCtn"
                            label="CBM/Ctn"
                            min-width="30%">
                        </el-table-column>
                        <el-table-column
                            prop="actualQuantity"
                            label="Org Ctns"
                            min-width="30%">
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column
            prop="container"
            label="Container #"
            sortable=""
            min-width="60%">
            </el-table-column>
            <el-table-column
            prop="shipmentId"
            sortable=""
            label="Shipment Id/SKU"
            min-width="60%">
             </el-table-column>
             <el-table-column
            prop="amzRefId"
            sortable=""
            label="Amz Ref Id"
            min-width="60%">
             </el-table-column>
             <el-table-column
            prop="palletSize"
            label="Pallet Size"
            min-width="30%">
             </el-table-column>
            <el-table-column
            prop="warehouseCode"
            label="Whse Code"
            min-width="30%">
            </el-table-column>
             <el-table-column
            prop="actualQuantity"
            label="Ttl Ctns"
            min-width="20%">
             </el-table-column>
             <el-table-column
            prop="actualPallets"
            label="Ttl Plts"
            min-width="20%">
            </el-table-column>
            <el-table-column
            prop="comsumedPallets"
            label="TBA Plts"
            min-width="25%">
                <template
                slot-scope="scope">
                    <font>{{ scope.row.actualPallets - scope.row.comsumedPallets }}</font>
                </template>
            </el-table-column>
            <el-table-column
                type="selection"
                width="60">
            </el-table-column>
            <el-table-column
            label="Location/Operation"
            align="center"
            min-width="60%">
                <template slot-scope="scope">
                    <el-input style="width:100px" />
                    <el-button @click="pickHandler(scope.row.id)">Relay</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
  </template>
<script>
/* eslint-disable */

export default {
  props: {
    isVisible: false,
    pltData: Array
  },
  methods:{

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
