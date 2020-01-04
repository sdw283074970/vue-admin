<template>
  <div>
    <h2>Packing List</h2>
    <div class="input-bar">
      <el-button type="primary" icon="el-icon-plus" :disabled="step>6" @click="onNewClicked">New SKU</el-button>
      <el-button type="primary" icon="el-icon-upload" :disabled="masterOrder.status != 'New Created'" @click="onCommingSoonClicked">Upload Packing List File</el-button>
      <el-button type="primary" icon="el-icon-download" @click="onCommingSoonClicked">Download Packing List Template</el-button>
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
      :data="orderDetails"
      show-summary
      stripe
      border
      style="width: 100%"
    >
      <el-table-column
        sortable
        prop="id"
        label="Id"
        width="60"
      />
      <el-table-column
        prop="shipmentId"
        sortable=""
        label="Shipment Id/SKU"
        width="200"
      />
      <el-table-column
        prop="amzRefId"
        sortable=""
        label="Amz Ref Id"
        width="200"
      />
      <el-table-column
        prop="warehouseCode"
        label="Whse Code"
        width="100"
      />
      <el-table-column
        prop="howToDeliver"
        label="Delivery"
        width="100"
      />
      <el-table-column
        prop="grossWeight"
        label="G.W."
        width="100"
      >
        <template slot-scope="scope">
          <font>{{ scope.row.actualGrossWeight }} of {{ scope.row.grossWeight }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="cbm"
        label="CBM"
        width="100"
      >
        <template slot-scope="scope">
          <font>{{ scope.row.actualCBM }} of {{ scope.row.cbm }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="quantity"
        label="Quantity"
        width="100"
      >
        <template slot-scope="scope">
          <font>{{ scope.row.actualQuantity }} of {{ scope.row.quantity }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="Remark"
      />
      <el-table-column
        prop="labelFileNumbers"
        label="Labels"
        width="70"
      />
      <el-table-column
        prop="operation"
        label="operation"
        width="130"
      >
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              Operations<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :disabled="masterOrder.status!='Processing'&&masterOrder.status!='Pending'&&masterOrder.status!='Updated'" @click.native="onAdjustClicked(scope.row.id)">Adjust</el-dropdown-item>
              <el-dropdown-item :disabled="masterOrder.status!='New Created'" @click.native="onEditClicked(scope.row.id)">Edit SKU Info</el-dropdown-item>
              <el-dropdown-item @click.native="onUploadClicked(scope.row.id)">Upload Label Files</el-dropdown-item>
              <el-dropdown-item @click.native="onDownloadClicked(scope.row.id)">Download Label Files</el-dropdown-item>
              <el-dropdown-item divided :disabled="masterOrder.status!='New Created'" @click.native="onDeleteClicked(scope.row.id)">Delete</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="SKU Manager"
      :visible.sync="skuVisible"
      width="900px"
      top="5vh"
      :lock-scroll="false"
    >
      <receiving-wo-skuform
        :form-data="formData"
        :is-edit="isEdit"
        :is-adjust="isAdjust"
        :step="step"
        @onCancelClicked="onCancelClicked"
        @onAddClicked="onAddClicked"
        @onEditConfirmedClicked="onEditConfirmedClicked"
        @onAdjustConfirmedClicked="onAdjustConfirmedClicked"
      />
    </el-dialog>
    <el-dialog
      title="Upload Label Files"
      :visible.sync="uploadVisible"
      width="400px"
      :lock-scroll="false"
    >
      <el-upload
        class="upload-demo"
        drag
        :on-success="uploadSuccessHandler"
        :action="uploadAction"
        :multiple="false"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">Drag file here or <em>Click</em> to upload</div>
        <div slot="tip" class="el-upload__tip">Only accept zip /rar /pdf format files which less than 1 MB</div>
        <div slot="tip" class="el-upload__tip">One file per time</div>
      </el-upload>
    </el-dialog>
    <el-dialog
      title="Manage Label Files"
      :visible.sync="labelFilesVisible"
      width="800px"
      :lock-scroll="false"
    >
      <generic-labelfiles
        :label-files="labelFiles"
        :order-detail-id="orderDetailId"
        @onLabelDeleteSuccess="onLabelDeleteSuccess"
      />
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
import { addNewSKU, getSKUInfo, updateSKUInfo, deleteSKU, adjustSKUQuantity, getUploadLabelAction, getLabelFileList } from '@/api/receiving'

export default {
  props: {
    masterOrder: {},
    orderDetails: Array,
    step: Number
  },
  data() {
      return {
          search: '',
          filteredData : [],
          totalEntries: 0,
          currentPage: 1,
          pageSize: 20,
          formLabelWidth : '200px',
          customerCodeFilter : [],
          skuVisible: false,
          formData: {
            lotSize: '',
            grossWeight: 0,
            barcode: '',
            symbology: null,
            cbm: 0.,
            quantity: 0,
            remark: '',
            comsumedQuantity: 0,
            id: 0,
            grandNumber: '',
            container: '',
            shipmentId: '',
            amzRefId: '',
            warehouseCode: '',
            actualCBM: 0,
            actualGrossWeight: 0,
            actualQuantity: 0,
            comment: null,
            howToDeliver: '',
            status: ''
          },
          isEdit: false,
          isAdjust: false,
          uploadVisible: false,
          uploadAction: '',
          labelFilesVisible: false,
          labelFiles: [],
          orderDetailId: 0
      };
  },
  components: {
    "receiving-wo-skuform": () => import('@/views/shareview/receiving/receiving-wo-skuform'),
    "generic-labelfiles": () => import('@/views/shareview/generic/generic-labelfiles')
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
    onCancelClicked(){
      this.skuVisible = false;
    },
    onNewClicked(){
      this.skuVisible = true;
      this.isEdit = false;
      this.isAdjust = false;
      this.formData = {
        lotSize: '',
        grossWeight: 0,
        barcode: '',
        symbology: null,
        cbm: 0.,
        quantity: 0,
        remark: '',
        comsumedQuantity: 0,
        id: 0,
        grandNumber: '',
        container: '',
        shipmentId: '',
        amzRefId: '',
        warehouseCode: '',
        actualCBM: 0,
        actualGrossWeight: 0,
        actualQuantity: 0,
        comment: null,
        howToDeliver: '',
        status: ''
      }
    },
    onAddClicked(data) {
      addNewSKU(this.$route.params.masterOrderId, data).then(body => {
        // this.$emit('onAddClicked', body.data);
        body.data.status = 'Open';
        this.orderDetails.push(body.data);
        this.skuVisible = false;
      });
    },
    onEditClicked(id) {
      getSKUInfo(id).then(body => {
        this.formData = body.data;
      });
      this.isEdit = true;
      this.isAdjust = false;
      this.skuVisible = true;
    },
    onEditConfirmedClicked(id) {
      updateSKUInfo(id, this.formData).then(body => {
        let index = this.orderDetails.map(o => o.id).indexOf(body.data.id);
        this.orderDetails.splice(index, 1, body.data);
        this.skuVisible = false;
      });
    },
    onDeleteClicked(id) {
      deleteSKU(id).then(body => {
        let index = this.orderDetails.map(o => o.id).indexOf(id);
        this.orderDetails.splice(index, 1);
      });
    },
    onAdjustClicked(id) {
      getSKUInfo(id).then(body => {
        this.formData = body.data;
      });
      this.isEdit = false;
      this.isAdjust = true;
      this.skuVisible = true;
    },
    onAdjustConfirmedClicked(id) {
      adjustSKUQuantity(id, this.formData).then(body => {
        let index = this.orderDetails.map(o => o.id).indexOf(body.data.id);
        this.orderDetails.splice(index, 1, body.data);
        this.skuVisible = false;
      });
    },
    onUploadClicked(id) {
      this.uploadVisible = true;
      this.uploadAction = getUploadLabelAction(id);
    },
    onDownloadClicked(id) {
      this.labelFilesVisible = true;
      this.orderDetailId = id;
      getLabelFileList(id).then(body => {
        this.labelFiles = body.data;
      });
    },
    uploadSuccessHandler(response, file, fileList) {
      // let index = this.orderDetails.map(x => x.id).indexOf(response.orderDetailId);
      let obj = this.orderDetails.find(function(x) {return x.id == response.orderDetailId});
      obj.labelFileNumbers += 1;
      this.$message({
          message: 'Upload success',
          type: 'success',
          center: true
      })
    },
    onLabelDeleteSuccess(orderDetailId) {
      let obj = this.orderDetails.find(function(x) {return x.id == orderDetailId});
      obj.labelFileNumbers -= 1;
      this.$message({
          message: 'Delete success',
          type: 'success'
      })
    },
    onCommingSoonClicked() {
        this.$message({
        message: 'Feature comming soon',
        type: 'warning'
        });
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
</style>
