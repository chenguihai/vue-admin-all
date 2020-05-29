<template> 
  <el-container>
    <el-main>
      <div class="headBox">
        <div class="head_item">
          <span class="number">{{account.money || 0}}元</span>
          <span class="type">可用余额</span>
        </div>
        <div class="head_item">
          <span class="number">{{account.money_frozen || 0}}元</span>
          <span class="type">冻结金额</span>
        </div>
      </div>
      <el-form :inline="true" size="small" class="headerForm">
        <el-form-item label="交易类型">
          <el-select class="w_160"
                     v-model="form.trade_type" clearable>
            <el-option
              v-for="item in transactionType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作时间">
          <el-date-picker @change="daterangeChange"
                          v-model="timeArray"
                          type="daterange"
                          range-separator="-"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          value-format="yyyy-MM-dd"
                          format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="店铺名称">
          <el-input placeholder="店铺名称" v-model="form.store_name" clearable/>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input placeholder="订单号" v-model="form.order_sn" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearchList">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" border>
        <el-table-column prop="created_at" label="操作时间" width="100" align="center"/>
        <el-table-column prop="store_name" min-width="100" label="店铺名称" align="center"/>
        <el-table-column prop="type_name" label="类型" min-width="120" align="center"/>
        <el-table-column label="交易金额" min-width="120" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.trade_type_id==14" class="link">+￥{{scope.row.trade_money}}</span>
            <span v-else class="red">-￥{{scope.row.trade_money}}</span>
          </template>
        </el-table-column>
        <el-table-column label="当前代付余额" min-width="120" align="center">
          <template slot-scope="scope">￥{{scope.row.account_money}}</template>
        </el-table-column>
        <el-table-column prop="order_sn" label="订单编号" min-width="150px" align="center"/>
        <el-table-column prop="trade_note" label="交易说明" min-width="200px" align="center"/>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          :current-page="form.page"
          background
          :page-sizes="[10, 30, 50, 100]"
          :page-size="form.pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange">
        </el-pagination>
      </div>
    </el-main>
  </el-container>
</template>
<script>
  import {settleAccount} from '@/api/pms';

  export default {
    name: 'payBalance',
    data() {
      return {
        account: '',//可用保证金
        timeArray: [],
        list: [],
        confirmPayFlag: false,
        refusalFlag: false,
        selectId: 0,
        selectIndex: 0,
        transactionType: [ //交易类型: 13 代付款转出，14 订单结算存入，15 订单佣金转出
          {label: '全部', value: ''},
          {label: '代付款转出', value: 13},
          {label: '订单结算存入', value: 14},
          {label: '订单佣金转出', value: 15},
        ],
        total: 0,
        form: {
          page: 1,
          pageSize: 10,
          trade_type: '',//	否	int	交易类型: 13代付款转出，14订单结算存入，15订单佣金转出
          store_name: '',//	否	string	店铺名称
          order_sn: '',//	否	string	交易说明
          start_time: '',//	否	string	操作时间-起始
          end_time: '',//	否	string	操作时间-结束
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      daterangeChange(val) {
        const [start = '', end = ''] = val || []
        this.form.start_time = start
        this.form.end_time = end
      },
      handleSearchList() {            //搜索
        this.form.page = 1;
        this.getList();
      },
      handlePageChange(val) {
        this.form.page = val;
        this.getList();
      },
      handleSizeChange(val) {
        this.form.page = 1;
        this.form.pageSize = val;
        this.getList();
      },
      getList() {
        settleAccount(this.form).then((res) => {
          const {account = {}, list: {data = [], total = 0}} = res
          this.account = account;
          this.list = data;
          this.total = total;
        }).catch((err) => {
          console.log(err)
        })
      },
    }
  }

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .headBox {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: #99a9bf;
    height: 120px;
    padding-top: 20px;
    margin-bottom: 20px;
    .number, .type {
      display: block;
    }

    .number {
      font-size: 30px;
      margin-bottom: 20px;
    }

    .type {
      font-size: 18px;
    }
  }

  .red {
    color: #f00;
  }

  .link {
    color: #409EFF;
  }
</style>
