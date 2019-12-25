  <template>
    <div>
        <el-table
          :data="pltInventoryData"
          ref="inventory-plts"
          stripe
          border
          v-if="isVisible"
          :height="tableHight"
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
                        <el-table-column
                            prop="availableCtns"
                            label="Ava Ctns"
                            min-width="30%">
                        </el-table-column>
                    </el-table>
                </template>
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
                label="Plt Size"
                min-width="20%">
            </el-table-column>
            <el-table-column
                prop="warehouseCode"
                label="Whse Code"
                min-width="30%">
            </el-table-column>
             <el-table-column
                prop="actualQuantity"
                label="Org Ctns"
                min-width="30%">
             </el-table-column>
            <el-table-column
                prop="actualPlts"
                label="Org Plts"
                min-width="30%">
             </el-table-column>
             <el-table-column
                prop="availablePlts"
                label="Ava Plts"
                min-width="30%">
            </el-table-column>
            <el-table-column
                prop="pickingPlts"
                label="Picking Plts"
                min-width="30%">
            </el-table-column>
            <el-table-column
                prop="shippedPlts"
                label="Shipped Plts"
                min-width="30%">
            </el-table-column>
            <el-table-column
                prop="location"
                label="Location"
                min-width="30%">
            </el-table-column>
            <el-table-column
                label="Operation"
                align="center"
                min-width="30%">
                <template slot-scope="scope">
                    <el-button @click="pickHandler(scope.row.id)">History</el-button>
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
    pltInventoryData: Array
  },
  data(){
    return {
      tableHight: window.innerHeight * 0.6
    }
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
