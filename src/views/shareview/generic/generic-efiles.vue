<template>
  <div style="text-align:center">
    <el-upload
      class="upload-demo"
      drag
      :on-success="onUploadSuccess"
      :action="uploadAction"
      :multiple="false"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">Drag file here or <em>Click</em> to upload</div>
      <div slot="tip" class="el-upload__tip">Only accept zip /rar /pdf format files which less than 1 MB</div>
      <div slot="tip" class="el-upload__tip">One file per time</div>
    </el-upload>
    <el-table
      ref="label-files-table"
      :data="efiles"
      stripe
      border
      height="500"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="Id"
        width="60"
      />
      <el-table-column
        prop="customizedFileName"
        label="File Name"
        width="100"
      />
      <el-table-column
        prop="fileName"
        label="File Name in System"
      />
      <el-table-column
        prop="uploadDate"
        label="Upload Date"
        width="110"
      >
        <template
          slot-scope="scope"
        >
          <font>{{ transferDate(scope.row.uploadDate) }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="Status"
        width="110"
        align="center"
      />
      <el-table-column
        prop="operation"
        label="operation"
        width="110"
      >
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              Operations<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="onDownloadClicked(scope.row.rootPath)">Download</el-dropdown-item>
              <el-dropdown-item :disabled="scope.row.status!=='Valid'" @click.native="onDiscardClicked(scope.row.id)">Discard</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
/* eslint-disable */
import config from '@/scripts/global'
import { downloadFile, deleteLabelFile as deleteReceivingLabelFile, discardFile, downloadEfile } from '@/api/receiving'
import { deleteLabelFile as deleteShippingLabelFile } from '@/api/shipping'

const baseURL = config.baseURL

export default {
  props: {
    reference: String,
    orderType: String,
    efiles: Array
  },
  computed: {
      uploadAction: function() {
          return baseURL + 'api/fba/FBAEfolder/?reference=' + this.reference + '&orderType=' + this.orderType + '&fileName=File&version=V1'
      }
  },
  methods:{
    onDownloadClicked(id) {
        downloadEfile(id)
    },
    onDiscardClicked(id) {
        discardFile(id).then(() => {
            this.efiles.find(x => x.id === id).status = 'Invalid'
            this.$message({
            message: 'Discard Success',
            type: 'success'
            });
        })
    },
    onUploadSuccess(response, file, fileList) {
        // alert('success!')
        // alert(JSON.stringify(response))
        this.efiles.push({
            id: response.id,
            customizedFileName: response.customizedFileName,
            fileName: response.fileName,
            uploadDate: response.uploadDate,
            status: 'Valid',
            rootPath: '',
            discardBy: '',
            uploadBy: ''
        });
        // alert(JSON.stringify(this.efiles))
    },
    transferDate: function(date){
        return date.substring(0,10);
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
