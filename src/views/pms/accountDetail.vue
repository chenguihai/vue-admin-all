<template> 
  <el-container>
    <el-main>
      <div class="account">
        <div class="left" v-if="account.money">
          <span class="number">{{account.money-(-account.money_frozen)}}元</span>
          <span class="type">账户余额</span>
        </div>
        <div class="right" v-if="account.money">
          <span class="money">可用余额：{{account.money}}</span>
          <span>冻结余额：{{account.money_frozen}}</span>
        </div>
      </div>
      <el-form :inline="true" size="small" class="headerForm">
        <el-form-item label="交易类型">
          <el-select class="w_140"
                     v-model="form.trade_type" clearable>
            <el-option value="" label="全部"></el-option>
            <el-option
              v-for="item in transactionTypes"
              :key="item.id"
              :label="item.type_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作时间">
          <el-date-picker
            v-model="timeArray"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="用户昵称" v-model="form.nickname" clearable/>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="交易说明" v-model="form.trade_note" clearable/>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="订单号" v-model="form.order_sn" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearchList">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" border>
        <el-table-column prop="created_at" label="操作时间" width="100" align="center"/>
        <el-table-column prop="nickname" label="用户昵称" min-width="180" align="center"/>
        <el-table-column prop="type_name" min-width="120" label="类型" align="center"/>
        <el-table-column label="交易金额" min-width="130" align="center">
          <template slot-scope="scope">
            <span class="color-main">￥{{scope.row.trade_money}}</span>
          </template>
        </el-table-column>
        <el-table-column label="可用余额" min-width="130" align="center">
          <template slot-scope="scope">
            ￥{{scope.row.account_money}}
          </template>
        </el-table-column>
        <el-table-column prop="order_sn" label="订单编号" min-width="180px" align="center"/>
        <el-table-column prop="trade_note" label="交易说明" min-width="300px" align="center"/>
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
    import {formatSearchTime} from '@/utils/date';
    import {accountList, tradeType} from '@/api/pms';

    export default {
        name: 'accountDetail',
        data() {
            return {
                account: {},//可用保证金
                timeArray: [],
                list: [],
                transactionTypes: [],
                total: 0,
                form: {
                    page: 1,
                    pageSize: 10,
                    trade_type: '',//	否	int	交易类型
                    nickname: '',//	否	string	用户昵称
                    trade_note: '',//	否	string	交易说明
                    start_time: '',//	否	string	操作时间-起始
                    end_time: '',//	否	string	操作时间-结束
                }
            }
        },
        created() {
            this.getList();
            this.tradeTypeHttp()
        },
        methods: {
            handleSearchList() {            //搜索
                const [startTime, endTime] = formatSearchTime(this.timeArray);
                this.form.start_time = startTime;
                this.form.end_time = endTime;
                this.form.page = 1;
                this.getList();
            },
            getList() {
                accountList(this.form).then((res) => {
                    const {account = 0, list: {data = [], total = 0}} = res
                    this.account = account;
                    this.list = data;
                    this.total = total;
                }).catch((err) => {
                  console.log(err)
                })
            },
            tradeTypeHttp() {
                tradeType().then((res) => {
                    this.transactionTypes = res
                }).catch((err) => {
                  console.log(err)
                })
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
        }
    }

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .account {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #99a9bf;
    height: 120px;
    margin-bottom: 10px;

    .left, .right {
      display: inline-flex;
      flex-direction: column;
    }

    .left {
      padding-top: 20px;
      text-align: center;
      margin-right: 50px;
    }

    .number {
      font-size: 30px;
      margin-bottom: 20px;
    }

    .type {
      font-size: 18px;
    }

    .money {
      padding-top: 30px;
      margin-bottom: 10px;
    }
  }
</style>

