<template> 
  <el-container>
    <el-main>
      <div class="accountBox">
        <span class="number">{{account}}元</span>
        <span class="type">可用保证金</span>
      </div>
      <el-form :inline="true" size="small" class="headerForm">
        <el-form-item label="交易类型">
          <el-select class="w_100"
                     v-model="form.trade_type" clearable>
            <el-option
              v-for="item in transactionTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
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
          <el-input placeholder="店铺名称" v-model="form.store_name" clearable/>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="订单号" v-model="form.order_sn" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearchList">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" border>
        <el-table-column prop="order_sn" label="编号" min-width="180" align="center"/>
        <el-table-column prop="updated_at" label="操作时间" min-width="180" align="center"/>
        <el-table-column prop="store_name" min-width="180" label="店铺" align="center"/>
        <el-table-column label="交易金额" min-width="160" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.order_amount">
              <span v-if="scope.row.process_type==1" class="color-main">+￥{{scope.row.order_amount}}</span>
              <span v-else class="red">-￥{{scope.row.order_amount}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="保证金余额" min-width="120" align="center">
          <template slot-scope="scope">
            ￥{{scope.row.remain}}
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="交易类型" min-width="120px" align="center">
          <template slot-scope="scope">
            {{scope.row.process_type | transactionType}}
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="交易说明" min-width="200px" align="center"/>
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
    import {depositList} from '@/api/pms';

    export default {
        name: 'Bonddetail',
        data() {
            return {
                account: '',//可用保证金
                timeArray: [],
                list: [],
                transactionTypes: [//	交易类型：1 缴纳 -1 退还 -2 扣除
                    {
                        label: "全部",
                        value: ''
                    }, {
                        label: "缴纳",
                        value: 1
                    }, {
                        label: "退还",
                        value: -1
                    }, {
                        label: "扣除",
                        value: -2
                    },
                ],
                total: 0,
                form: {
                    page: 1,
                    pageSize: 10,
                    trade_type: '',//	否	int	交易类型：1 缴纳 -1 退还 -2 扣除
                    // remarks: '',//	否	string	交易说明
                    store_name: '',//	否	string	店铺名称
                    start_time: '',//	否	string	操作时间-起始
                    end_time: '',//	否	string	操作时间-结束
                    order_sn: '',//	否	string	订单号
                }
            }
        },
        created() {
            this.getList();
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
                depositList(this.form).then((res) => {
                    const {account = 0, list: {data = [], total = 0}} = res
                    this.account = account;
                    this.list = data;
                    this.total = total;
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
  .red {
    color: #f00;
  }

</style>
