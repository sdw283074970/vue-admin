<template>
  <div class="gb-maincontainer">
    <h1>Customer Manager</h1>
    <div class="input-bar">
      <el-button type="primary" icon="el-icon-plus" @click="onNewCustomerClicked">New Customer</el-button>
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
        :column-key="'code'"
        :filters="customerCodeFilter"
        width="140"
      />
      <el-table-column
        prop="processingCtns"
        label="Processing Ctns"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <font>{{ scope.row.processingCtns===0?'-':scope.row.processingCtns }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="processingPlts"
        align="center"
        label="Processing Plts"
        width="100"
      >
        <template slot-scope="scope">
          <font>{{ scope.row.processingPlts===0?'-':scope.row.processingPlts }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="instockCtns"
        label="In-stock Ctns"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <font>{{ scope.row.instockCtns===0?'-':scope.row.instockCtns }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="instockPlts"
        label="In-stock Plts"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <font>{{ scope.row.instockPlts===0?'-':scope.row.instockPlts }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="warningQuantityLevel"
        align="center"
        label="Warning Ctns Lv"
        width="80"
      />
      <el-table-column
        prop="payableInvoices"
        align="center"
        label="Payable Invoices"
        width="80"
      >
        <template slot-scope="scope">
          <font :color="scope.row.payableInvoices==0?'blue':'red'">{{ scope.row.payableInvoices }}</font>
        </template>
      </el-table-column>
      <el-table-column
        label="Status"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status=='Active'?'success':'danger'" size="medium">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="linkedAccount"
        align="center"
        label="Linked Account"
        width="220"
      />
      <el-table-column
        prop="operation"
        label="operation"
      >
        <template slot-scope="scope">
          <el-button @click="editHandler(scope.row.id, scope.$index)">Edit</el-button>
          <el-button @click="onLinkToUserClicked(scope.row.id)">Link to User</el-button>
          <el-button disabled>Services</el-button>
          <el-button @click="onInstructionsClicked(scope.row.id)">Instructions</el-button>
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

    <el-dialog title="Edit Customer1" :visible.sync="editVisible" top="5vh" width="900px">
      <div>
        <el-form ref="customerForm" :model="form" :rules="rules" style="float:left">
          <el-form-item label="Customer Name" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name" autocomplete="on" :disabled="isEdit" />
          </el-form-item>
          <el-form-item label="Customer Code" :label-width="formLabelWidth" prop="customerCode">
            <el-input v-model="form.customerCode" autocomplete="on" :disabled="isEdit" />
          </el-form-item>
          <el-form-item label="Department" :label-width="formLabelWidth" prop="departmentCode">
            <el-input v-model="form.departmentCode" autocomplete="on" :disabled="true" />
          </el-form-item>
          <el-form-item label="Warning Level(Ctns)" :label-width="formLabelWidth" prop="warningQuantityLevel">
            <el-input v-model="form.warningQuantityLevel" type="number" autocomplete="on" />
          </el-form-item>
          <el-form-item label="Contact Person" :label-width="formLabelWidth" prop="contactPerson">
            <el-input v-model="form.contactPerson" autocomplete="on" />
          </el-form-item>
        </el-form>
        <el-form ref="customerForm2" :model="form" style="float:right;margin-right:30px">
          <el-form-item label="Tel." :label-width="formLabelWidth" prop="telNumber">
            <el-input v-model="form.telNumber" autocomplete="on" />
          </el-form-item>
          <el-form-item label="Email" :label-width="formLabelWidth" prop="emailAddress">
            <el-input v-model="form.emailAddress" autocomplete="on" />
          </el-form-item>
          <el-form-item label="Address Line 1" :label-width="formLabelWidth" prop="firstAddressLine">
            <el-input v-model="form.firstAddressLine" autocomplete="on" />
          </el-form-item>
          <el-form-item label="Address Line 2" :label-width="formLabelWidth" prop="secondAddressLine">
            <el-input v-model="form.secondAddressLine" autocomplete="on" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" style="margin-right:40px;margin-bottom:30px">
        <el-button v-if="isEdit" type="primary" @click="onUpdateClicked">Update</el-button>
        <el-button v-if="!isEdit" type="primary" @click="onCreateClicked">Create</el-button>
        <el-button @click="editVisible = false">Cancel</el-button>
      </div>
    </el-dialog>

    <el-dialog title="Link user account" :visible.sync="linkVisible" top="5vh" width="400px">
      <div style="text-align:center">
        <label>User account (Email):</label><el-input v-model="linkForm.email" />
        <P><font color="red">Input "DISMISS" to unlink</font></P>
        <el-button type="primary" @click="onLinkClicked">Link</el-button>
        <el-button @click="linkVisible = false">Cancel</el-button>
      </div>
    </el-dialog>

    <el-dialog title="Instruction Template" :visible.sync="instructionVisible" top="5vh" width="1400px">
      <instructions :templates="templates" />
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { getCustomerDB, createCustomer, updateCustomer, linkToUser, getInstructionTemplates } from '@/api/customer'

export default {
    data() {
        return {
            tableData: [],
            filteredData: [],
            totalEntries: 0,
            currentPage: 1,
            pageSize: 20,
            search: '',
            editVisible : false,
            linkVisible: false,
            loading: true,
            formLabelWidth : '200px',
            customerCodeFilter : [],
            isEdit: false,
            instructionVisible: false,
            linkForm: {
              id: 0,
              email: ''
            },
            templates: [],
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
            },
            rules: {
              name: [
                { required: true, message: 'Please input customer name', trigger: 'change' }
              ],
              customerCode: [
                { required: true, message: 'Please input customer code', trigger: 'change' }
              ],
              warningQuantityLevel: [
                { required: true, message: 'Please input the warning level', trigger: 'change' }
              ]
            }
        };
    },
    components: {
        "instructions": () => import('@/views/officeview/customer/instructions'),
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
        if (this.$refs.customerForm != undefined)
        {
          this.$refs.customerForm.resetFields()
        }
        this.editVisible = true
        this.isEdit = true
        this.tableData.find((i) => {
          if (i.id === id)
          {
            this.form = i;
            return;
          }
        });        
      },
      onUpdateClicked() {
        this.$refs['customerForm'].validate((valid) => {
            if (valid) {
                updateCustomer(this.form).then(() => {
                  this.loading = true
                  this.editVisible = false
                  this.reloadCustomers()
                })
            } else {
                console.log('error submit!!');
                return false;
            }
        });
      },
      onCreateClicked() {
        this.$refs['customerForm'].validate((valid) => {
            if (valid) {
                createCustomer(this.form).then(() => {
                  this.editVisible = false
                  this.loading = true
                  this.reloadCustomers()
                })
            } else {
                console.log('error submit!!');
                return false;
            }
        });
      },
      onNewCustomerClicked() {
        // this.$refs.customerForm.resetFields()
        if (this.$refs.customerForm != undefined)
        {
          this.$refs.customerForm.resetFields()
        }
        this.form = {
          id : 0,
          name: '',
          departmentCode: 'FBA',
          customerCode: '',
          warningQuantityLevel: 0,
          firstAddressLine: '',
          secondAddressLine: '',
          telNumber: '',
          emailAddress: '',
          contactPerson: ''
        }
        this.isEdit = false
        this.editVisible = true
      },
      onLinkToUserClicked(id) {
        this.linkForm.id = id
        this.linkVisible = true
      },
      onLinkClicked() {
        linkToUser(this.linkForm).then(() => {
          this.reloadCustomers()
          this.linkVisible =false
        })
      },
      reloadCustomers() {
        getCustomerDB().then(
            body => {
                this.tableData = body.data
                this.loading = false
                this.filteredData = body.data
                this.totalEntries = body.data.length
                this.$message({
                  message: 'Success',
                  type: 'success'
                })
            }
        )
      },
      onInstructionsClicked(id) {
        this.instructionVisible = true
        getInstructionTemplates(id).then(body => {
          this.templates = body.data
        })
      }
    },
    mounted() {
        getCustomerDB().then(
            body => {
                this.tableData = body.data
                this.filteredData = body.data
                this.totalEntries = body.data.length
                this.loading = false
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
