<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :xs="24" :md="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>用户数据</span>
          </div>
          <ul class="boxUl">
            <li class="itemLi">
              <div class="title">累计注册</div>
              <strong class="num">{{dataUser.u_total}}</strong>
            </li>
            <li class="itemLi">
              <div class="title">昨日新增</div>
              <strong class="num">{{dataUser.u_yesterday}}</strong>
            </li>
            <li class="itemLi">
              <div class="title">最近一周新增</div>
              <strong class="num">{{dataUser.u_week}}</strong>
            </li>
            <li class="itemLi">
              <div class="title">最近一月新增</div>
              <strong class="num">{{dataUser.u_month}}</strong>
            </li>
          </ul>
        </el-card>
      </el-col>
      <!--店铺数据-->
      <el-col :xs="24" :md="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>店铺数据</span>
          </div>
          <ul class="boxUl">
            <li class="itemLi3">
              <div class="title">已开通店铺</div>
              <strong class="num">{{dataStore.opened}}</strong>
            </li>
            <li class="itemLi3">
              <div class="title">已关闭店铺</div>
              <strong class="num">{{dataStore.closed}}</strong>
            </li>
            <li class="itemLi3">
              <div class="title">待审核店铺申请</div>
              <strong class="num">{{dataStore.check}}</strong>
            </li>
            <li class="itemLi3">
              <div class="title">审核未通过申请</div>
              <strong class="num">{{dataStore.check_no}}</strong>
            </li>
            <li class="itemLi3">
              <div class="title">待审核媒介资质</div>
              <strong class="num">{{dataStore.media_aptitude}}</strong>
            </li>
            <li class="itemLi3">
              <div class="title">待审核店铺隶属媒体公司</div>
              <strong class="num">{{dataStore.media_company}}</strong>
            </li>
          </ul>
        </el-card>
      </el-col>
      <!--线索数据-->
      <el-col :xs="24" :md="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>线索数据</span>
          </div>
          <ul class="boxUl">
            <li class="itemLi">
              <div class="title">已通过审核</div>
              <strong class="num">{{dataClue.check_yes}}</strong>
            </li>
            <li class="itemLi">
              <div class="title">待审核</div>
              <strong class="num">{{dataClue.check_no}}</strong>
            </li>
            <li class="itemLi">
              <div class="title">待审核线索补充</div>
              <strong class="num">{{dataClue.clue_append}}</strong>
            </li>
            <li class="itemLi">
              <div class="title">已关闭</div>
              <strong class="num">{{dataClue.closed}}</strong>
            </li>
          </ul>
        </el-card>
      </el-col>
      <!--服务数据-->
      <el-col :xs="24" :md="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>服务数据</span>
          </div>
          <ul class="boxUl">
            <li class="itemLi3">
              <div class="title">已上架</div>
              <strong class="num">{{dataService.shelf}}</strong>
            </li>
            <li class="itemLi3">
              <div class="title">待审核服务</div>
              <strong class="num">{{dataService.check}}</strong>
            </li>
            <li class="itemLi3">
              <div class="title">待审核服务补充</div>
              <strong class="num">{{dataService.service_append}}</strong>
            </li>
            <li class="itemLi3">
              <div class="title">热门服务</div>
              <strong class="num">{{dataService.hot}}</strong>
            </li>
            <li class="itemLi3">
              <div class="title">精选服务</div>
              <strong class="num">{{dataService.fine}}</strong>
            </li>
            <li class="itemLi3">
              <div class="title">新品服务</div>
              <strong class="num">{{dataService.new}}</strong>
            </li>
          </ul>
        </el-card>
      </el-col>
      <!--案例数据-->
      <el-col :xs="24" :md="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>案例数据</span>
          </div>
          <ul class="boxUl">
            <li class="itemLi3">
              <div class="title">已上架</div>
              <strong class="num">{{dataCase.shelf}}</strong>
            </li>
            <li class="itemLi3">
              <div class="title">待审核案例</div>
              <strong class="num">{{dataCase.check}}</strong>
            </li>
          </ul>
        </el-card>
      </el-col>
      <!--传记数据-->
      <el-col :xs="24" :md="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>传记数据</span>
          </div>
          <ul class="boxUl">
            <li class="itemLi3">
              <div class="title">已上架</div>
              <strong class="num">{{dataBiog.shelf}}</strong>
            </li>
            <li class="itemLi3">
              <div class="title">待审核传记</div>
              <strong class="num">{{dataBiog.check}}</strong>
            </li>
          </ul>
        </el-card>
      </el-col>
      <!--实时上刊数据-->
      <el-col :xs="24" :md="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>实时上刊数据</span>
          </div>
          <ul class="boxUl">
            <li class="itemLi3">
              <div class="title">已上架上刊图片</div>
              <strong class="num">{{dataJournal.shelf_img}}</strong>
            </li>
            <li class="itemLi3">
              <div class="title">待审核上刊图片</div>
              <strong class="num">{{dataJournal.check_img}}</strong>
            </li>
            <li class="itemLi3">
              <div class="title">已上架上刊视频</div>
              <strong class="num">{{dataJournal.shelf_video}}</strong>
            </li>
            <li class="itemLi3">
              <div class="title">待审核上刊视频</div>
              <strong class="num">{{dataJournal.check_video}}</strong>
            </li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :md="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>订单数量统计</span>
            <span style="float: right;">订单总数：<strong>{{orderNum}}</strong></span>
          </div>
          <bar-chart :x-axis="dataOrder.title" :y-axis="dataOrder.num"></bar-chart>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card
          class="box-card">
          <div slot="header" class="clearfix">
            <span>订单交易额统计</span>
            <span style="float: right;">订单总金额：<strong>￥{{orderMoney.toFixed(2)}}</strong></span>
          </div>
          <bar-chart :x-axis="dataOrder.title" :y-axis="dataOrder.money" unit="money"></bar-chart>
        </el-card>
      </el-col>
    </el-row>
    <ul class="trend">
      <li>
        <div class="titles">
          <el-radio-group v-model="radioValue" size="small" @change="radioChange">
            <el-radio-button label="user">用户注册</el-radio-button>
            <el-radio-button label="store">店铺入驻</el-radio-button>
            <el-radio-button label="clue">线索发布</el-radio-button>
            <el-radio-button label="service">服务发布</el-radio-button>
            <el-radio-button label="case">案例发布</el-radio-button>
            <el-radio-button label="biog">传记发布</el-radio-button>
            <el-radio-button label="journal">实时上刊发布</el-radio-button>
          </el-radio-group>
          <div style="float:right">
            <el-date-picker
              size="small"
              v-model="datePick"
              type="date"
              @change="timeChange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </div>
        <gradient-chart :item="gradientList"></gradient-chart>
      </li>
      <li>
        <div class="titles">
          <span class="names">平台订单金额</span>
          <div style="float:right">
            <el-date-picker
              size="small"
              v-model="timeArray"
              type="date"
              @change="orderTimeChange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </div>
        <line-chart
          :chart-data="data7"
        />
      </li>
    </ul>
  </div>
