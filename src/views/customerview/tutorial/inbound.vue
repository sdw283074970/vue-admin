<template>
  <div>
    <h1 style="margin:30px">入库教程 Inbound Tutorial</h1>
    <div>
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item title="简介 Introduction">
          <div>这篇教程主要讲述如何使用登记入库相关功能。</div>
          <div>重要性：入库是仓库流程的第一部分，也是所有操作的基础。无法跳过本部分进行其他操作。</div>
        </el-collapse-item>
        <el-collapse-item title="名词解释 Glossary">
          <div>入库单：是入库模块中的最大记录单位。一张入库单包含一张WO（工单），且与集装箱/批次货物一一对应。一张入库单仅记录与该集装箱/批次的相关信息，多条柜子/批次货物需要建立多张入库单。</div>
          <div>入库单状态：即入库单当前的状态。</div>
          <div>WO：即工单，指下达给仓库的工作订单。包括预报到货的入库基本信息、装箱单、操作指令等部分。</div>
          <div>WO步骤：即工单步骤，反应了该入库单在仓库的操作进展。与入库单状态存在对应关系（详见入库单状态解释）。</div>
          <div>WO中的入库基本信息：等于入库单中填写的基本信息。</div>
          <div>WO中的装箱单：即客户预报到货的货物清单。</div>
          <div>WO中的操作指令：即客户对仓库下达的该如何操作的详细指令。</div>
          <div>WO中的库存：即当前入库单中的货物库存实时统计，只有在该入库单状态为“Allocated”后才能查看。</div>
          <div>Inventory中的Ctns View：即以纸箱为单位查看SKU信息。</div>
          <div>Inventory中的Plts View：即以托盘为单位查看SKU信息。其中每种托盘都可以展开以便客户可以查看托盘中的纸箱/SKU信息。</div>
        </el-collapse-item>
        <el-collapse-item title="入库单状态解释 Status">
          <div>New Created：表明入库单由客户/操作员建立完毕，基本信息填写完毕，等待上传装箱单和下达指令。对应工单第1步和第2步。</div>
          <div>Draft：表明客户/操作员已上传装箱单且操作指令已下达，正在等待审核。对应工单第3步。</div>
          <div>Incoming：表明该入库单已通过审核，正在等待货物到达仓库。对应工单第4步。</div>
          <div>Arrived：表明该入库单中的货物已抵达仓库，正在等待仓库排期卸货。对应工单第5步骤。</div>
          <div>Processing：表明仓库正在处理该入库单中的货物，包括卸货清点和完成客户下达的指令。对应工单第6步。</div>
          <div>Received：表明该入库单中的货物已完成卸货，正在等待仓库将托盘信息反馈到系统。对应工单第7步。</div>
          <div>Registered：表明该入库单中的货物已详细注册到了系统中，正在等待仓库分配库位。对应工单第8步。</div>
          <div>Allocated：表明该入库单中的货物已被分配了库位，现在客户可以从该入库单中拣货并随时查看库存剩余情况。</div>
        </el-collapse-item>
        <el-collapse-item title="入库单管理页面功能 Function">
          <div>New Inbound Order：点击即可打开新建入库单表单。完成填写后点击最下方的“Create”按钮建立新的入库单。</div>
          <div>搜索栏：等于关键字过滤器。</div>
          <div>入库单表中的箭头：点击可以展开查看该入库单的更多信息。</div>
          <div>Edit：点击即可打开对应入库单的详细信息表单。可以修改任何系统允许修改的信息。该按钮在入库单提交给仓库后不可用。</div>
          <div>WO：点击即可进入该入库单下的工单页面。</div>
          <div>Delete：暂时不可用。如需要删除入库单，请联系仓库办公室工作人员。</div>
        </el-collapse-item>
        <el-collapse-item title="工单页面功能 Function">
          <div>Back：点击返回上一层页面。</div>
          <div>Download WO：点击即可下载该入库单的WO（Excel文件）。该功能只有在第3步之后才可用。</div>
          <div>Download Receipt：点击即可下载该入库单的收据（收货报告）。该功能只有在第8步后才可用。</div>
          <div>New SKU：点击即可打开新建SKU表单对话框，即手动一条条录入装箱单中内容或做补充。</div>
          <div>Upload Packing List File：点击打开批量上传装箱单页面，拖拽即可完成上传。必须遵从系统模板。</div>
          <div>Download Packing  List Template：点击即可下载系统可以识别的Packing List模板。批量Pakcing List应遵守模板中的格式，否则上传会失败。</div>
          <div>New Instruction：点击添加操作指令，中英文皆可。</div>
          <div>Submit：点击将此装箱单标记为“Draft”状态，即提交由仓库办公室审核。审核中的入库单不可做任何修改。</div>
          <div>Call Back：点击召回此入库单。仅能召回等待仓库办公室审核的入库单，即“Draft”状态的入库单。</div>
          <div>View Inventory：点击打开库存查看页面（对话框）。仅在入库单状态为“Allocated”时才能看到内容。</div>
        </el-collapse-item>
        <el-collapse-item title="装箱单表中可选操作 Packing List Operations">
          <div>Adjust：不向客户端开放。</div>
          <div>Edit SKU Info：点击打开SKU修改表单对话框，逐条修改SKU信息。提交入库单后该按钮不可用。</div>
          <div>Upload Label Files：点击打开文件上传对话框，即为当前行的SKU上传贴标文件。</div>
          <div>Download Label Files：点击打开线上Label文件管理对话框，可对已上传的Label文件进行基本管理（下载或删除）。</div>
          <div>Delete：点击删除当前行的SKU信息。提交入库单后按钮不可用。</div>
        </el-collapse-item>
        <el-collapse-item title="操作指令表中可选操作 Instruction List Operations">
          <div>Edit：点击即可编辑当前行的操作指令。提交入库单后该按钮不可用。</div>
          <div>Delete：点击删除当前行的操作指令。提交入库单后按钮不可用。</div>
        </el-collapse-item>
        <el-collapse-item title="库存页面功能 Function">
          <div>Ctns View中的History：点击即可查看该SKU的历史出库记录。</div>
          <div>Plts View中的History：点击即可查看该种托盘的历史出库记录。</div>
          <div>Plts View中托盘列表中的箭头：点击即可展开托盘，查看选定托盘中的SKU即其箱数。</div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeNames: ['1']
    }
  },
  methods: {
    handleChange(val) {
      console.log(val)
    }
  }
}
</script>

<style lang="scss" scoped>
    .el-collapse-item {
        margin: 30px;
    }
</style>
