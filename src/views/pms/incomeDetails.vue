<template> 
  <el-container>
    <el-main>
      <div class="accountBox">
        <span class="number">{{account}}元</span>
        <span class="type">总收入</span>
      </div>
      <el-form :inline="true" size="small" class="headerForm">
        <el-form-item label="收入类型">
          <el-select clas="w_150"
                     v-model="form.income_type" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="(value, key) in incomeTypes"
              :key="key"
              :label="value"
              :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收入时间">
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
          <el-input placeholder="订单号" v-model="form.order_sn" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearchList">查询</el-button>
        </el-form-item>
        <el-form-item class="fr">
          <el-button-group>
            <el-button v-for="(item,index) in timeObject" :type="form.day === item.value ? 'primary':''" :key="index"
                       @click="timeSelect(item.value)">
              {{item.label}}
            </el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
      <el-table :data="list" border>
        <el-table-column prop="created_at" label="收入时间" min-width="180" align="center"/>
        <el-table-column label="收入类型" min-width="180" align="center">
          <template slot-scope="scope">
            <span>{{incomeTypes[scope.row.income_type]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="order_sn" label="订单号" min-width="170" align="center"/>
        <el-table-column label="平台收入" min-width="130" align="center">
          <template slot-scope="scope">
            <span class="color-main">+￥{{scope.row.platform_income}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="income_explain" label="收入说明" min-width="200px" align="center"/>
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
  import {timeObject} from '@/utils/commonData';
  import {platformIncomeList} from '@/api/pms';

  export default {
    name: 'incomeDetails',
    data() {
      return {
        account: '',//可用保证金
        timeArray: [],
        timeObject: timeObject,
        list: [],
        incomeTypes: {},
        total: 0,
        form: {
          page: 1,
          pageSize: 10,
          income_type: '',//	否	int	收入类型：1 技术服务费 2 广告线索销售 3 增值服务销售 4 工具销售
          order_sn: '',//	否	string	订单号
          start_time: '',//	否	string	收入时间-起始
          end_time: '',//	否	string	收入时间-结束
          day: '',//	否	string	日期查询：today 今日，tomorrow 明日，week 最近7天，month 最近30天
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
      timeSelect(value) {
        this.form.day = value === this.form.day ? '' : value;
        this.form.page = 1;
        this.getList();
      },
      getList() {
        platformIncomeList(this.form).then((res) => {
          const {account = 0, list: {data = [], total = 0}, income_type = {}} = res
          this.account = account;
          this.list = data;
          this.total = total;
          this.incomeTypes = income_type;
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
</style>
