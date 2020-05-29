<template>
  <div class="app-container">
    <el-form :inline="true" :model="form" size="small" class="headerForm">
      <el-form-item label="服务分类">
        <el-select
          class="w_160"
          v-model="form.cate1"
          placeholder="请选择"
          clearable
          @change="handleCategory"
        >
          <el-option value label="全部"></el-option>
          <el-option
            v-for="item in cateList1"
            :key="item.id"
            :label="item.cate_name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-select
          class="w_140"
          v-model="form.cate2"
          placeholder="请选择"
          @change="handleCat2"
          clearable
        >
          <el-option value label="全部"></el-option>
          <el-option
            v-for="item in cateList2"
            :key="item.id"
            :label="item.cate_name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-select class="w_140" v-model="form.cate3" placeholder="请选择" clearable>
          <el-option value label="全部"></el-option>
          <el-option
            v-for="item in cateList3"
            :key="item.id"
            :label="item.cate_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select class="w_100" v-model="form.order_status" placeholder="请选择" clearable>
          <el-option v-for="(item,index) in orderStatus" :key="index" :label="item" :value="index"></el-option>
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
      <el-form-item label="店铺名称">
        <el-input class="w_150" placeholder="店铺名称" v-model="form.store_name" clearable />
      </el-form-item>
      <el-form-item label="服务名称">
        <el-input class="w_150" placeholder="服务名称" v-model="form.service_name" clearable />
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
      <el-table-column prop="order_sn" label="订单编号" width="100" align="center" />
      <el-table-column prop="created_at" label="下单时间" width="100" align="center" />
      <el-table-column prop="nick_name" label="雇主昵称" width="100" align="center" />
      <el-table-column prop="store_name" label="店铺" width="100" align="center" />
      <el-table-column prop="cat_name" label="服务分类" width="200" align="center" />
      <el-table-column label="服务信息" min-width="400" align="center">
        <template slot-scope="scope">
          <router-link class="thumbnail_box link" :to="{path:'/oms/orderbill'}">
            <el-image class="box_left imgCover" fit="cover" :src="scope.row.img | completePicture">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <div class="box_right">
              <h1>{{scope.row.name}}</h1>
              <div style="text-align: left;">{{scope.row.spec}}</div>
              <div class="left">X{{scope.row.number}}</div>
            </div>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="服务价格" width="120" align="center">
        <template slot-scope="scope">￥{{scope.row.price}}</template>
      </el-table-column>
      <el-table-column label="订单金额" width="120" align="center">
        <template slot-scope="scope">￥{{scope.row.amount}}</template>
      </el-table-column>
      <el-table-column label="订单状态" width="80" align="center">
        <template slot-scope="scope">
          {{scope.row.order_status | serviceStatus}}
          <popover-cpn
            v-if="scope.row.order_status ===9"
            :key="scope.row.id"
            :reason="scope.row.reason"
          ></popover-cpn>
        </template>
      </el-table-column>
      <el-table-column label="支付方式" width="80" align="center">
        <template slot-scope="scope">{{scope.row.pay_id | paymentMethod}}</template>
      </el-table-column>
      <el-table-column prop="pay_time" label="支付时间" width="100" align="center"></el-table-column>
      <el-table-column prop="out_trade_no" label="支付流水号" width="160" align="center"></el-table-column>
      <el-table-column prop="pay_company" label="付款单位" width="160" align="center"></el-table-column>
      <el-table-column prop="receive_bank" label="收款银行" width="130" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" width="160" align="center">
        <!--服务订单：pay_status = 2 显示查看退款；order_status=6或7 显示查看评价；invoice_status=1或u_invoice_status=1 显示查看发票，查看的链接都带上order_sn-->
        <template slot-scope="scope">
          <div v-if="scope.row.order_status===1 && scope.row.pay_id === 3">
            <el-button type="primary" size="mini" @click="handleViewDetail(scope.row)">确认收款</el-button>
          </div>
          <div v-if="scope.row.proof_id > 0">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)">修改收款</el-button>
          </div>
          <!--
          <el-button v-if="scope.row.order_status===1" @click="handleDelete(scope.row.id)" type="danger" size="mini"> 删除</el-button>
          -->
          <el-button
            v-if="scope.row.pay_status===2"
            @click="handleJump('orderRefund',scope.row.order_sn)"
            type="text"
            size="mini"
          >查看退款</el-button>
          <el-button
            v-if="scope.row.invoice_status===1 || scope.row.u_invoice_status===1"
            @click="handleJump('orderbill',scope.row.order_sn)"
            type="text"
            size="mini"
          >查看发票</el-button>
          <el-button
            v-if="scope.row.order_status===6 || scope.row.order_status===7"
            @click="handleJump('orderassess',scope.row.order_sn)"
            type="text"
            size="mini"
          >查看评价</el-button>
          <router-link
            :to="{path:'/oms/serviceDetail',query: {id:scope.row.id}}"
            type="text"
            size="mini"
          >详情</router-link>
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
import { orderStatus, BankList } from "@/utils/commonData";
import ConfirmReceipt from "@/components/ConfirmReceipt";
import EditCollection from "@/components/EditCollection";
import {
  listItem,
  confirmItem,
  deleteItem
} from "@/api/oms/service";
import { serviceCat } from "@/api/common";
import PopoverCpn from "@/components/PopoverCpn";

