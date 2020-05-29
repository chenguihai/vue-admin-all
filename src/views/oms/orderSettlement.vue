<template>
  <div class="app-container">
    <el-form :inline="true" :model="form" size="small" class="headerForm">
      <el-form-item label="申请时间">
        <el-date-picker
          @change="daterangeChange"
          clearable
          v-model="timeArray"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="申请状态">
        <el-select class="w_100" v-model="form.check_status" placeholder="请选择">
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="代付处理状态">
        <el-select class="w_100" v-model="form.status" placeholder="请选择">
          <el-option
            v-for="item in payStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input class="w_150" v-model="form.store_name" placeholder="店铺名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-input class="w_200" placeholder="订单号" v-model="form.order_sn" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearchList">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" border>
      <el-table-column prop="id" label="申请编号" min-width="100" align="center" />
      <el-table-column prop="created_at" label="申请时间" min-width="160" align="center" />
      <el-table-column prop="store_name" label="店铺" min-width="140" align="center" />

      <el-table-column prop="store_name" label="订单信息" min-width="300" align="center">
        <template slot-scope="scope">{{scope.row.order_sn}}#{{scope.row.service_name}}</template>
      </el-table-column>

      <el-table-column prop="type" label="订单金额" min-width="120" align="center">
        <template slot-scope="scope">￥{{scope.row.order_amount}}</template>
      </el-table-column>
      <el-table-column prop="type" label="结算方式" min-width="120" align="center">
        <template slot-scope="scope">{{scope.row.settle_type |settleTypeF}}</template>
      </el-table-column>

      <el-table-column label="申请审核状态" min-width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.check_status | auditList }}</span>
          <!--          拒绝原因-->
          <popover-cpn
            v-if="scope.row.check_status ===2"
            :key="scope.row.id"
            :reason="scope.row.reason"
          ></popover-cpn>
        </template>
      </el-table-column>
      <el-table-column label="授权委托书" width="120" align="center">
        <template slot-scope="scope">
          <span @click="powerAttorney(scope.row.id)" class="jump">查看授权委托书</span>
        </template>
      </el-table-column>
      <el-table-column label="代付处理状态" min-width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status | paymentStatusF }}</span>
          <!--          拒绝原因-->
          <popover-cpn
            v-if="scope.row.status ===2"
            :key="scope.row.id"
            :reason="scope.row.refuse_reason"
          ></popover-cpn>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="250" fixed="right">
        <template slot-scope="scope">
          <template v-if="scope.row.check_status === 0">
            <el-button
              size="mini"
              type="primary"
              @click="handleExamine(scope.$index, scope.row.id,1)"
            >审核通过</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleExamine(scope.$index, scope.row.id,2)"
            >审核未通过</el-button>
          </template>
          <template v-if="scope.row.check_status === 1">
            <template v-if="scope.row.status === 2">
              <el-button
                v-if="scope.row.order_stage_num !== 0"
                size="mini"
                type="primary"
                @click="showPay(scope.row.id)"
              >申请代付</el-button>
              <el-button
                v-if="scope.row.status !== 3"
                size="mini"
                type="primary"
                @click="showCommission(scope.row.id)"
              >申请订单佣金转出</el-button>
            </template>
            <el-button
              v-if="scope.row.status === 1"
              size="mini"
              type="primary"
              @click="showComfirm(scope.row.id)"
            >确认代签合同</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="form.page"
        :page-size="form.pageSize"
        :page-sizes="[15,30,50]"
        :total="total"
      ></el-pagination>
    </div>
    <!--审核不通过-->
    <refusal-reasons v-if="refusalFlag" @emitSubmit="emitRefusal" @emitClose="handleClose" />
    <!--确认代签合同-->
    <operation-hint
      title="确认代签合同"
      content="请确保您已完成代签合同，确定后不可撤销。"
      v-if="confirmFlag"
      @emitClose="handleClose"
      @emitSubmit="emitOperation"
    />
    <!--申请代付转出-->
    <pay-transfer v-if="payFlag" :bank="bankList" @close="handleClose" @submit="emitPay"></pay-transfer>
    <!--申请订单佣金转出-->
    <commission-transfer
      v-if="commissionFlag"
      :id="selectId"
      @close="handleClose"
      @submit="emitSubmit"
    ></commission-transfer>
    <!--授权委托书-->
    <examine-apply v-if="examineFlag" :id="selectId" @emitClose="handleClose"></examine-apply>
  </div>
</template>
<script>
import PopoverCpn from "@/components/PopoverCpn";
import { examineStatus, payStatusD } from "@/utils/commonData";
import {
  listItem,
  settleApply,
  commissionOut,
  contractConfirm,
  settleCheck,
  settleApplyBefore
} from "@/api/oms/orderSettle";
import RefusalReasons from "@/components/RefusalReasons";
import { clueAppendStatus } from "@/api/cms/demand";
import { getBank } from "@/api/common";
import OperationHint from "@/components/OperationHint";
import payTransfer from "./components/payTransfer";
import commissionTransfer from "./components/commissionTransfer";
import examineApply from "./components/examineApply";

