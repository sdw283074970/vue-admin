<template>
  <div>
    <div class="input-bar">
      <!-- <el-button type="primary" icon="el-icon-document" @click="filterVisible=true">SKU Filter</el-button> -->
      <el-button id="csr-receiving-sku-filter" :loading="localLoading" type="primary" icon="el-icon-document" @click="filterVisible=true">Search</el-button>
      <el-input
        v-model="containerNumber"
        style="width:250px"
        size="small"
        :disabled="loading"
        placeholder="Input Container number"
      />
      <el-button :loading="localLoading" type="primary" @click="onSearchClicked">Search</el-button>
      <el-input
        v-model="search"
        style="width:250px"
        size="small"
        :disabled="loading"
        placeholder="Search in current page..."
      />
      <el-button :loading="localLoading" icon="el-icon-refresh" type="warning" @click="clearFilter">Reset All</el-button>
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
            <el-form-item label="Container #">
              <span>{{ props.row.container }}</span>
            </el-form-item>
            <el-form-item label="Grand #">
              <span>{{ props.row.grandNumber }}</span>
            </el-form-item>
            <el-form-item label="Unloading Type">
              <span>{{ props.row.inboundType }}</span>
            </el-form-item>
            <el-form-item label="Storage Type">
              <span>{{ props.row.storageType }}</span>
            </el-form-item>
            <el-form-item label="Palletizing">
              <span>{{ props.row.palletizing }}</span>
            </el-form-item>
            <el-form-item label="Carrier">
              <span>{{ props.row.carrier }}</span>
            </el-form-item>
            <el-form-item label="Dock #">
              <span>{{ props.row.dockNumber }}</span>
            </el-form-item>
            <el-form-item label="Container Size">
              <span>{{ props.row.containerSize }}</span>
            </el-form-item>
            <el-form-item label="Push Date">
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
            </el-form-item>
            <el-form-item label="Instruction">
              <span>{{ props.row.instruction }}</span>
            </el-form-item>
            <el-form-item label="Created By">
              <span>{{ props.row.createdBy }}</span>
            </el-form-item>
            <el-form-item label="Closed By">
              <span>{{ props.row.confirmedBy }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        fixed
        prop="id"
        label="Id"
        width="60"
      />
      <el-table-column
        fixed
        prop="status"
        label="Status"
        sortable
        width="120"
      >
        <template slot-scope="scope">
          <font :color="changeStatusColor(scope.row.status)">{{ scope.row.status }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="container"
        label="Container #"
        sortable
        fixed
        width="200"
      />
      <el-table-column
        prop="customerCode"
        label="Code"
        :column-key="'code'"
        :filters="customerCodeFilters"
        width="100"
      />
      <el-table-column
        prop="subCustomer"
        label="Sub-code"
        sortable
        width="120"
      />
      <el-table-column
        prop="carrier"
        align="center"
        label="Carrier Info"
        width="120"
      />
      <el-table-column
        label="Org Ctns"
        prop="originalCtns"
        align="center"
        width="100"
      />
      <el-table-column
        label="Actual Ctns"
        prop="actualCtns"
        align="center"
        width="100"
      />
      <el-table-column
        label="Org Plts"
        prop="originalPlts"
        align="center"
        width="80"
      />
      <el-table-column
        label="Actual Plts"
        prop="actualPlts"
        align="center"
        width="100"
      />
      <el-table-column
        prop="sku"
        label="SKU #"
        align="center"
        width="80"
      />
      <el-table-column
        prop="eta"
        label="ETA"
        sortable
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <font>{{ transferDate(scope.row.eta) }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="inboundDate"
        label="ATA"
        sortable
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <font>{{ transferDate(scope.row.inboundDate) }}</font>
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
    <!-- <el-dialog
      title="Manage Efiles"
      :visible.sync="filterVisible"
      width="300px"
      top="5vh"
      :lock-scroll="false"
    >
      <generic-order-filter @onFilterConfirmed="onFilterConfirmed" />
    </el-dialog> -->
    <el-dialog
      title="Search"
      :visible.sync="filterVisible"
      width="600px"
      top="5vh"
      :lock-scroll="false"
    >
      <generic-order-filter @onFilterConfirmed="onFilterConfirmed" />
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
import { inboundOrderStatus } from '@/scripts/dropdown'
import { getContainerIdByContainerNumber } from '@/api/receiving'

export default {
    props:{
        tableData: Array,
        loading: Boolean,
        customerCodeFilters: Array
    },
    data() {
        return {
            containerNumber: "",
            currentPage: 1,
            pageSize: 20,
            search: '',
            customerCodeFilter : [],
            filteredData: [],
            localLoading: false,
            filterVisible: false,
            orderType: 'MasterOrder',
            statusFilters: inboundOrderStatus
        };
    },
    components: {
        "generic-order-filter": () => import('@/views/shareview/generic/generic-order-filter')
    },
    computed: {
      totalEntries() {
        return this.filteredData.length
      }
    },
    watch:{
      tableData: function(val, oldVal){
        this.filteredData = val
      },
      search: function(val, oldVal){
        this.filteredData = this.tableData.filter(data => {
            return Object.keys(data).some(key => {
              return String(data[key]).toLowerCase().indexOf(val.toLowerCase()) > -1
          })
        })
      }
    },
    methods:{
      transferDate: function(date) {
          return date === undefined ? '' : (date.substring(0, 4) === '1900' ? '-' : date.substring(0, 10))
      },
      clearFilter() {
        this.$refs.table.clearFilter();
        this.$emit('onRefreshClicked');
        // this.localLoading = true;
        // this.filteredData = this.tableData;
        // this.localLoading = false;

      },
      handleSizeChange(val) {
        this.pageSize = val;
      },
      handleCurrentChange(val) {
        this.currentPage = val;
      },
      editHandler: function(id) {
        this.$emit('onEditClicked', id);
      },
      createHandler: function(){
        this.$emit('onCreateClicked');
      },
      woHandler: function(id){
        this.$router.push({path: '/warehouse-receiving/receiving-wo/' + id});
      },
      changeStatusColor: function(status) {
        if (status == 'New Created')
            return 'gray';
        else if (status == 'Picking' || status == 'Processing' || status == 'Pending' || status == 'Draft')
            return 'red';
        else if (status == 'Incoming' || status == 'Returned')
            return 'orange';
        else if (status == 'Allocated')
            return 'brown';
        else if (status == 'Received')
            return 'green';
        else if (status == 'Registered')
            return 'purple';
        else if (status == 'Arrived')
            return 'darkcyan';
        else
            return 'black';
      },
      onEfilesClicked(reference) {
        this.$emit('onEfilesClicked', reference)
      },
      onFilterChange(filters) {
        this.filteredData = this.tableData.filter((row) => {
          return row.customerCode == filters.code[0]
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
        this.filterVisible = false;
        this.$emit('onFilterConfirmed', filter);
      },
      onSearchClicked() {
        if (this.containerNumber == "")
        {
          alert("Container cannot be null")
          return
        }
        getContainerIdByContainerNumber(this.containerNumber).then(x => {
          var id = x.data

          if (id === 0)
          {
            this.$message({
            message: 'Container ' + this.containerNumber + ' not found in database',
            type: 'warning'
            });
          }

          if (id !== 0)
            this.$router.push({path: '/warehouse-receiving/receiving-wo/' + id});
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