export default {
  name: "service",
  components: { ConfirmReceipt, PopoverCpn,EditCollection },
  data() {
    return {
      bankList:BankList,
      cateList1: [],
      cateList2: [],
      cateList3: [],
      orderStatus: orderStatus,
      timeArray: [],
      selectId: 0,
      form: {
        page: 1,
        pageSize: 15,
        cate1: "", //	否	int	一级分类id
        cate2: "", //	否	int	二级分类id
        cate3: "", //	否	int	三级分类id
        order_status: 0, //	否	int	状态:1待托管,2待接单,3待签署,4工作中,5待验收,6待评价,7已成交,8已冻结,9未成交
        start_time: "", //	否	string	下单时间-起始
        end_time: "", //	否	string	下单时间-结束
        store_name: "", //	否	string	店铺名称
        service_name: "", //	否	string	服务名称
        order_sn: "", //	否	string	订单号
        pay_company:'',//	否	string	付款单位
        receive_bank:'',//	否	string	收款银行:
      },
      total: 0,
      list: [],
      receiptFlag: false, //false
      selectPrice: 0,
      proofId: "",
      editFlag: false
    };
  },
  created() {
    this.serviceCatHttp("cat1", 0);
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
    handleCategory(id) {
      this.form.cate2 = "";
      this.form.cate3 = "";
      this.serviceCatHttp("cat2", id);
    },
    handleCat2(id) {
      this.form.cate3 = "";
      this.serviceCatHttp("cat3", id);
    },
    handleViewDetail(item) {
      //确认收款
      this.selectId = item.id;
      this.selectPrice = item.amount;
      this.receiptFlag = true;
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
    handleSizeChange(val) {
      //分页器：页大小变更
      this.form.page = 1;
      this.form.pageSize = val;
      this.getAllList();
    },
    handlePageChange(val) {
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
        this.confirmReceiptHttp(params);
      }
    },
    getAllList() {
      //初始化列表数据
      let order = this.form.order_status === 0 ? "" : this.form.order_status;
      listItem({ ...this.form, order_status: order })
        .then(res => {
          const { data = [], total } = res;
          this.list = data;
          this.total = total;
        })
        .catch(err => {
          console.log(err);
        });
    },
    serviceCatHttp(type, id) {
      if (id === "") {
        return;
      }
      serviceCat(id)
        .then(res => {
          if (res.code === 1) {
            if (type === "cat1") {
              this.cateList1 = res.data;
            } else if (type === "cat2") {
              this.form.cate2 = "";
              this.form.cate3 = "";
              this.cateList2 = [];
              this.cateList3 = [];
              this.cateList2 = res.data;
            } else {
              this.form.cate3 = "";
              this.cateList3 = [];
              this.cateList3 = res.data;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    confirmReceiptHttp(params) {
      confirmItem(params, this.selectId)
        .then(res => {
          this.handleClose();
          this.getAllList();
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteHttp() {
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
