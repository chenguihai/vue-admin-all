<template> 
  <el-container>
    <el-main>
      <el-form :inline="true" size="small" class="headerForm">
        <el-form-item label="结算类型">
          <el-select class="w_140"
                     v-model="form.settle_type" clearable>
            <el-option
              v-for="item in settleTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结算时间">
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
        <el-form-item label="结算项目">
          <el-input placeholder="结算项目" v-model="form.settle_explain" clearable/>
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
        <el-table-column prop="created_at" label="结算时间" width="100" align="center"/>
        <el-table-column label="结算类型" min-width="110" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.settle_type | settleType}}</span>
            <span></span>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="雇主" min-width="130" align="center"/>
        <el-table-column prop="order_sn" label="结算订单号" min-width="140" align="center"/>
        <el-table-column prop="settle_project" label="结算项目" min-width="160" align="center"/>
        <el-table-column prop="settle_money" label="结算金额" min-width="120" align="center"/>
        <el-table-column label="平台技术费" min-width="180" align="center">
          <template slot-scope="scope">
              <span>
              -{{scope.row.platform_tech_fee}}&nbsp;(&nbsp;{{Math.round(scope.row.platform_tech_fee/scope.row.settle_money*100)}}%&nbsp;)
                </span>
            <div>扣除服务费免费额度{{scope.row.used_fee}}</div>
          </template>
        </el-table-column>
        <el-table-column label="服务商收入" min-width="120" align="center">
          <template slot-scope="scope">
            <span class="blue">+{{scope.row.provider_income}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="store_name" label="服务商" min-width="120" align="center"/>
        <el-table-column prop="settle_explain" label="结算说明" min-width="200px" align="center"/>
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
  import {orderSettleList} from '@/api/pms';

  export default {
    name: 'settleDetail',
    data() {
      return {
        timeArray: [],
        list: [],
        timeObject: timeObject,
        settleTypes: [//	结算类型：1 服务订单，2 任务订单，3 案例订单，4 传记订单，5 上刊画面订单
          {label: "全部", value: ''},
          {label: "服务订单", value: 1},
          {label: "任务订单", value: 2},
          {label: "案例订单", value: 3},
          {label: "传记订单", value: 4},
          {label: "上刊画面订单", value: 5},
        ],
        total: 0,
        form: {
          page: 1,
          pageSize: 10,
          settle_type: '',//	否	int	结算类型：1 服务订单，2 任务订单
          order_sn: '',//	否	string	订单号
          settle_explain: '',//	否	string	结算说明
          start_time: '',//	否	string	结算时间-起始
          end_time: '',//	否	string	结算时间-结束
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
        orderSettleList(this.form).then((res) => {
          this.list = res.data;
          this.total = res.total;
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
  .blue {
    color: #409EFF;
  }
</style>
