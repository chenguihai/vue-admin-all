<template>
  <div class="app-container">
    <el-card class="box_card">
      <div slot="header">
        <span>订单基本信息</span>
      </div>
      <ul class="base_info">
        <!--//状态:1待托管,2待接单,3待签署,4工作中,5待验收,6待评价,7已成交,8已冻结,9未成交-->
        <li>订单状态：<span>{{baseInfo.status | serviceStatus}}</span></li>
        <li>订单金额：<span>￥{{baseInfo.amount}}</span></li>
        <li>订单编号：<span>{{baseInfo.order_sn}}</span></li>
        <li>下单时间： <span>{{baseInfo.created_at}}</span></li>
        <li>下单用户： <span>{{baseInfo.pay_user && baseInfo.pay_user.nickname}}</span></li>
        <li>下单店铺： <span>{{baseInfo.pay_store &&baseInfo.pay_store.store_name}}</span></li>
      </ul>
    </el-card>
    <!--订单服务信息-->
    <el-card class="box_card">
      <div slot="header">
        <span>订单服务信息</span>
      </div>
      <el-table :data="serviceInfo" border>
        <el-table-column prop="service_id" label="服务编号" min-width="80" align="center"/>
        <el-table-column label="服务图" min-width="130" align="center">
          <template slot-scope="scope">
            <preview-pictures :key="scope.row.service_id" :href="scope.row.service_img"/>
          </template>
        </el-table-column>
        <el-table-column prop="service_name" label="服务名称" min-width="120" align="center"/>
        <el-table-column prop="cate_name" label="服务分类" min-width="150" align="center"/>
        <el-table-column prop="service_spec" label="服务规格" min-width="160" align="center"/>
        <el-table-column prop="service_price" label="服务单价" min-width="100" align="center"/>
        <el-table-column prop="service_num" label="数量" min-width="80" align="center"/>
        <el-table-column prop="service_amount" label="总金额" min-width="100" align="center"/>
      </el-table>
    </el-card>
    <!--订单支付信息-->
    <el-card class="box_card">
      <div slot="header">
        <span>订单支付信息</span>
      </div>
      <div v-if="payInfo.length > 0">
        <el-table :data="payInfo" border>
          <!--线下银行转账支付-->
          <template v-if="payInfo[0].pay_type ===3">
            <el-table-column label="支付时间" min-width="100" align="center">
              <template slot-scope="scope">
                {{scope.row.pay_at |splitSpaceF}}
              </template>
            </el-table-column>
            <el-table-column label="支付方式" min-width="100" align="center">
              <template slot-scope="scope">{{scope.row.pay_type | paymentMethod}}</template>
            </el-table-column>
            <el-table-column label="到账时间" min-width="100" align="center">
              <template slot-scope="scope">
                {{scope.row.receive_at |splitSpaceF}}
              </template>
            </el-table-column>
            <el-table-column prop="pay_amount" label="汇款金额" min-width="100" align="center"/>

            <el-table-column prop="receive_bank" label="收款银行" min-width="100" align="center"/>
            <el-table-column prop="pay_company" label="付款单位" min-width="100" align="center"/>
            <el-table-column label="汇款凭证" min-width="130" align="center">
              <template slot-scope="scope">
                <preview-pictures :key="scope.row.proof_img" :href="scope.row.proof_img"/>
              </template>
            </el-table-column>
          </template>
          <!--线上支付显示-->
          <template v-else>
            <el-table-column prop="pay_at" label="支付时间" min-width="100" align="center"/>
            <el-table-column label="支付方式" min-width="100" align="center">
              <template slot-scope="scope">{{scope.row.pay_type | paymentMethod}}</template>
            </el-table-column>
            <el-table-column prop="pay_amount" label="支付金额" min-width="100" align="center">
              <template slot-scope="scope">{{scope.row.pay_amount}}</template>
            </el-table-column>
            <el-table-column prop="out_trade_no" label="支付流水号" min-width="100" align="center"/>
          </template>
        </el-table>
      </div>
      <div v-else>订单还未支付。</div>
    </el-card>
    <!--订单合同项目阶段-->
    <el-card class="box_card">
      <div slot="header">
        <span>订单合同项目阶段</span>
        <div class="card_right" v-if="stageData.length > 0">
          需求金额￥{{stageData[0].money}} 工期 {{stageData[0].begin_time|splitSpaceF}}至{{stageData[0].end_time|splitSpaceF}}
          共{{stageData[0].day}}天
        </div>
      </div>
      <el-table :data="stageData" border>
        <el-table-column prop="name" label="项目阶段名称" min-width="100" align="center"/>
        <el-table-column prop="stage" label="具体内容及交付成果" min-width="100" align="center"/>
        <el-table-column prop="moneys" label="付款金额" min-width="100" align="center"/>
        <el-table-column prop="days" label="所需工时" min-width="80" align="center"/>
        <el-table-column label="是否付款" min-width="100" align="center">
          <template slot-scope="scope">{{scope.row.status | isArranged}}</template>
        </el-table-column>
        <el-table-column label="付款时间" min-width="140" align="center">
          <template slot-scope="scope"><span>{{scope.row.pay_time}}</span></template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--订单详细操作明细-->
    <el-card class="box_card">
      <div slot="header">
        <span>订单详细操作明细</span>
      </div>
      <el-table :data="optLog" border>
        <el-table-column prop="created_at" label="操作时间" min-width="150" align="center"/>
        <el-table-column label="操作内容" min-width="250" align="center">
          <template slot-scope="scope"><span v-html="scope.row.operate"></span></template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import {detailItem} from '@/api/oms/service';
  import {formatTimeStamp} from '@/utils/date';

  export default {
    name: "serviceDetail",
    data() {
      return {
        tableData: [],
        baseInfo: {},
        serviceInfo: [],
        payInfo: [],
        stageData: [],
        optLog: [],
      }
    },
    created() {
      const {id = 0} = this.$route.query;
      this.getDetail(id);
    },
    methods: {
      getDetail(id) { //初始化列表数据
        detailItem(id).then(res => {
          const {base_info = {}, service_info = {}, pay_info = {}, stage = [], opt_log = []} = res;
          this.baseInfo = base_info;
          this.serviceInfo = [service_info];
          this.payInfo = typeof pay_info === 'object' ? [pay_info] : [];
          this.stageData = stage;
          this.optLog = opt_log;
        }).catch(err => {
          console.log(err)
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  .box_card {
    width: 100%;

    &:not(:last-child) {
      margin-bottom: 20px;
    }
  }

  .base_info {
    font-size: 14px;

    > li {
      line-height: 24px;
    }
  }

  .card_right {
    float: right;
    padding-right: 20px;
  }
</style>
