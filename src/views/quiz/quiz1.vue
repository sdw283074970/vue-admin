<template>
  <div class="dashboard-editor-container">
    <div class="chart-wrapper">
      <h2>Step 1 客户预报收货</h2>
      <p>代码为QUIZ的客户发来预报单，预计在2020年4月30日有一条货柜到我们仓库。这条货柜为40尺普柜，共有10种SKU共200箱（每一种SKU20箱），将分开放在20个托盘中运达，一个托盘中只有一种SKU。</p>
      <p>按照之前的约定，这批货物性质为普通转发，发货指令会在接下来的几个月中分批次另行通知。一旦货柜抵达，需要尽快按照指令将这些货按已有指令操作入库。</p>
      <p>客户卸货操作指令为：</p>
      <p>1. 将20个托盘合并成10个托盘入库，每一个托盘上只能放1种SKU,多出来的10个托盘直接丢弃</p>
      <p>2. 移除所有箱子上的标签</p>
      <p>3. 已知200箱中有一小部分使用的纸箱跟与其他纸箱不同，报告这些有差异纸箱的具体数量</p>
      <p>4. 回报开柜照片。如果有破损的货物，回报破损细节照片</p>
      <p>5. 回报入库情况</p>
      <p>货柜 Packing List 在群里下载。</p>
      <!-- <p>货柜 Packing List <el-button size="mini">点此下载</el-button></p> -->
      <p>根据以上信息，建立Container号为QUIZ-1-INBOUND-[your name]的出货单。</p>
    </div>
    <div class="chart-wrapper">
      <h2>Step 2 客户货柜抵达</h2>
      <p>货柜按照计划在4月30日下午两点抵达仓库。但由于Dock爆满，到货当天没有能执行卸货。货柜临时放置在院子里。</p>
    </div>
    <div class="chart-wrapper">
      <h2>Step 3 执行客户指令</h2>
      <p>仓库开始预解读这条柜子的收货工作单。</p>
      <p>仓库不明白什么叫“有差异的纸箱”，向办公室发出询问。其他指令都确认能理解。</p>
      <p>仓库收到办公室回复，“有差异的纸箱”为Size稍大一些的纸箱。</p>
      <p>5月1日上午，仓库开始执行卸货程序。</p>
      <p>仓库在收货的过程中，发现SKU#0010少了一箱，但多了一箱不在Pakcing List中的SKU。该SKU号码为SKU#0011。仓库不知如何对这箱打托，向办公室发出问询。</p>
      <p>办公室回复，与SKU#0010打成一托。</p>
      <p>仓库完成了所有客户指令。</p>
      <p>当新托盘合托完毕，仓库也在系统中登记了打托信息。</p>
      <p>仓库开始分配库位，并在系统中记录了库位的位置。SKU#0001~0005在A5区，SKU#0006~0011在E2区。</p>
      <p>仓库在系统中将这单标记为已分配。</p>
    </div>
    <div class="chart-wrapper">
      <h2>Step 4 客户预报发货</h2>
      <p>5月10日，客户发来指令。指令如下：</p>
      <p>1. 在库存中拣20箱SKU#0001，19箱SKU#0010，1箱SKU#0011</p>
      <p>2. 将以上40箱分别打新打4托，每托5箱SKU#0001，5箱SKU#0010，少一箱SKU#0010用SKU#0011d代替</p>
      <p>3. 为每一托贴上标签（标签文件本次QUIZ省略）</p>
      <p>4. 客户自己订车，12日下午4点会有从其他仓库过来的卡车来pick up这4托</p>
      <p>5. Carrier名称为Quiz Carry</p>
      <p>6. 收货地址为 11110 Quiz Road, Quiz City, QC 12345，与前来的司机核对该地址是否正确</p>
      <p>根据以上信息，建立Shipping Number为QUIZ-1-OUTBOUND-[your name]的出货单。</p>
    </div>
    <div class="chart-wrapper">
      <h2>Step 5 按照指令备货</h2>
      <p>5月11日仓库开始解读这张发货单。</p>
      <p>仓库解读完毕，无任何疑问。</p>
      <p>仓库下载Picking List开始拣货，并将拣出的货按照指令操作完毕，对方在备货区BKA1。</p>
      <p>仓库拣货完毕，在系统中调整实际拣出托盘数量、实际新打托盘数量和实际总出货数量。</p>
      <p>仓库下载BOL，打印，等待货车前来Pick up，并在系统中更新出货单状态。</p>
    </div>
    <div class="chart-wrapper">
      <h2>Step 6 货车前来提货</h2>
      <p>5月12日下午四点，货车按时前来。仓库负责人与司机确认无误后，交换签字，并将纸质BOL返回到办公室。</p>
    </div>
    <div class="chart-wrapper">
      <h2>Step 7 核对操作细节</h2>
      <p>根据返回的BOL，办公室（OP）核对出货备货情况，并检查实际托盘数量。</p>
      <p>办公室确认无误，根据BOL上的信息，在系统中更新状态。</p>
    </div>
    <div class="chart-wrapper">
      <h2>Step 8 登记收费项目</h2>
      <p>按照合同，我们应对入库单和出库单的操作都进行收费。</p>
      <p>但经过协商，最终我们收以下费用：</p>
      <p>1. 卸货费300刀</p>
      <p>2. (入库)操作费100刀</p>
      <p>3. 拣货费1刀/箱，共20刀(更正共40刀)</p>
      <p>4. 新托盘费用5刀/托，共20刀</p>
      <p>5. 出库操作费200刀</p>
      <p>在客户的服务模板中新增以上服务，并保存上费率到模板中。</p>
      <p>分别在入库单和出库单添加以上收费。</p>
    </div>
    <div class="chart-wrapper">
      <h2>Step 9 生成操作账单</h2>
      <p>分别出具入库和出库的账单。</p>
    </div>
    <div class="chart-wrapper">
      <h2>Step 10 补充发生成本</h2>
      <p>在入库单中添加人工成本150刀。</p>
      <p>在出库单中添加人工成本100刀。</p>
    </div>
    <div class="chart-wrapper">
      <h2>Step 11 关闭账单</h2>
      <p>将入库单和出库单的账单状态设为关闭。表示这两单已结算。</p>
    </div>
    <div class="chart-wrapper">
      <h2>Step 12 生成仓储账单</h2>
      <p>客人要求我们出具5月1日到5月15日的仓储费用。</p>
      <p>按照合作，QUZI客户的仓储费用为首周免费，第二周8刀/托盘，第三周及以后10刀/托盘。</p>
      <p>按照以上，在客户的仓储计费模板中建立收费模板，模板名称为QUIZ-[your name]。</p>
      <p>使用刚创建的收费模板，对客人收仓储费。</p>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
    .input-bar{
      text-align: right
    }
</style>
