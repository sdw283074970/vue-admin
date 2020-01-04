<template>
  <div>
    <h2>Picking List</h2>
    <el-button class="gb-button" :disabled="shipOrder.status != 'New Created'&&shipOrder.status != 'Picking'" type="primary" @click="pltsTableVisible = true">Pick Plts</el-button>
    <el-button class="gb-button" :disabled="shipOrder.status != 'New Created'&&shipOrder.status != 'Picking'" type="primary" @click="ctnsTableVisible = true">Pick Ctns</el-button>
    <el-input
      v-model="search"
      style="width:250px"
      size="large"
      placeholder="Search..."
      disabled=""
    />
    <el-table
      ref="table"
      :data="pickDetails"
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
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            ref="pick-table-plts-ctns"
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
              width="200"
            />
            <el-table-column
              sortable
              prop="amzRefId"
              label="Amz Ref Id"
              width="200"
            />
            <el-table-column
              prop="warehouseCode"
              label="Whse Code"
              width="100"
            />
            <el-table-column
              prop="grossWeightPerCtn"
              label="GW/Ctn"
              width="100"
            />
            <el-table-column
              prop="cbmPerCtn"
              label="CBM/Ctn"
              width="100"
            />
            <el-table-column
              prop="actualQuantity"
              label="Org Ctns"
              width="100"
            />
            <el-table-column
              prop="availableCtns"
              label="Ava Ctns"
              width="100"
            />
            <el-table-column
              prop="pickingCtns"
              label="Picking Ctns"
              width="120"
            />
            <el-table-column
              prop="labelFileNumbers"
              label="Label Files"
              width="120"
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
                    <el-dropdown-item @click.native="onUploadClicked(scope.row.fbaPickDetailCartonId)">Upload Label Files</el-dropdown-item>
                    <el-dropdown-item @click.native="onDownloadClicked(scope.row.fbaPickDetailCartonId)">Download Label Files</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        prop="container"
        label="Container #"
        sortable=""
        width="200"
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
        prop="pickableCtns"
        label="Pickable Ctns"
        width="120"
      />
      <el-table-column
        prop="actualQuantity"
        label="Pick Ctns"
        width="100"
      />
      <el-table-column
        prop="pltsFromInventory"
        label="Pick Plts"
        width="100"
      />
      <el-table-column
        prop="newPlts"
        label="Built Plts"
        width="100"
      />
      <el-table-column
        prop="actualPlts"
        label="Ttl Plts"
        width="100"
      />
      <el-table-column
        prop="location"
        label="Location"
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
              <el-dropdown-item disabled>Adjust</el-dropdown-item>
              <el-dropdown-item :disabled="step>1" @click.native="putbackHandler(scope.row.id)">Put back</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="Inventory(Pallets View)"
      :visible.sync="pltsTableVisible"
      width="85%"
      top="5vh"
      :lock-scroll="false"
    >
      <picking-plts @referashPickDetails="referashPickDetails" />
    </el-dialog>
    <el-dialog
      title="Inventory(Cartons View)"
      :visible.sync="ctnsTableVisible"
      width="85%"
      top="5vh"
      :lock-scroll="false"
    >
      <picking-ctns />
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
        :fba-pick-detail-carton-id="fbaPickDetailCartonId"
        @onLabelDeleteSuccess="onLabelDeleteSuccess"
      />
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { getSO, putbackPickDetail, getUploadLabelAction, getLabelFileList, downloadFile, getOrderDetailId } from '@/api/shipping'
// import {  } from '@/api/receiving'

export default {
  props: {
    shipOrder: {},
    pickDetails: Array,
    step: 0,
  },
  watch: {
    step: function(val){
      if (val > 1)
        this.pickVisible = false;
      
      if (val > 3)
        this.operationVisible = false;
    }
  },
  components:{
    "picking-plts": () => import('@/views/customerview/outbound/outbound-wo-picking-plts'),
    "picking-ctns": () => import('@/views/customerview/outbound/outbound-wo-picking-ctns'),
    "generic-labelfiles": () => import('@/views/shareview/generic/generic-labelfiles')
  },
  data() {
      return {
          pickVisible: true,
          operationVisible: true,
          search: '',
          filteredData : [],
          totalEntries: 0,
          currentPage: 1,
          pageSize: 20,
          pltsTableVisible : false,
          ctnsTableVisible : false,
          formLabelWidth : '200px',
          customerCodeFilter : [],
          uploadVisible: false,
          labelFilesVisible: false,
          uploadAction: '',
          labelFiles: [],
          orderDetailId: 0,
          cartonId: 0,
          fbaPickDetailCartonId: 0
      };
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
    putbackHandler(id){
      putbackPickDetail(id).then(() => {
          let index = this.pickDetails.map(o => o.id).indexOf(id)
          this.pickDetails.splice(index, 1);
          this.$message({
            message: 'Put back success',
            type: 'success'
          });
        }
      )
    },
    onUploadClicked(id) {
      this.uploadVisible = true;
      this.fbaPickDetailCartonId = id;
      this.uploadAction = getUploadLabelAction(id);
    },
    onDownloadClicked(id) {
      this.labelFilesVisible = true;
      this.fbaPickDetailCartonId = id;

      getLabelFileList(id).then(body => {
        this.labelFiles = body.data;
      }).catch(e => {
        alert(JSON.stringify(e))
      });
    },
    uploadSuccessHandler(response, file, fileList) {
      let obj = {}
      let that = this
      this.pickDetails.forEach(function(x){
        obj = x.fbaCartonLocations.find(function (c) {
          return (c.fbaPickDetailCartonId === that.fbaPickDetailCartonId)
        })
      })

      obj.labelFileNumbers += 1;
      this.$message({
          message: 'Upload success',
          type: 'success',
          center: true
      })
    },
    onLabelDeleteSuccess() {
      let obj = {}
      let that = this
      this.pickDetails.forEach(function(x){
        obj = x.fbaCartonLocations.find(function (c) {
          return (c.fbaPickDetailCartonId === that.fbaPickDetailCartonId)
        })
      })

      obj.labelFileNumbers -= 1;
      this.$message({
          message: 'Delete success',
          type: 'success'
      })
    },
    referashPickDetails(){
      this.$emit('referashPickDetails');
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
