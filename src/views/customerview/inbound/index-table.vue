<template>
  <div>
    <div class="input-bar">
      <el-button type="primary" icon="el-icon-plus" @click="createHandler">New Inbound Order</el-button>
      <el-button @click="clearFilter">Clear All Filters</el-button>
      <el-input
        v-model="search"
        style="width:250px"
        size="large"
        placeholder="Search..."
      />
    </div>
    <el-table
      ref="table"
      v-loading="loading"
      :data="filteredData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      stripe
      border
      :height="tableHeight"
      style="width: 100%"
      @filter-change="filterChange"
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
              <span>{{ props.row.unloadingType }}</span>
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
            <el-form-item label="Total Amount">
              <span>${{ props.row.totalAmount }}</span>
            </el-form-item>
            <el-form-item label="Toal Cost">
              <span>${{ props.row.totalCost }}</span>
            </el-form-item>
            <el-form-item label="Net">
              <span>${{ props.row.totalAmount-props.row.totalCost }}</span>
            </el-form-item>
            <el-form-item label="Quick Instruction">
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
        fixed=""
        prop="id"
        label="Id"
        width="60"
      />
      <el-table-column
        sortable
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
        prop="container"
        label="Container #"
        sortable
        fixed=""
        width="200"
      />
      <el-table-column
        prop="customerCode"
        label="Code"
        sortable
        :column-key="'code'"
        :filters="customerCodeFilter"
        width="100"
      />
      <el-table-column
        prop="subCustomer"
        label="Sub-code"
        sortable
        width="120"
      />
      <el-table-column
        label="Ctns"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <font color="blue">{{ scope.row.actualCtns }}</font> of <font color="red">{{ scope.row.totalCtns }}</font>
        </template>
      </el-table-column>
      <el-table-column
        label="Plts"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <font color="blue">{{ scope.row.actualPlts }}</font> of <font color="red">{{ scope.row.originalPlts }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="skuNumber"
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
          <font>{{ scope.row.eta.substring(0, 10) }}</font>
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
          <font>{{ scope.row.inboundDate.substring(0, 4)==1900?'-':scope.row.inboundDate.substring(0, 10) }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="operation"
        label="operation"
      >
        <template slot-scope="scope">
          <el-button disabled="">eFiles</el-button>
          <el-button :disabled="scope.row.status!='New Created'" @click="editHandler(scope.row.id, scope.$index)">Edit</el-button>
          <el-button @click="woHandler(scope.row.id)">WO</el-button>
          <el-button type="danger" plain disabled="">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top:10px"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="20"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalEntries"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
/* eslint-disable */
export default {
    props:{
        filteredData: Array,
        loading: Boolean,
        totalEntries: Intl
    },
    data() {
        return {
            tableHeight: window.innerHeight * 0.75,
            currentPage: 1,
            pageSize: 20,
            search: '',
            customerCodeFilter : []
        };
    },
    watch:{
      search: function(val, oldVal){
        this.$emit('onSearchChanged', val);
      }
    },
    methods:{
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
      filterChange(filters){
      	console.log(filters);
      },
      clearFilter() {
        this.$refs.table.clearFilter();
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
        this.$router.push({path: '/inbound/inbound-wo/' + id});
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
