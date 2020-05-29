<template>
  <div class="app-container">
    <el-form :inline="true" :model="form" size="small" class="headerForm">
      <el-form-item label="下单时间">
        <el-date-picker
          v-model="timeArray"
          type="daterange"
          range-separator="-"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="客户类型">
        <el-select class="w_140" v-model="form.customer_type" placeholder="请选择" clearable>
          <el-option label="全部" value></el-option>
          <el-option
            v-for="item in customerType"
            :key="item.id"
            :label="item.customer_type"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select class="w_100" v-model="form.status" placeholder="请选择" clearable>
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="店铺">
        <el-input class="w_150" placeholder="店铺名称" v-model="form.store_name" clearable />
      </el-form-item>
      <el-form-item label="线索">
        <el-input class="w_150" placeholder="线索名称" v-model="form.clue_name" clearable />
      </el-form-item>
      <el-form-item label="订单号">
        <el-input class="w_200" placeholder="订单号" v-model="form.order_sn" clearable />
      </el-form-item>
      <el-form-item label="付款单位">
        <el-input class="w_200" placeholder="付款单位" v-model="form.pay_company" clearable />
      </el-form-item>
      <el-form-item label="收款银行">
        <el-select class="w_160" v-model="form.receive_bank" placeholder="收款银行" clearable>
          <el-option v-for="(item,index) in bankList" :key="index" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearchList">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" border>
      <el-table-column prop="order_sn" label="订单编号" width="170" align="center" />
      <el-table-column prop="created_at" label="下单时间" width="160" align="center" />
      <el-table-column prop="nickname" label="雇主昵称" width="160" align="center" />
      <el-table-column prop="store_name" label="店铺" width="200" align="center" />
      <el-table-column label="客户类型" width="160" align="center">
        <template slot-scope="scope">{{scope.row.customer_type}}</template>
      </el-table-column>
      <el-table-column prop="title" label="线索名称" min-width="180" align="center" />
      <el-table-column label="订单金额" min-width="110" align="center">
        <template slot-scope="scope">￥{{scope.row.amount}}</template>
      </el-table-column>
      <el-table-column label="订单状态" width="80" align="center">
        <template slot-scope="scope">{{scope.row.pay_status | payStatusF}}</template>
      </el-table-column>
      <el-table-column label="支付方式" width="100" align="center">
        <template slot-scope="scope">{{scope.row.pay_id | paymentMethod}}</template>
      </el-table-column>
      <el-table-column prop="pay_time" label="支付时间" width="160" align="center" />
      <el-table-column prop="out_trade_no" label="支付流水号" width="240" align="center" />
      <el-table-column prop="pay_company" label="付款单位" width="160" align="center"></el-table-column>
      <el-table-column prop="receive_bank" label="收款银行" width="130" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" min-width="220" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.pay_status === 0 && scope.row.pay_id ===3"
            type="primary"
            size="mini"
            @click="handleViewDetail(scope.$index, scope.row)"
          >确认收款</el-button>
            <el-button v-if="scope.row.proof_id > 0" type="primary" size="mini" @click="handleEdit(scope.row)">修改收款</el-button>
          <el-button
            v-if="scope.row.pay_status === 0"
            @click="handleDelete(scope.row.id)"
            type="danger"
            size="mini"
          >删除</el-button>
          <!-- <el-button type="text" size="mini">
            <a target="_blank" :href="`/clues/${scope.row.id}?sign=${sign}` | prefixUrlF">详情</a>
          </el-button> -->
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
import { formatSearchTime } from "@/utils/date";
import { payList, BankList } from "@/utils/commonData";
import { clueOrderList, clueOrderById, deleteClueOrder } from "@/api/oms";
import { getClueCustomerType } from "@/api/common";
import ConfirmReceipt from "@/components/ConfirmReceipt";
import EditCollection from "@/components/EditCollection";

export default {
  name: "threadOrder",
  components: { ConfirmReceipt, EditCollection },
  data() {
    return {
      bankList: BankList,
      customerType: [],
      statusList: payList,
      timeArray: [],
      selectId: 0,
      selectIndex: 0,
      form: {
        page: 1,
        pageSize: 10,
        customer_type: "", //	否	int	客户类型id
        status: "", //	否	int	订单状态：0  待付款，1已支付
        store_name: "", //	否	string	店铺名称
        order_sn: "", //	否	string	订单号
        clue_name: "", //	否	string	线索名称
        start_time: "", //	否	string	下单时间-起始
        end_time: "", //	否	string	下单时间-结束
        pay_company: "", //	否	string	付款单位
        receive_bank: "" //	否	string	收款银行:
      },
      list: [],
      total: 0,
      receiptFlag: false,
      editFlag: false,
      selectPrice: 0,
      proofId: "",
    };
  },
  created() {
    this.getAllList();
    this.clueCustomerTypeHttp();
  },
  methods: {
    getAllList() {
      //初始化列表数据
      clueOrderList(this.form)
        .then(res => {
          const { data, total } = res;
          this.list = data;
          this.total = total;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleSearchList() {
      //搜索查询事件
      const [startTime, endTime] = formatSearchTime(this.timeArray);
      this.form.start_time = startTime;
      this.form.end_time = endTime;
      this.form.page = 1;
      this.getAllList();
    },
    clueCustomerTypeHttp() {
      //初始化列表数据
      getClueCustomerType()
        .then(res => {
          const { code, data = [] } = res;
          if (code === 1) {
            this.customerType = data;
          } else {
            this.$message({
              type: "error",
              message: "客户类型获取失败!"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleViewDetail(index, item) {
      //确认收款
      this.selectIndex = index;
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
          this.deleteClueOrderHttp();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSizeChange(val) {
      // 分页器：页大小变更
      this.form.page = 1;
      this.form.pageSize = val;
      this.getAllList();
    },
    handlePageChange(val) {
      //分页器：页码变更
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
        this.confirmReceipt(params);
      }
    },
    confirmReceipt(params) {
      clueOrderById(params, this.selectId)
        .then(res => {
          if (res.code === 1) {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.handleClose();
            this.getAllList();
            // let data = this.list[this.selectIndex]
            // data.status = 1
            // this.$set(this.list, this.selectIndex, data)
          } else {
            this.$message({
              type: "error",
              message: "操作失败!"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteClueOrderHttp() {
      deleteClueOrder(this.selectId)
        .then(res => {
          if (res.code === 1) {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.handleClose();
            this.getAllList();
          } else {
            this.$message({
              type: "error",
              message: "操作失败!"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
