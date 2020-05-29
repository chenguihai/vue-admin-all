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
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="订单号">
        <el-input class="w_200" placeholder="订单号" v-model="form.order_sn" clearable/>
      </el-form-item>
      <el-form-item label="店铺">
        <el-input class="w_150" placeholder="店铺名称" v-model="form.store_name" clearable/>
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
        <el-button type="primary" @click="handleSearchList">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" border>
      <el-table-column prop="order_sn" label="订单编号" min-width="170" align="center"/>
      <el-table-column prop="created_at" label="下单时间" width="160" align="center"/>
      <el-table-column prop="store_name" label="店铺" width="150" align="center"/>
      <el-table-column prop="entered_skillId" label="保证金类目" width="230" align="center"/>
      <el-table-column label="订单金额" width="120" align="center">
        <template slot-scope="scope">￥{{scope.row.order_amount}}</template>
      </el-table-column>
      <el-table-column label="订单状态" width="90" align="center">
        <template slot-scope="scope">{{scope.row.status | payStatusF}}</template>
      </el-table-column>
      <el-table-column label="支付方式" width="100" align="center">
        <template slot-scope="scope">{{scope.row.pay_id |paymentMethod}}</template>
      </el-table-column>
      <el-table-column prop="pay_at" label="支付时间" width="160" align="center"/>
      <el-table-column prop="out_trade_no" label="支付流水号" min-width="210" align="center"/>
           <el-table-column prop="pay_company" label="付款单位" width="160" align="center"></el-table-column>
      <el-table-column prop="receive_bank" label="收款银行" width="130" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" min-width="180" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 0">
          <el-button v-if="scope.row.pay_id === 3" type="primary" size="mini"
                     @click="handleViewDetail(scope.$index,scope.row)">确认收款
          </el-button>
          <el-button @click="handleDelete(scope.row.id)" type="danger" size="mini">删除</el-button>
          </div>
            <el-button v-if="scope.row.proof_id > 0" type="primary" size="mini" @click="handleEdit(scope.row)">修改收款</el-button>
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
    <confirm-receipt v-if="receiptFlag" :price="selectPrice" @emitClose="handleClose"
                     @emitSubmit="receiptSubmit"></confirm-receipt>
                         <edit-collection
      v-if="editFlag"
      :proof="proofId"
      @emitClose="handleClose"
      @emitSubmit="receiptSubmit"
    />
  </div>
</template>
<script>
  import {formatSearchTime} from '@/utils/date';
  import {orderList,BankList} from '@/utils/commonData';
  import ConfirmReceipt from '@/components/ConfirmReceipt';
  import EditCollection from "@/components/EditCollection";
  import {depositOrderList, depositOrderById, deleteDepositOrder} from '@/api/oms';
  export default {
    name: "bailOrder",
    components: {ConfirmReceipt,EditCollection},
    data() {
      return {
        bankList:BankList,
        statusList: orderList,
        timeArray: [],
        total: 0,
        receiptFlag: false, //false
        editFlag: false, //false
        selectId: 0,
        selectIndex: 0,
        form: {
          page: 1,
          pageSize: 15,
          status: '',//	否	int	订单状态：0待支付，1已支付
          order_sn: '',//	否	string	订单号
          store_name: '',//	否	string	店铺名称
          start_time: '',//	否	string	下单时间-起始
          end_time: '',//	否	string	下单时间-结束
          pay_company:'',//	否	string	付款单位
          receive_bank:'',//	否	string	收款银行:
        },
        list: [],
        selectPrice: 0,
        proofId: "",
      }
    },
    created() {
      this.getAllList();
    },
    methods: {
      handleSearchList() { //搜索查询事件
        const [startTime, endTime] = formatSearchTime(this.timeArray)
        this.form.start_time = startTime
        this.form.end_time = endTime
        this.form.page = 1;
        this.getAllList()
      },
      handleViewDetail(index, item) { //显示确认收款
        this.receiptFlag = true;
        this.selectIndex = index;
        this.selectId = item.id;
        this.selectPrice = item.order_amount;
      },
      handleEdit(item) {
      this.editFlag = true;
      this.proofId = item.proof_id;
      },
      handleDelete(id) { //删除事件
        this.selectId = id
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteHttp()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleSizeChange(val) { //分页器：页大小变更
        this.form.page = 1;
        this.form.pageSize = val;
        this.getAllList()
      },
      handlePageChange(val) { //分页器：页码变更
        this.form.page = val
        this.getAllList()
      },
      handleClose() { // emit
        this.receiptFlag = false;
        this.editFlag = false;
      },
      receiptSubmit(params) {// emit
         if (this.editFlag) {
          this.handleClose();
          this.getAllList();
          } else {
            this.confirmReceipt(params)
          }
      },
      getAllList() {
        depositOrderList(this.form).then(res => {
          const {data = [], total} = res
          this.list = data
          this.total = total
        }).catch(err => {
          console.log(err)
        })
      },
      deleteHttp() {
        deleteDepositOrder(this.selectId).then(res => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            this.handleClose()
            this.getAllList()
          } else {
            this.$message({
              type: 'error',
              message: res.data
            });
          }
        }).catch(err => {
          console.log(err)
        })
      },
      confirmReceipt(params) {
        depositOrderById(params, this.selectId).then(res => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            this.handleClose()
            this.getAllList()
            // let data = this.list[this.selectIndex]
            // data.status = 1;
            // this.$set(this.list, this.selectIndex, data)
          } else {
            this.$message({
              type: 'error',
              message: res.data
            });
          }
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }

</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
