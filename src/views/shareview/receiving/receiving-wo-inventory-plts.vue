<template>
  <div>
    <el-table
      v-if="isVisible"
      ref="inventory-plts"
      :data="pltInventoryData"
      stripe
      border
      :height="tableHight"
      style="width: 100%"
    >
      <el-table-column
        sortable
        prop="id"
        label="Plt Id"
        width="80"
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
            <el-table-column
              prop="availableCtns"
              label="Ava Ctns"
              min-width="30%"
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
        label="Plt Size"
        min-width="20%"
      />
      <el-table-column
        prop="warehouseCode"
        label="Whse Code"
        min-width="30%"
      />
      <el-table-column
        prop="actualQuantity"
        label="Org Ctns"
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
        prop="pickingPlts"
        label="Picking Plts"
        min-width="30%"
      />
      <el-table-column
        prop="shippedPlts"
        label="Shipped Plts"
        min-width="30%"
      />
      <el-table-column
        prop="location"
        label="Location"
        min-width="30%"
      />
      <el-table-column
        label="Operation"
        align="center"
        min-width="30%"
      >
        <template slot-scope="scope">
          <el-button @click="onPltHistoryClicked(scope.row.id)">History</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="Plt Outbound History"
      :visible.sync="pltHistoryVisible"
      width="900px"
      top="5vh"
      :lock-scroll="false"
      append-to-body
    >
      <plt-history :plt-outbound-histories="pltOutboundHistories" :history-sum="historySum" />
    </el-dialog>
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
  </div>
</template>
<script>
/* eslint-disable */
import { getPltHistories, getCtnHistories } from '@/api/inventory'

export default {
  props: {
    isVisible: false,
    pltInventoryData: Array,
    customerCode: String
  },
  components: {
    "plt-history": () => import('@/views/shareview/generic/generic-plt-history'),
    "ctn-history": () => import('@/views/shareview/generic/generic-ctn-history')
  },
  data(){
    return {
      tableHight: window.innerHeight * 0.6,
      pltOutboundHistories: [],
      ctnOutboundHistories: [],
      pltHistoryVisible: false,
      ctnHistoryVisible: false,
      loading: false,
      historySum: {
        container: '',
        customerCode: '',
        shipmentId: '',
        amzRefId: '',
        warehouseCode: ''
      }
    }
  },
  methods:{
    onPltHistoryClicked(id) {
      this.loading = true;
      var obj = this.pltInventoryData.find(x => x.id === id)
      this.historySum.container = obj.container;
      this.historySum.customerCode = this.customerCode;
      this.historySum.shipmentId = obj.shipmentId;
      this.historySum.amzRefId = obj.amzRefId;
      this.historySum.warehouseCode = obj.warehouseCode;
      getPltHistories(id).then(body => {
        this.pltHistoryVisible = true;
        this.pltOutboundHistories = body.data;
      })
      this.loading = false;
    },
    onCtnHistoryClicked(id) {
      this.loading = true;
      getCtnHistories(id).then(body => {
        this.ctnHistoryVisible = true;
        this.ctnOutboundHistories = body.data;
        this.historySum.container = body.data[0].container;
        this.historySum.customerCode = this.customerCode;
        this.historySum.shipmentId = body.data[0].shipmentId;
        this.historySum.amzRefId = body.data[0].amzRefId;
        this.historySum.warehouseCode = body.data[0].warehouseCode;
      })
      this.loading = false;
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
