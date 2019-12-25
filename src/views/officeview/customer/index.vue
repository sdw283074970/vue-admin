<template>
  <div class="gb-maincontainer">
    <h1>Customer Manager</h1>
    <div class="input-bar">
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
      :data="filteredData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      stripe
      border
      height="715"
      style="width: 100%"
      @filter-change="filterChange"
    >
      <el-table-column
        sortable
        fixed=""
        prop="id"
        label="Id"
        width="60"
      />
      <el-table-column
        prop="customerCode"
        fixed
        label="Code"
        sortable
        :column-key="'code'"
        :filters="customerCodeFilter"
        width="100"
      />
      <el-table-column
        prop="processingCtns"
        label="Processing Ctns"
        sortable
        width="160"
      >
        <template slot-scope="scope">
          <font>{{ scope.row.processingCtns===0?'-':scope.row.processingCtns }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="processingPlts"
        label="Processing Plts"
        sortable
        width="160"
      >
        <template slot-scope="scope">
          <font>{{ scope.row.processingPlts===0?'-':scope.row.processingPlts }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="instockCtns"
        label="In-stock Ctns"
        sortable
        width="135"
      >
        <template slot-scope="scope">
          <font>{{ scope.row.instockCtns===0?'-':scope.row.instockCtns }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="instockPlts"
        sortable
        label="In-stock Plts"
        width="135"
      >
        <template slot-scope="scope">
          <font>{{ scope.row.instockPlts===0?'-':scope.row.instockPlts }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="warningQuantityLevel"
        label="Warning Ctns Lv"
        sortable
        width="160"
      />
      <el-table-column
        prop="payableInvoices"
        sortable
        label="Payable Invoices"
        width="160"
      >
        <template slot-scope="scope">
          <font :color="scope.row.payableInvoices==0?'blue':'red'">{{ scope.row.payableInvoices }}</font>
        </template>
      </el-table-column>
      <el-table-column
        label="Status"
        sortable
        fixed="right"
        width="100"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status=='Active'?'success':'danger'" size="medium">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="operation"
        label="operation"
        fixed="right"
        width="450"
      >
        <template slot-scope="scope">
          <el-button @click="editHandler(scope.row.id, scope.$index)">Edit</el-button>
          <el-button @click="editHandler(scope.row.id, scope.$index)">Services</el-button>
          <el-button @click="editHandler(scope.row.id, scope.$index)">Instructions</el-button>
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

    <el-dialog title="Edit Customer" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="Customer Name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="on" :disabled="true" />
        </el-form-item>
        <el-form-item label="Customer Code" :label-width="formLabelWidth">
          <el-input v-model="form.customerCode" autocomplete="on" :disabled="true" />
        </el-form-item>
        <el-form-item label="Department" :label-width="formLabelWidth">
          <el-input v-model="form.departmentCode" autocomplete="on" :disabled="true" />
        </el-form-item>
        <el-form-item label="Address Line 1" :label-width="formLabelWidth">
          <el-input v-model="form.firstAddressLine" autocomplete="on" />
        </el-form-item>
        <el-form-item label="Address Line 2" :label-width="formLabelWidth">
          <el-input v-model="form.secondAddressLine" autocomplete="on" />
        </el-form-item>
        <el-form-item label="Tel." :label-width="formLabelWidth">
          <el-input v-model="form.telNumber" autocomplete="on" />
        </el-form-item>
        <el-form-item label="Email" :label-width="formLabelWidth">
          <el-input v-model="form.emailAddress" autocomplete="on" />
        </el-form-item>
        <el-form-item label="Contact Person" :label-width="formLabelWidth">
          <el-input v-model="form.contactPerson" autocomplete="on" />
        </el-form-item>
        <el-form-item label="Warning Level(Ctns)" :label-width="formLabelWidth">
          <el-input v-model="form.warningQuantityLevel" autocomplete="on" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">Comfirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { getCustomerDB } from '@/api/customer'

export default {
    data() {
        return {
            tableData: [],
            filteredData: [],
            totalEntries: 0,
            currentPage: 1,
            pageSize: 20,
            search: '',
            dialogFormVisible : false,
            formLabelWidth : '200px',
            customerCodeFilter : [],
            form: {
              id : 0,
              name: '',
              departmentCode: '',
              customerCode: '',
              warningQuantityLevel: 0,
              firstAddressLine: '',
              secondAddressLine: '',
              telNumber: '',
              emailAddress: '',
              contactPerson: ''
            }
        };
    },
    watch:{
      search: function(val, oldVal){
        this.filteredData = this.tableData.filter(data => {
            return Object.keys(data).some(key => {
              return String(data[key]).toLowerCase().indexOf(this.search.toLowerCase()) > -1
          })
        })
        this.totalEntries = this.filteredData.length;
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
        this.$refs.customerTable.clearFilter();
      },
      handleSizeChange(val) {
        this.pageSize = val;
      },
      handleCurrentChange(val) {
        this.currentPage = val;
      },
      editHandler: function(id, index) {
        this.dialogFormVisible = true
        this.tableData.find((i) => {
          if (i.id === id)
          {
            this.form = i;
            return;
          }
        });        
      },
    },
    mounted() {
        getCustomerDB().then(
            body => {
                this.tableData = body.data;
                this.filteredData = body.data;
                this.totalEntries = body.data.length
                body.data.forEach(element => {
                    var newObj = {"text" : element.customerCode, "value" : element.customerCode};
                    this.customerCodeFilter.push(newObj);
                });
            }
        )
    }
}
</script>

<style lang="scss" scoped>
    .input-bar{
      text-align: right
    }
</style>
