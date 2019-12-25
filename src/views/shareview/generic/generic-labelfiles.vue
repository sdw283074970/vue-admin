<template>
  <div>
    <el-table
      ref="label-files-table"
      :data="labelFiles"
      stripe
      border
      style="width: 100%"
    >
      <el-table-column
        prop="originalName"
        label="Original Name"
      />
      <el-table-column
        prop="nameInSystem"
        label="Name In System"
        width="350"
      />
      <el-table-column
        prop="uploadDate"
        label="Update Date"
        width="110"
      >
        <template
          slot-scope="scope"
        >
          <font>{{ transferDate(scope.row.uploadDate) }}</font>
        </template>
      </el-table-column>
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
              <el-dropdown-item @click.native="onDeleteClicked(scope.row.nameInSystem)">Delete</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
/* eslint-disable */
import { deleteLabelFile, downloadFile } from '@/api/receiving'

export default {
  props: {
    orderDetailId: Number,
    labelFiles: Array
  },
  methods:{
    onDownloadClicked(rootPath) {
        // this.$router.push({path: '/api/downloadfile/?fullPath=' + rootPath});
        downloadFile(rootPath, 'Label')
    },
    onDeleteClicked(nameInSystem) {
        deleteLabelFile(this.orderDetailId, nameInSystem).then(body => {
            let index = this.labelFiles.map(x => x.nameInSystem).indexOf(nameInSystem);
            this.labelFiles.splice(index, 1);
            this.$emit('onLabelDeleteSuccess', this.orderDetailId);
        });
    },
    transferDate: function(date){
        return date.substring(0,10);
    },
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