</template>

<script>
  import LineChart from './components/LineChart'
  import BarChart from './components/BarChart'
  import GradientChart from './components/GradientChart'
  import {homeIndex, selectTime} from '@/api/home'

  export default {
    name: 'home',
    components: {LineChart, BarChart, GradientChart},
    data() {
      return {
        datePick: '',
        timeArray: '',
        dataUser: {},  //用户数据
        dataStore: {}, //店铺数据
        dataClue: {}, //线索数据
        dataService: {}, //服务数据
        dataOrder: {}, //订单数量统计/订单交易额统计
        orderNum: 0, //订单总数
        orderMoney: 0,//订单总金额
        data7: {},
        data30: {},
        gradientList: [],
        radioValue: 'user',
        dataCase: {}, //案例
        dataBiog: {}, //传记
        dataJournal: {},//上刊
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        homeIndex().then(res => {
          const {data_7 = {}, data_30 = {}, data_clue = {}, data_order = {}, data_service = {}, data_store = {}, data_user = {}, data_case = {}, data_biog = {}, data_journal = {}} = res;
          this.dataUser = data_user;
          this.dataStore = data_store;
          this.dataClue = data_clue;
          this.dataService = data_service;
          this.dataOrder = data_order;
          this.data7 = data_7;
          this.data30 = data_30;
          this.gradientList = data_30.d_clue;
          this.orderNum = data_order.num.reduce((pre, item) => {
            return pre + item
          }, 0);
          this.orderMoney = data_order.money.reduce((pre, item) => {
            return pre - (-item)
          }, 0);
          this.dataCase = data_case;
          this.dataBiog = data_biog;
          this.dataJournal = data_journal;
        }).catch(err => {

        })
      },
      radioChange(val) {
        this.gradientList = this.data30['d_' + val];
      },
      timeChange(value) {
        this.selectTimeHttp(1, value);
      },
      orderTimeChange(value) {
        this.selectTimeHttp(2, value);
      },
      selectTimeHttp(type, ymd) {
        //	type=1 ,30天图表数据；type=2 ,7天图表数据
        //ymd	查询开始时间：如 “2019-09-27”
        selectTime(type, ymd).then(res => {
          if (type === 1) {
            this.data30 = res
            this.gradientList = res['d_' + this.radioValue];
          } else {
            this.data7 = res
          }
        }).catch(err => {
          console.log(err);
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .box-card {
    margin-bottom: 20px;
  }

  .boxUl {
    display: flex;
    flex-wrap: wrap;

    .itemLi, .itemLi3 {
      text-align: center;
      margin-bottom: 10px;
    }

    .itemLi {
      width: 50%;
    }

    .itemLi3 {
      width: 33.33%;
    }

    .title {
      margin: 20px 0;
      font-size: 14px;
    }

    .num {
      display: block;
      font-size: 28px;
    }
  }

  .titles {
    height: 32px;
  }

  .trend {
    margin: 20px 0;
    width: 100%;
    overflow: hidden;

    li {
      width: 100%;
      list-style-type: none;
      border: 1px solid #dfdfdf;
      padding: 20px;
      box-sizing: border-box;
      margin-bottom: 20px;
    }

    .names {
      height: 19px;
      line-height: 19px;
      display: block;
      margin-bottom: 19px;
      float: left;
    }
  }
</style>
