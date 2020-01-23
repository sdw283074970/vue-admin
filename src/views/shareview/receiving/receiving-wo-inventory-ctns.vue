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
        align="center"
        label="Org Ctns"
        min-width="30%"
      />
      <el-table-column
        prop="availableCtns"
        align="center"
        label="Ava Ctns"
        min-width="30%"
      />
      <el-table-column
        prop="pickingCtns"
        align="center"
        label="Picking Ctns"
        min-width="30%"
      />
      <el-table-column
        prop="shippedCtns"
        align="center"
        label="Shipped Ctns"
        min-width="30%"
      />
      <el-table-column
        prop="holdCtns"
        align="center"
        label="Hold Ctns"
        width="100"
      />
      <el-table-column
        prop="location"
        label="Location"
        align="center"
        min-width="30%"
      />
      <el-table-column
        label="Operation"
        align="center"
        min-width="30%"
      >
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              Options<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="onHistoryClicked(scope.row.id)">History</el-dropdown-item>
              <el-dropdown-item disabled @click.native="onHoldClicked(scope.row.id)">Hold</el-dropdown-item>
              <el-dropdown-item :disabled="(scope.row.location==='Pallet')||(scope.row.actualQuantity!==scope.row.availableCtns)" @click.native="onRelocateClicked(scope.row.id)">Relocate</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
import { getCtnHistories } from '@/api/inventory'
import { relocateItems } from '@/api/receiving'

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
    },
    onHoldClicked(id) {

    },
    onRelocateClicked(id) {
      relocateItems(id, 'Carton').then(() => {
        this.$emit('reloadOrder')
        this.$message({
          message: 'Success',
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
