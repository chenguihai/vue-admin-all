<template> 
  <el-container>
    <el-main>
      <div class="accountBox">
        <span class="number">{{account}}元</span>
        <span class="type">累计提现</span>
      </div>
      <el-form :inline="true" size="small" class="headerForm">
        <el-form-item label="提现类型">
          <el-select class="w_100"
                     v-model="form.type" clearable>
            <el-option
              v-for="item in cashOutTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请时间">
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
          <el-input placeholder="店铺名称" v-model="form.store_name" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearchList">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" border>
        <el-table-column prop="created_at" label="申请时间" width="100" align="center"/>
        <el-table-column label="提现类型" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.type | cashOutType}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" min-width="180" label="申请用户名称" align="center"/>
        <el-table-column prop="store_name" label="申请店铺名称" min-width="150" align="center"/>
        <el-table-column label="提现金额" min-width="120" align="center">
          <template slot-scope="scope">
            ￥{{scope.row.money}}
          </template>
        </el-table-column>
        <el-table-column prop="bank_number" label="银行卡" min-width="170px" align="center"/>
        <el-table-column prop="branch" label="开户支行名称" min-width="170px" align="center"/>
        <el-table-column prop="name" label="开户名" min-width="120px" align="center"/>
        <el-table-column prop="bank_name" label="开户行" min-width="120px" align="center"/>
        <el-table-column label="状态" width="100px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.status | examineStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="提现说明" min-width="200px" align="center"/>
        <el-table-column prop="pay_time" label="打款时间" width="100px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.pay_time | splitSpaceF}}</span>
          </template>
        </el-table-column>
        <el-table-column label="打款凭证" min-width="200px" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.pay_proof}}</div>
            <a v-if="!!scope.row.pay_img" class="link" target="_blank" :href="scope.row.pay_img | imgPrefixF"
               download>查看凭证附件</a>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="210px" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.status ===1">
              <el-button @click="handleExamine(scope.$index,scope.row.id,1)" size="mini">审核通过
              </el-button>
              <el-button @click="handleExamine(scope.$index,scope.row.id,2)" size="mini">审核未通过
              </el-button>
            </div>
            <el-button v-if="scope.row.status ===3" @click="submitPay(scope.$index,scope.row.id)" type="primary"
                       size="mini">确认打款
            </el-button>
          </template>
        </el-table-column>
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
      <confirm-pay v-if="confirmPayFlag" @emitSubmit="_handleEmitSubmit" @emitClose="_handleEmitClose"/>
      <refusal-reasons
        v-if="refusalFlag"
        @emitSubmit="_handleEmitRefusal"
        @emitClose="_handleEmitClose"
      />
    </el-main>
  </el-container>
</template>
<script>
  import {formatSearchTime} from '@/utils/date';
  import {cashOutList, cashCheck, cashPay} from '@/api/pms';
  import ConfirmPay from './components/confirmPay';
  import RefusalReasons from '@/components/RefusalReasons';

  export default {
    name: 'cashOut',
    components: {ConfirmPay, RefusalReasons},
    data() {
      return {
        account: '',//可用保证金
        timeArray: [],
        list: [],
        confirmPayFlag: false,
        refusalFlag: false,
        selectId: 0,
        selectIndex: 0,
        cashOutTypes: [
          {label: '全部', value: ''},
          {label: '余额', value: 1},
          {label: '保证金', value: 2},
          {label: '代付', value: 3},
        ],

        total: 0,
        form: {
          page: 1,
          pageSize: 10,
          type: '',//	否	int	提现类型：1 余额 2 保证金
          nickname: '',//	否	string	用户昵称
          store_name: '',//	否	string	店铺名称
          start_time: '',//	否	string	申请时间-起始
          end_time: '',//	否	string	申请时间-结束
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
      handlePageChange(val) {
        this.form.page = val;
        this.getList();
      },
      handleSizeChange(val) {
        this.form.page = 1;
        this.form.pageSize = val;
        this.getList();
      },
      handleExamine(index, id, type) {
        this.selectId = id;
        this.selectIndex = index;
        if (type === 1) {
          this.cashCheckHttp()
        } else {
          this.refusalFlag = true
        }
      },
      submitPay(index, id) {
        this.selectId = id
        this.selectIndex = index
        this.confirmPayFlag = true
      },
      _handleEmitSubmit(params) {
        this.cashPayHttp(params)
      },
      _handleEmitRefusal(reason) {
        this.cashCheckHttp(2, reason);
      },
      _handleEmitClose() {
        this.confirmPayFlag = false
        this.refusalFlag = false
      },
      getList() {
        cashOutList(this.form).then((res) => {
          const {account = 0, list: {data = [], total = 0}} = res
          this.account = account;
          this.list = data;
          this.total = total;
        }).catch((err) => {
          console.log(err)
        })
      },
      cashCheckHttp(type = 1, reason = '') {
        let params = {
          id: this.selectId,//	是	int	资金提现id
          status: type,//	是	string	审核状态：1审核成功，2审核失败
          reason: reason,//	否	string	审核失败原因
        }
        cashCheck(params).then((res) => {
          if (res.code === 1) {
            this.$message.success('审核成功')
            this._handleEmitClose()
            this.getList();
            // let data = this.list[this.selectIndex]
            // data.status = type === 1 ? 3 : 2
            // this.$set(this.list, this.selectIndex, data)
          } else {
            this.$message.error(res.data)
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      cashPayHttp(params) {
        cashPay({...params, id: this.selectId}).then((res) => {
          if (res.code === 1) {
            this.$message.success('审核成功')
            this._handleEmitClose()
            this.getList();
            // let data = this.list[this.selectIndex]
            // data.status = 4
            // this.$set(this.list, this.selectIndex, data)
          } else {
            this.$message.error(res.data)
          }
        }).catch((err) => {
          console.log(err)
        })
      },
    }
  }

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .link {
    color: #409EFF;
    margin: 0 10px;
  }
</style>
