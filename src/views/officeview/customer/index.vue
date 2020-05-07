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
      style="width: 100%"
      @filter-change="filterChange"
    >
      <el-table-column
        sortable
        prop="id"
        label="Id"
        width="60"
      />
      <el-table-column
        prop="name"
        label="Customer Name"
        width="180"
      />
      <el-table-column
        prop="customerCode"
        label="Customer Code"
        width="130"
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
        width="110"
      >
        <template slot-scope="scope">
          <font>{{ scope.row.instockCtns===0?'-':scope.row.instockCtns }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="instockPlts"
        label="In-stock Plts"
        align="center"
        width="105"
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
          <el-button v-if="scope.row.status=='Inactive'" style="width:80px" @click="activeHandler(scope.row.id, scope.$index)">Active</el-button>
          <el-button v-if="scope.row.status=='Active'" style="width:80px" @click="activeHandler(scope.row.id, scope.$index)">Deactive</el-button>
          <el-button @click="onLinkToUserClicked(scope.row.id)">Link to User</el-button>
          <el-dropdown style="margin-left:10px">
            <el-button>
              More<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="onInstructionsClicked(scope.row.id)">Instructions</el-dropdown-item>
              <el-dropdown-item @click.native="onServicesClicked(scope.row.id)">Services</el-dropdown-item>
              <el-dropdown-item @click.native="onStorageClicked(scope.row.id, scope.row.customerCode)">Storage</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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

    <el-dialog title="Edit Customer" :visible.sync="editVisible" top="5vh" width="900px">
      <el-form ref="form-required" :rules="rules" :model="form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="Department" :label-width="formLabelWidth" prop="departmentCode">
              <el-input v-model="form.departmentCode" autocomplete="on" :disabled="true" />
            </el-form-item>
            <el-form-item label="Customer Name" :label-width="formLabelWidth" prop="name">
              <el-input v-model="form.name" autocomplete="on" :disabled="isEdit" />
            </el-form-item>
            <el-form-item label="Customer Code" :label-width="formLabelWidth" prop="customerCode">
              <el-input v-model="form.customerCode" autocomplete="on" :disabled="isEdit" />
            </el-form-item>
            <el-form-item label="Warning Level(Ctns)" :label-width="formLabelWidth" prop="warningQuantityLevel">
              <el-input v-model="form.warningQuantityLevel" type="number" autocomplete="on" />
            </el-form-item>
            <el-form-item label="Contact Person" :label-width="formLabelWidth" prop="contactPerson">
              <el-input v-model="form.contactPerson" autocomplete="on" />
            </el-form-item>
            <el-form-item label="Inbound Min Charge" :label-width="formLabelWidth" prop="inboundMinCharge">
              <el-input v-model="form.inboundMinCharge" />
            </el-form-item>
            <el-form-item label="Outbound Min Charge" :label-width="formLabelWidth" prop="outboundMinCharge">
              <el-input v-model="form.outboundMinCharge" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
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
          </el-col>
        </el-row>
      </el-form>
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
      <instructions :templates="templates" :customer-id="customerId" @reloadTemplates="reloadTemplates" />
    </el-dialog>

    <el-dialog title="Manage Services" :visible.sync="serviceVisible" top="5vh" width="1400px">
      <services :services="services" :customer-id="customerId" @reloadServices="reloadServices" />
    </el-dialog>

    <el-dialog title="Manage Storage Charging Template" :visible.sync="storageVisible" top="5vh" width="800px">
      <storage :storage-price-table="storagePriceTable" :customer-id="customerId" :customer-code="customerCode" @reloadStorage="reloadStorage" />
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { getCustomerDB, createCustomer, updateCustomer, linkToUser, getInstructionTemplates, getCustomerServices, getCustomerStoragePriceTable, swithCustomerStatus } from '@/api/customer'

export default {
    data() {
        return {
            tableData: [],
            filteredData: [],
            totalEntries: 0,
            currentPage: 1,
            customerCode: '',
            pageSize: 20,
            search: '',
            editVisible : false,
            linkVisible: false,
            loading: true,
            formLabelWidth : '200px',
            customerCodeFilter : [],
            isEdit: false,
            customerId: 0,
            instructionVisible: false,
            serviceVisible: false,
            storageVisible: false,
            linkForm: {
              id: 0,
              email: ''
            },
            templates: [],
            services: [],
            storagePriceTable: [],
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
              contactPerson: '',
              inboundMinCharge: 0,
              outboundMinCharge: 0
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
              ],
              inboundMincharge: [
                { required: true, message: 'Please input the warning level', trigger: 'change' }
              ],
              outboundMincharge: [
                { required: true, message: 'Please input the warning level', trigger: 'change' }
              ]
            }
        };
    },
    components: {
        "instructions": () => import('@/views/officeview/customer/instructions'),
        "services": () => import('@/views/officeview/customer/services'),
        "storage": () => import('@/views/officeview/customer/storage'),
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
        if (this.$refs['form-required'] != undefined)
        {
          this.$refs['form-required'].resetFields()
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
        this.$refs['form-required'].validate((valid) => {
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
        this.$refs['form-required'].validate((valid) => {
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
        // this.$refs.form-required.resetFields()
        if (this.$refs['form-required'] != undefined)
        {
          this.$refs['form-required'].resetFields()
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
        this.customerId = id
        getInstructionTemplates(id).then(body => {
          this.templates = body.data
        })
      },
      onStorageClicked(id, code) {
        this.storageVisible = true
        this.customerId = id
        this.customerCode = code
        getCustomerStoragePriceTable(id).then(body => {
          this.storagePriceTable = body.data
        })
      },
      reloadTemplates() {
        getInstructionTemplates(this.customerId).then(body => {
          this.templates = body.data
          this.$message({
            message: 'Success',
            type: 'success'
          })
        })
      },
      onServicesClicked(id) {
        this.serviceVisible = true
        this.customerId = id
        getCustomerServices(id).then(body => {
          this.services = body.data
        })
      },
      reloadServices() {
        getCustomerServices(this.customerId).then(body => {
          this.services = body.data
          this.$message({
            message: 'Success',
            type: 'success'
          })
        })
      },
      reloadStorage() {
        getCustomerStoragePriceTable(this.customerId).then(body => {
          this.storagePriceTable = body.data
          this.$message({
            message: 'Success',
            type: 'success'
          })
        })
      },
      activeHandler(id) {
        swithCustomerStatus(id).then(() => {
          this.reloadCustomers();
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
