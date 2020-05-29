<template>
  <div class="app-container">
    <el-form :inline="true" :model="form" size="small" class="headerForm">
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
      <el-form-item label="下单时间">
        <el-date-picker
          v-model="timeArray"
          type="daterange"
          range-separator="-"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="线索">
        <el-input class="w_150" placeholder="线索名称" v-model="form.clue_name" clearable />
      </el-form-item>
      <el-form-item label="订单号">
        <el-input class="w_200" placeholder="订单号" v-model="form.order_sn" clearable />
      </el-form-item>
      <el-form-item label="收款银行">
        <el-select class="w_160" v-model="form.receive_bank" placeholder="收款银行" clearable>
          <el-option v-for="(item,index) in bankList" :key="index" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input class="w_200" placeholder="付款单位" v-model="form.pay_company" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearchList">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" border>
      <el-table-column prop="sn" label="订单编号" min-width="180" align="center" />
      <el-table-column prop="created_at" label="下单时间" width="100" align="center" />
      <el-table-column label="线索信息" width="210" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.clue_sn}}</div>
          <div>{{scope.row.clue_name}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="购买用户" width="170" align="center" />
      <el-table-column prop="buy_name" label="增值服务项目" width="200" align="center" />
      <el-table-column label="订单金额" width="120" align="center">
        <template slot-scope="scope">￥{{scope.row.clue_amount}}</template>
      </el-table-column>
      <el-table-column label="订单状态" width="110" align="center">
        <template slot-scope="scope">{{scope.row.pay_service |orderStatus}}</template>
      </el-table-column>
      <el-table-column label="支付方式" width="100" align="center">
        <template slot-scope="scope">{{scope.row.pay_type | paymentMethod}}</template>
      </el-table-column>
      <el-table-column prop="pay_time" label="支付时间" width="100" align="center" />
      <el-table-column prop="out_trade_no" label="支付流水号" min-width="240" align="center" />
      <el-table-column prop="pay_company" label="付款单位" width="160" align="center"></el-table-column>
      <el-table-column prop="receive_bank" label="收款银行" width="130" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" min-width="180" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.pay_service === 'N'">
          <el-button
            v-if="scope.row.pay_type === 3"
            type="primary"
            size="mini"
            @click="handleViewDetail(scope.$index,scope.row)"
          >确认收款</el-button>
          <el-button @click="handleDelete(scope.row.id)" type="danger" size="mini">删除</el-button>
          </div>
              <el-button
            v-if="scope.row.proof_id > 0"
            type="primary"
            size="mini"
            @click="handleEdit(scope.row)"
          >修改收款</el-button>
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
    ></confirm-receipt>
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
import ConfirmReceipt from "@/components/ConfirmReceipt";
import EditCollection from "@/components/EditCollection";
import { updateProofById } from "@/api/common";
import { BankList } from "@/utils/commonData";
import {
  clueIncOrderList,
  clueIncOrderById,
  deleteClueIncOrder
} from "@/api/oms";

export default {
  name: "incrementOrder",
  components: { ConfirmReceipt, EditCollection },
  data() {
    return {
      bankList: BankList,
      statusList: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "待支付",
          value: "N"
        },
        {
          label: "已成交",
          value: "Y"
        },
        {
          label: "未成交",
          value: "L"
        }
      ],
      timeArray: [],
      total: 0,
      receiptFlag: false, //false
      editFlag: false, //false
      selectId: 0,
      selectIndex: 0,
      form: {
        page: 1,
        pageSize: 10,
        status: "", //	否	int	订单状态：N 待支付，Y 已支付
        start_time: "", //	否	string	下单时间-起始
        end_time: "", //	否	string	下单时间-结束
        clue_name: "", //	否	string	线索名称
        order_sn: "", //	否	string	订单号
        pay_company: "", //	否	string	付款单位
        receive_bank: "" //	否	string	收款银行:
      },
      list: [],
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
    handleViewDetail(index, item) {
      //确认收款
      this.receiptFlag = true;
      this.selectId = item.id;
      this.selectPrice = item.clue_amount;
      this.selectIndex = index;
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
    handleSizeChange(val) {
      //分页器：页大小变更
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
        // this.updateFun(params);
        this.handleClose();
        this.getAllList();
      } else {
        this.confirmReceipt(params);
      }
    },
    getAllList() {
      clueIncOrderList(this.form)
        .then(res => {
          const { data = [], total } = res;
          this.list = data;
          this.total = total;
        })
        .catch(err => {
          console.log(err);
        });
    },
    updateFun(params) {
      updateProofById(this.proofId, params)
        .then(res => {
          this.handleClose();
          this.getAllList();
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => (this.editFlag = false));
    },
    deleteHttp() {
      deleteClueIncOrder(this.selectId)
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
    },
    confirmReceipt(params) {
      clueIncOrderById(params, this.selectId)
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
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
