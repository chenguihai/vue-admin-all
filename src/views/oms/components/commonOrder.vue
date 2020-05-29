<template>
  <div>
    <el-form :inline="true" :model="form" size="small" class="headerForm">
      <el-form-item label="订单状态">
        <el-select class="w_100" v-model="form.status" placeholder="请选择" clearable>
          <el-option
            v-for="item in orderStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="下单时间">
        <el-date-picker
          v-model="timeArray"
          type="daterange"
          range-separator="-"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-input class="w_150" placeholder="店铺名称" v-model="form.store_name" clearable />
      </el-form-item>
      <el-form-item>
        <el-input
          class="w_150"
          :placeholder="selectType === '1'?'案例名称':'传记名称'"
          v-model="form.name"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-input class="w_200" placeholder="订单号" v-model="form.order_sn" clearable />
      </el-form-item>
      <el-form-item>
        <el-input class="w_200" placeholder="付款单位" v-model="form.pay_company" clearable />
      </el-form-item>
      <el-form-item>
        <el-select class="w_160" v-model="form.receive_bank" placeholder="收款银行" clearable>
          <el-option v-for="(item,index) in bankList" :key="index" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearchList">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" border>
      <el-table-column prop="order_sn" label="订单编号" width="110" align="center" />
      <el-table-column prop="created_at" label="下单时间" width="100" align="center" />
      <el-table-column prop="nick_name" label="雇主昵称" width="100" align="center" />
      <el-table-column prop="store_name" label="店铺" width="130" align="center" />
      <el-table-column :label="selectType === '1'?'案例名称':'传记名称'" min-width="250" align="center">
        <template slot-scope="scope">
          <div class="thumbnail_box link" v-for="item in scope.row.case_biog_goods" :key="item.order_id">
            <div class="box_left">
              <preview-pictures :key="scope.row.id" :href="item.img" />
            </div>
            <div class="box_right">
              <h1>{{item.name}}</h1>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="订单金额" width="120" align="center">
        <template slot-scope="scope">￥{{scope.row.amount}}</template>
      </el-table-column>
      <el-table-column label="订单状态" width="100" align="center">
        <template slot-scope="scope">
          {{scope.row.status | payStatusF}}
          <!--拒绝原因-->
          <popover-cpn v-if="scope.row.status ===2" :key="scope.row.id" :reason="scope.row.reason"></popover-cpn>
        </template>
      </el-table-column>
      <el-table-column label="支付方式" width="80" align="center">
        <template slot-scope="scope">{{scope.row.pay_id | paymentMethod}}</template>
      </el-table-column>
      <el-table-column prop="pay_time" label="支付时间" width="100" align="center" />
      <el-table-column prop="out_trade_no" label="支付流水号" width="140" align="center"></el-table-column>
      <el-table-column prop="pay_company" label="付款单位" width="160" align="center"></el-table-column>
      <el-table-column prop="receive_bank" label="收款银行" width="130" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" width="160" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.status===0 && scope.row.pay_id === 3">
            <el-button type="primary" size="mini" @click="handleViewDetail(scope.row)">确认收款</el-button>
          </div>
          <div v-if="scope.row.proof_id > 0">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)">修改收款</el-button>
          </div>
          <!--
          <el-button v-if="scope.row.status===2" @click="handleDelete(scope.row.id)" type="danger" size="mini">
            删除</el-button>
          -->
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="sizeChange"
        @current-change="pageChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="form.page"
        :page-size="form.pageSize"
        :page-sizes="[10,30,50]"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 确认收款-->
    <confirm-receipt
      v-if="receiptFlag"
      :price="selectPrice"
      @emitClose="handleClose"
      @emitSubmit="receiptSubmit"
    />
    <edit-collection
      v-if="editFlag"
      :proof="proofId"
      @emitClose="handleClose"
      @emitSubmit="receiptSubmit"
    />
  </div>
</template>
<script>
import { formatSearchTime, formatTimeStamp } from "@/utils/date";
import { orderStatusList, BankList } from "@/utils/commonData";
import ConfirmReceipt from "@/components/ConfirmReceipt";
import EditCollection from "@/components/EditCollection";
import { listItem, confirmItem, deleteItem } from "@/api/oms/case";
import PopoverCpn from "@/components/PopoverCpn";
export default {
  name: "commonOrder",
  components: { ConfirmReceipt, PopoverCpn, EditCollection },
  props: {
    type: String,
    default: "1"
  },
  data() {
    return {
      bankList: BankList,
      orderStatus: orderStatusList,
      timeArray: [],
      selectId: 0,
      selectType: this.type, //	是	int	1案例，2传记
      form: {
        page: 1,
        pageSize: 10,
        status: "", //	否	int	订单状态：0 待付款 1 已成交，2 未成交
        name: "", //	否	string	案例传记名称
        store_name: "", //	否	string	店铺名称
        start_time: "", //	否	string	下单时间-起始
        end_time: "", //	否	string	下单时间-结束
        order_sn: "", //	否	string	订单号
        pay_company: "", //	否	string	付款单位
        receive_bank: "", //	否	string	收款银行:
        pay_company: "", //	否	string	付款单位
        receive_bank: "" //	否	string	收款银行:
      },
      total: 0,
      list: [],
      receiptFlag: false, // false
      editFlag: false, // false
      selectPrice: 0,
      proofId: ""
    };
  },
  created() {
    this.getAllList();
  },
  methods: {
    handleSearchList() {
      //搜索查询事件
      const [startTime, endTime] = formatSearchTime(this.timeArray);
      this.form.start_time = startTime;
      this.form.end_time = endTime;
      this.form.page = 1;
      this.getAllList();
    },
    handleViewDetail(item) {
      //确认收款
      this.receiptFlag = true;
      this.selectId = item.id;
      this.selectPrice = item.amount;
    },
    handleEdit(item) {
      this.editFlag = true;
      this.proofId = item.proof_id;
    },
    handleDelete(id) {
      //删除事件
      this.selectId = id;
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteHttp();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleJump(type, order_sn) {
      this.$router.push({
        path: "/oms/" + type,
        query: { order_sn: order_sn }
      });
    },
    sizeChange(val) {
      //分页器：页大小变更
      this.form.page = 1;
      this.form.pageSize = val;
      this.getAllList();
    },
    pageChange(val) {
      // 分页器：页码变更
      this.form.page = val;
      this.getAllList();
    },
    handleClose() {
      // emit
      this.receiptFlag = false;
      this.editFlag = false;
    },
    receiptSubmit(params) {
      // emit
      if (this.editFlag) {
          this.handleClose();
          this.getAllList();
      } else {
        this.confirmHttp(params);
      }
    },
    getAllList() {
      //初始化列表数据
      listItem(this.selectType, this.form)
        .then(res => {
          const { data = [], total } = res;
          this.list = data;
          this.total = total;
        })
        .catch(err => {
          console.log(err);
        });
    },
    confirmHttp(params) {
      confirmItem(this.selectId, params)
        .then(res => {
          this.handleClose();
          this.getAllList();
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteHttp() {
      //
      deleteItem(this.selectId)
        .then(res => {
          this.getAllList();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

.link {
  cursor: pointer;
  color: #409eff;
}

.left {
  text-align: left;
}
</style>