export default {
  name: "orderSettlement",
  components: {
    PopoverCpn,
    RefusalReasons,
    OperationHint,
    commissionTransfer,
    payTransfer,
    examineApply
  },
  data() {
    return {
      statusList: examineStatus,
      payStatus: payStatusD,
      timeArray: [],
      total: 0,
      receiptFlag: false,
      selectId: 0,
      form: {
        page: 1,
        pageSize: 30,
        check_status: "", //	否	int	申请状态：0 待审核，1 已通过，2 未通过
        status: "", //	否	int	代付处理状态：1 待签署，2 待付款，3 已完成
        store_name: "", //	否	string	店铺名称
        order_sn: "", //	否	string	订单号
        start_time: "", //	否	string	申请时间-起始
        end_time: "" //	否	string	申请时间-结束
      },
      list: [],
      refusalFlag: false,
      confirmFlag: false,
      payFlag: false, //false
      commissionFlag: false, //false
      examineFlag: false,
      bankList: [],
    };
  },
  created() {
    this.getList();
    this.getBankList();
  },
  methods: {
    showPay(id) {
      this.selectId = id;
      this.settleApplyBeforeHttp(id);
    },
    showCommission(id) {
      this.commissionFlag = true;
      this.selectId = id;
    },
    showComfirm(id) {
      this.confirmFlag = true;
      this.selectId = id;
    },
    getBankList() {
      getBank()
        .then(res => {
          const { data = [], code } = res;
          if(code ===1){
          this.bankList = data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    powerAttorney(id) {
      this.selectId = id;
      this.examineFlag = true;
    },
    daterangeChange(val) {
      const [start = "", end = ""] = val || [];
      this.form.start_time = start;
      this.form.end_time = end;
    },
    handleExamine(index, id, type) {
      //审核通过和不通过
      this.selectId = id;
      this.selectIndex = index;
      if (type === 1) {
        this.settleCheckHttp();
      } else {
        this.refusalFlag = true;
      }
    },
    clueAppendStatusHttp(type = 1, reason = "") {
      //审核
      let params = {
        id: this.selectId, //	是	int	线索补充id
        status: type, //	是	int	审核状态： 1通过 2未通过
        reason: reason //	否	string	审核未通过原因
      };
      clueAppendStatus(params)
        .then(res => {
          if (res.code === 1) {
            if (type === 2) {
              this.handleClose();
            }
            let data = this.list[this.selectIndex];
            data.status = type;
            this.$set(this.list, this.selectIndex, data);
            this.examineFun();
          } else {
            this.examineFun(res.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    emitRefusal(reason) {
      this.settleCheckHttp(2, reason);
    },
    handleClose() {
      this.refusalFlag = false;
      this.confirmFlag = false;
      this.payFlag = false;
      this.commissionFlag = false;
      this.examineFlag = false;
    },
    handleSearchList() {
      //      //搜索查询事件
      this.form.page = 1;
      this.getList();
    },
    handleViewDetail(id) {
      //确认收款
      this.receiptFlag = true;
      this.selectId = id;
    },
    handleSizeChange(val) {
      //分页器：页大小变更
      this.form.page = 1;
      this.form.pageSize = val;
      this.getList();
    },
    handlePageChange(val) {
      //分页器：页码变更
      this.form.page = val;
      this.getList();
    },
    emitPay(param) {
      this.settleApplyHttp(param);
    },
    emitSubmit(param) {
      this.commissionOutHttp(param);
    },
    emitOperation() {
      this.contractConfirmHttp();
    },
    getList() {
      listItem(this.form)
        .then(res => {
          const { data = [], total } = res;
          this.list = data;
          this.total = total;
        })
        .catch(err => {
          console.log(err);
        });
    },
    settleApplyHttp(params) {
      settleApply({ ...params, id: this.selectId })
        .then(res => {
          if (res.code === 1) {
            this.examineFun();
            this.handleClose();
            this.getList();
          } else {
            this.examineFun(res.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    commissionOutHttp(params) {
      commissionOut(params)
        .then(res => {
          if (res.code === 1) {
            this.examineFun();
            this.handleClose();
            this.getList();
          } else {
            this.examineFun(res.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    contractConfirmHttp() {
      contractConfirm(this.selectId)
        .then(res => {
          if (res.code === 1) {
            this.examineFun();
            this.handleClose();
            this.getList();
          } else {
            this.examineFun(res.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    settleCheckHttp(status = 1, reason = "") {
      let param = {
        id: this.selectId, //	是	int	代付id
        status //	是	int	审核状态：1通过，2未通过
        // reason: '',//	否	string	未通过原因
      };
      if (reason) {
        param.reason = reason;
      }
      settleCheck(param)
        .then(res => {
          if (res.code === 1) {
            this.examineFun();
            this.handleClose();
            this.getList();
          } else {
            this.examineFun(res.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    settleApplyBeforeHttp(id) {
      settleApplyBefore(id)
        .then(res => {
          if (res.code === 1) {
            this.payFlag = true;
          } else {
            this.examineFun(res.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    examineFun(message = "") {
      if (message) {
        this.$message.error(message);
      } else {
        this.$message.success("操作成功");
      }
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../styles/mixin.scss";
.jump {
  color: #409eff;
  display: block;
  cursor: pointer;
}
</style>
