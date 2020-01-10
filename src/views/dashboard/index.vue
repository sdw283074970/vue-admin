<template>
  <div class="dashboard-container">
    <div class="dashboard-text">更新日志 Update Log</div>
    <el-collapse style="margin-top:20px">
      <el-collapse-item title="Update on Jan 9, 2020">
        <div>- 移植了下载收货报告/收据功能</div>
        <div>- 移植了收货模块中的下载Excel工单功能</div>
        <div>- 移植了发货模块中的下载Excel工单和BOL功能</div>
        <div>- 制作了客户端入库教程说明</div>
      </el-collapse-item>
      <el-collapse-item title="Update on Jan 8, 2020">
        <div>- 修复了收货单中无法正常删除指令的BUG</div>
        <div>- 移植了办公室端收货模块的推送/召回订单功能</div>
        <div>- 新增了办公室端/客户端收货模块中下载Excel模板的功能</div>
        <div>- 移植了办公室端/客户端收货模块中上传Excel模板的功能</div>
      </el-collapse-item>
      <el-collapse-item title="Update on Jan 7, 2020">
        <div>- 将dashboard改造成了更新日志页面</div>
        <div>- 移植了收货页面中的按箱查看箱数出库历史功能</div>
        <div>- 移植了收货页面中的按托盘查看托盘数量出库历史功能</div>
        <div>- 新增了库存查询页面中的按托盘查看托盘数量出库历史功能</div>
        <div>- 新增了在库存查询页面/收货页面中的托盘视图下，展开托盘按托盘中的SKU查看箱数出库历史的功能</div>
      </el-collapse-item>
      <el-collapse-item title="Update on Jan 6, 2020">
        <div>- 移植了办公室端收货模块中的添加/编辑/调整订单指令功能</div>
        <div>- 调整了订单指令功能，现在可以在添加和编辑指令时定义其的指令属性（是否是需要发给仓库的指令）</div>
      </el-collapse-item>
      <el-collapse-item title="Update on Jan 3, 2020">
        <div>- 移植了Efiles相关功能并在使用方式上做了微调</div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
/* eslint-disable */
import { getDashboard } from '@/api/dashboard'
import { deflateRaw } from 'zlib'

export default {
  name: 'Dashboard',
  data: function() {
    return {
      v: 'Welcome!'
    }
  },
  methods: {
    btnClick: function(){
      $("#input-test").val('success!')
    }
  },
  mounted() {
    getDashboard().then(body => {
      // alert(JSON.stringify(body.data))
    })
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
