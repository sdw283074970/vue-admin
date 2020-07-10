<template>
  <div>
    <div class="input-bar">
      <!-- <el-button type="primary" icon="el-icon-document" @click="filterVisible=true">SKU Filter</el-button> -->
      <el-button :loading="localLoading" type="warning" @click="onNewOrderClicked">New Order</el-button>
      <el-button :loading="localLoading" type="danger" @click="onProcessingClicked">Processing</el-button>
      <el-button :loading="localLoading" type="success" @click="onReadyClicked">Ready</el-button>
      <el-button :loading="localLoading" type="info" @click="onReleasedClicked">Released</el-button>
      <el-button :loading="localLoading" icon="el-icon-refresh" @click="clearFilter">Reset All</el-button>
      <el-input
        v-model="search"
        style="width:250px"
        size="large"
        placeholder="Search..."
        :disabled="loading"
      />
    </div>
    <el-table
      ref="table"
      v-loading="loading"
      :data="filteredData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      stripe
      border
      style="width: 100%"
      @filter-change="onFilterChange"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="gb-table-expand">
            <el-form-item label="Ship Order #">
              <span>{{ props.row.orderNumber }}</span>
            </el-form-item>
            <el-form-item label="BOL #">
              <span>{{ props.row.bolNumber }}</span>
            </el-form-item>
            <el-form-item label="Carrier">
              <span>{{ props.row.carrier }}</span>
            </el-form-item>
            <!-- <el-form-item label="Push Date">
              <span>{{ props.row.pushTime.substring(0, 4)==1900?'-':props.row.pushTime.substring(0, 10) }}</span>
            </el-form-item>
            <el-form-item label="Start Time">
              <span>{{ props.row.unloadStartTime.substring(0, 4)==1900?'-':props.row.unloadStartTime.substring(0, 10) }}</span>
            </el-form-item>
            <el-form-item label="Finish Time">
              <span>{{ props.row.unloadFinishTime.substring(0, 4)==1900?'-':props.row.unloadFinishTime.substring(0, 10) }}</span>
            </el-form-item>
            <el-form-item label="Out Time">
              <span>{{ props.row.outTime.substring(0, 4)==1900?'-':props.row.outTime.substring(0, 10) }}</span>
            </el-form-item> -->
            <el-form-item label="Quick Instruction">
              <span>{{ props.row.instruction }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        fixed
        prop="id"
        label="Id"
        width="60"
      />
      <el-table-column
        fixed
        prop="status"
        label="Status"
        width="120"
      >
        <template slot-scope="scope">
          <font :color="changeStatusColor(scope.row.status)">{{ scope.row.status }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderNumber"
        label="Order #"
        fixed
        width="200"
      />
      <el-table-column
        prop="customerCode"
        label="Customer Code"
        align="center"
        width="120"
      />
      <el-table-column
        label="Batch #"
        prop="batchNumber"
        align="center"
        width="100"
      />
      <el-table-column
        prop="carrier"
        align="center"
        label="Carrier Info"
        width="120"
      />
      <!-- <el-table-column
        prop="subCustomer"
        label="Sub-code"
        sortable
        width="120"
      /> -->
      <el-table-column
        label="CTNS"
        prop="totalCtns"
        align="center"
        width="100"
      />
      <el-table-column
        label="PLTS"
        prop="totalPlts"
        align="center"
        width="100"
      />
      <el-table-column
        label="DEST"
        prop="destination"
        align="center"
        width="100"
      />
      <el-table-column
        prop="placeTime"
        label="PUSH DATE"
        align="center"
        width="140"
        sortable
      >
        <template slot-scope="scope">
          <font>{{ transferDate(scope.row.placeTime) }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="ets"
        label="ETS"
        align="center"
        width="140"
        sortable
      >
        <template slot-scope="scope">
          <font>{{ transferDate(scope.row.ets) }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="operation"
        label="operation"
      >
        <template slot-scope="scope">
          <el-button @click="woHandler(scope.row.id)">WO & Details</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="!loading"
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
      title="Manage Efiles"
      :visible.sync="filterVisible"
      width="300px"
      top="5vh"
      :lock-scroll="false"
    >
      <generic-order-filter @onFilterConfirmed="onFilterConfirmed" />
    </el-dialog>
  </div>
</template>
<script>
import { outboundOrderStatus } from '@/scripts/dropdown'

export default {
  components: {
    'generic-order-filter': () => import('@/views/shareview/generic/generic-order-filter')
  },
  props: {
    tableData: {
      type: Array,
      default: null
    },
    loading: Boolean,
    customerCodeFilters: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
      search: '',
      customerCodeFilter: [],
      filteredData: [],
      localLoading: false,
      filterVisible: false,
      orderType: 'MasterOrder',
      statusFilters: outboundOrderStatus
    }
  },
  computed: {
    totalEntries() {
      return this.filteredData.length
    }
  },
  watch: {
    tableData: function(val, oldVal) {
      this.filteredData = val
    },
    search: function(val, oldVal) {
      this.filteredData = this.tableData.filter(data => {
        return Object.keys(data).some(key => {
          return String(data[key]).toLowerCase().indexOf(val.toLowerCase()) > -1
        })
      })
    }
  },
  mounted() {

  },
  methods: {
    transferDate: function(date) {
      return date === undefined ? '' : (date.substring(0, 4) === '1900' ? '-' : date.substring(0, 10))
    },
    clearFilter() {
      this.$refs.table.clearFilter()
      this.$emit('onRefreshClicked')
      // this.localLoading = true;
      // this.filteredData = this.tableData;
      // this.localLoading = false;
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    editHandler: function(id) {
      this.$emit('onEditClicked', id)
    },
    createHandler: function() {
      this.$emit('onCreateClicked')
    },
    woHandler: function(id) {
      this.$router.push({ path: '/warehouse-shipping/shipping-wo/' + id })
    },
    changeStatusColor: function(status) {
      if (status === 'New Created') { return 'gray' } else if (status === 'Picking' || status === 'Processing' || status === 'Pending' || status === 'Draft' || status === 'Updated') { return 'red' } else if (status === 'Incoming' || status === 'Returned' || status === 'New Order') { return 'orange' } else if (status === 'Allocated' || status === 'Released') { return 'brown' } else if (status === 'Received' || status === 'Ready') { return 'green' } else if (status === 'Registered') { return 'purple' } else if (status === 'Arrived') { return 'darkcyan' } else { return 'black' }
    },
    onEfilesClicked(reference) {
      this.$emit('onEfilesClicked', reference)
    },
    onFilterChange(filters) {
      this.filteredData = this.tableData.filter((row) => {
        return row.customerCode === filters.code[0]
      })

      // var arr = [];
      // this.filteredData.filter(row => {
      //   if (row.customerCode == filters.code[0])
      //   {
      //     arr.push(row);
      //   }
      // })
      // this.filteredData = arr;

      // this.filteredData = this.tableData.filter((row) => {
      //   return row.status = filters.status[0]
      // })
    },
    onFilterConfirmed(filter) {
      this.filterVisible = false
      this.$emit('onFilterConfirmed', filter)
    },
    onNewOrderClicked() {
      this.filteredData = this.tableData.filter((row) => {
        return row.status === 'New Order'
      })
    },
    onProcessingClicked() {
      this.filteredData = this.tableData.filter((row) => {
        return row.status === 'Processing' || row.status === 'Pending' || row.status === 'Updated'
      })
    },
    onReadyClicked() {
      this.filteredData = this.tableData.filter((row) => {
        return row.status === 'Ready'
      })
    },
    onReleasedClicked() {
      this.filteredData = this.tableData.filter((row) => {
        return row.status === 'Released'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    .input-bar{
      text-align: right
    }
</style>
