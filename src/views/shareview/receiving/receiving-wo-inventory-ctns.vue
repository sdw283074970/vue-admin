<template>
  <div>
    <el-table
      v-if="isVisible"
      ref="inventory-ctns"
      :data="ctnInventoryData"
      stripe
      border
      :height="tableHight"
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
        label="Org Ctns"
        min-width="30%"
      />
      <el-table-column
        prop="availableCtns"
        label="Ava Ctns"
        min-width="30%"
      />
      <el-table-column
        prop="pickingCtns"
        label="Picking Ctns"
        min-width="30%"
      />
      <el-table-column
        prop="shippedCtns"
        label="Shipped Ctns"
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
          <el-button :loading="loading" @click="onHistoryClicked(scope.row.id)">History</el-button>
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
  </div>
</template>
<script>
/* eslint-disable */
import { getCtnHistories} from '@/api/inventory'

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
