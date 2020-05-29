<template>
  <div class="app-container">
    <div class="header">
      <el-form :inline="true" :model="searchForm" size="small" label-width="80px">
        <el-form-item label="任务模式">
          <el-select class="status" v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option
              v-for="item in taskMode"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select class="status" v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option
              v-for="(item,index) in statusList"
              :key="index"
              :label="item"
              :value="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下单时间">
          <el-date-picker
            v-model="orderTime"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input class="shop" size="small" placeholder="订单号" v-model="searchForm.order_sn" clearable/>
        </el-form-item>
        <el-form-item label="雇主">
          <el-input class="shop" size="small" placeholder="雇主" v-model="searchForm.store_name" clearable/>
        </el-form-item>
        <el-form-item label="任务名称">
          <el-input class="shop" size="small" placeholder="任务名称" v-model="searchForm.store_name" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button style="float:right" type="primary" @click="handleSearchList()" size="small">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="orderList"
      style="width: 100%;"
      border>
      <el-table-column label="订单号" min-width="170" align="center">
        <template slot-scope="scope">{{scope.row.order_sn}}</template>
      </el-table-column>
      <el-table-column label="下单时间" width="100" align="center">
        <template slot-scope="scope">{{scope.row.created_at}}</template>
      </el-table-column>
      <el-table-column label="雇主" width="150" align="center">
        <template slot-scope="scope">{{scope.row.store_name}}</template>
      </el-table-column>
      <el-table-column label="任务预算" width="120" align="center">
        <template slot-scope="scope">{{scope.row.entered_skillId}}</template>
      </el-table-column>
      <el-table-column label="订单金额" width="90" align="center">
        <template slot-scope="scope">￥{{scope.row.order_amount}}</template>
      </el-table-column>
      <el-table-column label="任务名称" width="80" align="center">
        <template slot-scope="scope">{{scope.row.status | orderStatus}}</template>
      </el-table-column>
      <el-table-column label="任务模式" width="120" align="center">
        <template slot-scope="scope">{{scope.row.pay_id |paymentMethod}}</template>
      </el-table-column>
      <el-table-column label="订单状态" width="100" align="center">
        <template slot-scope="scope">{{scope.row.pay_at}}</template>
      </el-table-column>
      <el-table-column label="支付方式" min-width="180" align="center">
        <template slot-scope="scope">{{scope.row.order_serial_number}}</template>
      </el-table-column>
      <el-table-column label="支付时间" min-width="180" align="center">
        <template slot-scope="scope">{{scope.row.order_serial_number}}</template>
      </el-table-column>
      <el-table-column label="支付流水号" min-width="180" align="center">
        <template slot-scope="scope">{{scope.row.order_serial_number}}</template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="160" align="center">
        <template slot-scope="scope" v-if="scope.row.status === 0">
          <div v-if="scope.row.pay_id === 3">
            <el-button type="primary" size="mini" @click="handleViewDetail(scope.row)">确认收款</el-button>
          </div>
          <el-button @click="handleDelete(scope.row.id)" type="text" size="small">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="searchForm.page"
        :page-size="searchForm.pageSize"
        :page-sizes="[15,30,50]"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 确认收款-->
    <confirm-receipt v-if="receiptFlag" :price="selectPrice" @emitClose="handleClose"
                     @emitSubmit="receiptSubmit"></confirm-receipt>
    <!--    删除框-->
    <operation-hint
      title="删除"
      content="删除此项后，数据库没有此项"
      v-if="deleteFlag"
      @emitClose="handleClose"
      @emitSubmit="deleteSubmit"
    />
  </div>
</template>
<script>
  import {formatDate} from '@/utils/date';
  import OperationHint from '@/components/OperationHint';
  import ConfirmReceipt from '@/components/ConfirmReceipt';
  import {depositOrderList, depositOrderById, deleteDepositOrder} from '@/api/oms';

  export default {
    name: "taskOrder",
    components: {OperationHint, ConfirmReceipt},
    data() {
      return {
        taskMode: [
          {
            label: "全部",
            value: ''
          }, {
            label: "单人悬赏",
            value: 1
          }, {
            label: "计件悬赏",
            value: 2
          }, {
            label: "多人悬赏",
            value: 3
          }, {
            label: "投标",
            value: 4
          }
        ],
        statusList: ['全部', '待选标', '待托管', '待评价', '公示中', '待验收', '已成交', '未成交', '已冻结', '工作中'],
        orderTime: [],
        total: 0,
        deleteFlag: false,
        receiptFlag: false,
        selectId: 0,
        searchForm: {
          page: 1,
          pageSize: 30,
          status: '',//	否	int	订单状态：0待支付，1已支付
          order_sn: '',//	否	string	订单号
          store_name: '',//	否	string	店铺名称
          start_time: '',//	否	string	下单时间-起始
          end_time: '',//	否	string	下单时间-结束
        },
        orderList: [],
        selectPrice: 0,
      }
    },
    created() {
      this.depositOrderListHttp();
    },
    methods: {
      //搜索查询事件
      handleSearchList() {
        this.depositOrderListHttp()
      },
      //确认收款
      handleViewDetail(item) {
        this.receiptFlag = true;
        this.selectId = item.id;
        this.selectPrice = item.order_amount;
      },
      //删除事件
      handleDelete(id) {
        this.deleteFlag = true
        this.selectId = id
      },
      handleSizeChange(val) { //分页器：页大小变更
        this.searchForm.pageSize = val
        this.depositOrderListHttp()
      },
      handlePageChange(val) { //分页器：页码变更
        this.searchForm.page = val
        this.depositOrderListHttp()
      },
      handleClose() { // emit
        this.receiptFlag = false;
        this.deleteFlag = false
      },
      deleteSubmit() { // emit
        this.deleteDepositOrderHttp()
      },
      receiptSubmit(params) {// emit
        this.depositOrderByIdHttp(params)
      },
      depositOrderListHttp() {
        const [start_time = '', end_time = ''] = this.orderTime || []
        let flag = this.orderTime && this.orderTime.length > 0
        this.searchForm.start_time = flag ? formatDate(start_time, 'yyyy-MM-dd hh:mm:ss') : null;
        this.searchForm.end_time = flag ? formatDate(end_time, 'yyyy-MM-dd hh:mm:ss') : null;

        depositOrderList(this.searchForm).then(res => {
          const {data = [], total} = res
          this.orderList = data
          this.total = total
        }).catch(err => {
          console.log(err)
        })
      },
      deleteDepositOrderHttp() {
        deleteDepositOrder(this.selectId).then(res => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            this.handleClose()
            this.depositOrderListHttp()
          } else {
            this.$message({
              type: 'error',
              message: '操作失败!'
            });
          }
        }).catch(err => {
          console.log(err)
        })
      },
      depositOrderByIdHttp(params) {
        depositOrderById(params, this.selectId).then(res => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            this.handleClose()
            this.depositOrderListHttp()
          } else {
            this.$message({
              type: 'error',
              message: '操作失败!'
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
  .header {
    .shop {
      width: 150px;
    }

    .type {
      width: 150px;
    }

    .status {
      width: 130px;
    }
  }
</style>
