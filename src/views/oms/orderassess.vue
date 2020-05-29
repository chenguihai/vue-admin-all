<template>
  <div class="app-container">
    <el-form :inline="true" :model="form" size="small" class="headerForm">
      <el-form-item label="评价时间">
        <el-date-picker
          v-model="timeArray"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="评价等级">
        <el-select class="w_90" v-model="form.evaluate" placeholder="请选择" clearable>
          <el-option
            v-for="item in gradeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input class="w_200" placeholder="订单号" v-model="form.order_sn" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearchList">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" border>
      <el-table-column label="订单信息" min-width="280" align="center">
        <template slot-scope="scope">
          <div class="assess-item">
            <div>订单号：<span>{{scope.row.order_sn}}</span></div>
            <div>服务订单：<span>{{scope.row.service_name}}</span></div>
            <div>成交时间：<span>{{scope.row.finish_time}}</span></div>
            <div>成交金额：<span>￥{{scope.row.amount}}</span></div>
            <div>雇主：<span>{{scope.row.employer}}</span></div>
            <div>服务商：<span>{{scope.row.provider}}</span></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="雇主对服务商的评价" min-width="280" align="center">
        <template slot-scope="scope">
          <div class="assess-item" v-if="scope.row.u_content">
            <div>
              评价等级：<span>{{scope.row.evaluate | evaluateGrade}}</span>
            </div>
            <div>
              评分：<span>完成速度 {{scope.row.speed}}分 服务态度 {{scope.row.attitude}}分 工作质量 {{scope.row.quality}}分</span>
            </div>
            <div>评价内容：<span>{{scope.row.u_content}}</span></div>
            <div>评价时间：<span>{{scope.row.u_time}}</span></div>
            <div>
              是否显示：<span>{{scope.row.u_show | isShow}}</span>
              <el-button @click="handleShow(scope.$index,scope.row.id,1)" class="btn1" type="primary" size="mini"
                         v-if="scope.row.u_show==1">
                设置不显示
              </el-button>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="服务商对雇主的评价" min-width="280" align="center">
        <template slot-scope="scope">
          <div class="assess-item" v-if="scope.row.s_content">
            <div>
              评价等级：<span>{{scope.row.s_evaluate | evaluateGrade}}</span>
            </div>
            <div>
              评价内容：<span>{{scope.row.s_content}}</span>
            </div>
            <div>
              评价时间：<span>{{scope.row.s_time}}</span>
            </div>
            <div>
              是否显示：<span>{{scope.row.s_show | isShow}}</span>
              <el-button @click="handleShow(scope.$index,scope.row.id,2)" class="btn1" type="primary" size="mini"
                         v-if="scope.row.s_show==1">
                设置不显示
              </el-button>
            </div>
          </div>
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
    import {formatSearchTime} from '@/utils/date'
    import {evaluateGrades} from '@/utils/commonData'
    import {orderCommentList, orderCommentHide} from '@/api/oms'

    export default {
        name: "orderAssess",
        data() {
            return {
                gradeList: evaluateGrades,
                timeArray: [],
                total: 0,
                form: {
                    page: 1,
                    pageSize: 15,
                    evaluate: '',//	否	int	评价等级：1好评 2中评 3差评
                    order_sn: '',//	否	string	订单号
                    start_time: '',//	否	string	评价时间-起始
                    end_time: '',//	否	string	评价时间-结束
                },
                list: [],
            }
        },
        created() {
          const {order_sn = ''} = this.$route.query;
          if (order_sn) {
            this.form.order_sn = order_sn;
          }
            this.initData();
        },
        methods: {
            initData() {//初始化列表数据
                orderCommentList(this.form).then(res => {
                    const {data = [], total} = res
                    this.list = data
                    this.total = total
                }).catch(err => {
                    console.log(err)
                })
            },
            handleSearchList() { //搜索查询事件
                const [startTime, endTime] = formatSearchTime(this.timeArray);
                this.form.start_time = startTime;
                this.form.end_time = endTime;
                this.form.page = 1;
                this.initData()
            },
            isShowHttp(index, id, type) { //类型：1 雇主评价，2 服务商评价
                orderCommentHide(id, type).then(res => {
                    // let data = this.list[index]
                    // if (type === 1) {
                    //     data.u_show = 0;
                    // } else {
                    //     data.s_show = 0;
                    // }
                    // this.$set(this.list, index, data)
                    this.initData();
                }).catch(err => {
                    console.log(err)
                })
            },
            handleShow(index, id, type) { //设置不显示时间
                if (type === 2) {//雇主对服务商
                    this.isShowHttp(index, id, type)
                } else {  //服务商对雇主
                    this.isShowHttp(index, id, type)
                }
            },
            handleSizeChange(val) { //分页器：页大小变更
                this.form.page = 1;
                this.form.pageSize = val
                this.initData()
            },
            handlePageChange(val) { //分页器：页码变更
                this.form.page = val
                this.initData()
            }
        },
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .assess-item {
    text-align: left;
    padding-left: 5px;

    div {
      line-height: 30px;

      .btn1 {
        margin-left: 50px;
      }
    }
  }

</style>
