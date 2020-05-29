<template>
  <div class="app-container">
    <el-form :inline="true" :model="form" size="small" class="headerForm">
      <el-form-item label="申请时间">
        <el-date-picker
          v-model="timeArray"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="申请原因">
        <el-select v-model="form.reason" placeholder="全部" clearable>
          <el-option label="全部" value=""/>
          <el-option v-for="item of reasonList" :key="item.id" :label="item.reason" :value="item.reason"/>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select class="w_100" v-model="form.status" placeholder="请选择">
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input class="w_150" v-model="form.nickname" placeholder="雇主名称" clearable/>
      </el-form-item>
      <el-form-item>
        <el-input class="w_150" placeholder="店铺名称" v-model="form.store_name" clearable/>
      </el-form-item>
      <el-form-item>
        <el-input class="w_200" placeholder="订单号" v-model="form.order_sn" clearable/>
      </el-form-item>
      <el-form-item>
        <el-input class="w_150" v-model="form.service_name" placeholder="服务名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearchList">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" border>
      <el-table-column prop="id" label="退款编号" min-width="100" align="center"/>
      <el-table-column prop="created_at" label="申请时间" width="100" align="center"/>
      <el-table-column prop="nickname" label="雇主昵称" width="140" align="center"/>
      <el-table-column prop="store_name" label="店铺名称" width="150" align="center"/>
      <el-table-column prop="type" label="类型" width="120" align="center">
        <template slot-scope="scope">{{scope.row.type |orderType}}</template>
      </el-table-column>
      <el-table-column label="订单信息" width="250">
        <template slot-scope="scope">
          <router-link :to="{path:'/oms/service'}" class="jump">
            <div>订单号：{{ scope.row.order_sn }}</div>
            <div class="oneRow">{{ scope.row.name }}</div>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="申请原因" width="280" align="center">
        <template slot-scope="scope">
          <div class="twoRow">{{scope.row.reason}}</div>
        </template>
      </el-table-column>
      <el-table-column label="详细描述" width="200" align="center">
        <template slot-scope="scope">
          <div class="oneRow">{{ scope.row.refuse_reason || '' }}</div>
          <a
            v-for="(item,index) in scope.row.url.split(',')"
            class="link"
            :href="item | imgPrefixF"
            target="_blank"
            download
          >附件{{ index }}</a>
        </template>
      </el-table-column>
      <el-table-column label="应退金额" width="110" align="center">
        <template slot-scope="scope">￥{{scope.row.amount}}</template>
      </el-table-column>
      <el-table-column label="状态" min-width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status | refundStatus }}</span>
          <!--          拒绝原因-->
          <popover-cpn v-if="scope.row.status ===2" :key="scope.row.id" :reason="scope.row.refuse_reason"></popover-cpn>
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
  </div>
</template>
<script>
  import PopoverCpn from "@/components/PopoverCpn";
  import {formatSearchTime} from '@/utils/date';
  import {refundStatus} from '@/utils/commonData';
  import {orderRefundList, depositOrderById, deleteDepositOrder} from '@/api/oms';
  import {getRefundReason} from '@/api/common';

  export default {
    name: "orderRefund",
    components: {PopoverCpn},
    data() {
      return {
        reasonList: [],
        statusList: refundStatus,
        timeArray: [],
        total: 0,
        deleteFlag: false,
        receiptFlag: false,
        selectId: 0,
        form: {
          page: 1,
          pageSize: 30,
          reason: '',//	否	int	申请原因
          status: '',//	否	int	状态：0待处理,1已退款,2已拒绝,3已取消
          order_sn: '',//	否	string	订单号
          start_time: '',//	否	string	申请时间-起始
          end_time: '',//	否	string	申请时间-结束
          service_name: '',//	否	string	服务名称
          store_name: '',//	否	string	店铺名称
          nickname: '',//	否	string	雇主名称
        },
        list: [],
      }
    },
    created() {
      const {order_sn = ''} = this.$route.query;
      if (order_sn) {
        this.form.order_sn = order_sn;
      }
      this.refundReasonHttp()
      this.getList();
    },
    methods: {
      //搜索查询事件
      handleSearchList() {
        const [startTime, endTime] = formatSearchTime(this.timeArray);
        this.form.start_time = startTime;
        this.form.end_time = endTime;
        this.form.page = 1;
        this.getList()
      },
      //确认收款
      handleViewDetail(id) {
        this.receiptFlag = true;
        this.selectId = id;
      },
      //删除事件
      handleDelete(id) {
        this.deleteFlag = true
        this.selectId = id
      },
      handleSizeChange(val) { //分页器：页大小变更
        this.form.page = 1;
        this.form.pageSize = val;
        this.getList()
      },
      handlePageChange(val) { //分页器：页码变更
        this.form.page = val
        this.getList()
      },
      handleClose() { // emit
        this.receiptFlag = false;
        this.deleteFlag = false
      },
      deleteSubmit() { // emit
        this.deleteHttp()
      },
      receiptSubmit(params) {// emit
        this.depositOrderByIdHttp(params)
      },
      getList() {
        orderRefundList(this.form).then(res => {
          const {data = [], total=0} = res
          this.list = data
          this.total = total
        }).catch(err => {
          console.log(err)
        })
      },
      refundReasonHttp() {
        getRefundReason().then(res => {
          if (res.code === 1) {
            this.reasonList = res.data
          } else {
            this.reasonList = []
            this.$message({
              type: 'error',
              message: '操作失败!'
            });
          }
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
            this.getList()
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
            this.getList()
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
  @import "../../styles/mixin.scss";

  .oneRow {
    text-align: center;
    @include ellipsis();
  }

  .twoRow {
    @include ellipsis(2);
  }

  .jump {
    color: #409EFF;
    display: block;
  }

  .link {
    color: #409EFF;
    margin: 0 10px;
  }
</style>
