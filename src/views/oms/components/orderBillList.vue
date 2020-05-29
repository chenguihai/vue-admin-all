<template>
  <div>
    <el-form :inline="true" :model="form" size="small" class="headerForm">
      <el-form-item label="发票类型">
        <el-select class="w_150" v-model="form.invoice_type" placeholder="请选择" clearable>
          <el-option
            v-for="item in billList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select class="w_100" v-model="form.status" placeholder="请选择" clearable>
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请时间">
        <el-date-picker
          v-model="timeArray"
          type="daterange"
          range-separator="-"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="抬头名称">
        <el-input class="w_150" placeholder="抬头名称" v-model="form.company_name" clearable/>
      </el-form-item>
      <el-form-item label="收票人">
        <el-input class="w_150" placeholder="收票人" v-model="form.name" clearable/>
      </el-form-item>
      <el-form-item label="订单号">
        <el-input class="w_200" placeholder="订单号" v-model="form.order_sn" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearchList">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" border>
      <el-table-column prop="created_at" label="申请时间" width="100" align="center">
      </el-table-column>
      <el-table-column label="发票信息" min-width="500">
        <template slot-scope="scope">
          <div class="assess-item">
            <!--加了个type 1个人 2企业-->
            <div>抬头：<span>{{scope.row.company_name}}</span></div>
            <template v-if="scope.row.type === 2">
              <div v-if="scope.row.invoice_type ===1">纳税人识别号：<span>{{scope.row.taxpayer_id}}</span></div>
              <div v-else>
                <div>详细地址：<span>{{scope.row.registration_address}}</span></div>
                <div>联系电话：<span>{{scope.row.registration_phone}}</span></div>
                <div>开户银行：<span>{{scope.row.deposit_bank}}</span></div>
                <div>银行卡号：<span>{{scope.row.bank_account}}</span></div>
              </div>
            </template>
            <!--公共的部分-->
            <div>收票地址：<span>{{scope.row.address}}</span></div>
            <div>收票人：<span>{{scope.row.name}}</span><span>{{scope.row.phone}}</span></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="发票类型" min-width="120" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.invoice_type | invoiceType}}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票金额" min-width="100" align="center">
        <template slot-scope="scope">
          <span>￥{{scope.row.money}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单信息" min-width="260">
        <template slot-scope="scope">
          <div class="assess-item">
            <div>订单号：<span>{{scope.row.order_sn}}</span></div>
            <div>下单用户：<span>{{scope.row.nickname}}</span></div>
            <div>下单时间：<span>{{scope.row.order_time}}</span></div>
            <!--            formatTimeStamp-->
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.status | invoiceStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="this.form.type === 1" label="操作" fixed="right" min-width="100" align="center">
        <template slot-scope="scope" v-if="scope.row.status === 0">
          <el-button type="primary" size="mini" @click="openInvoice(scope.$index,scope.row.id)">开票
          </el-button>
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
        :page-sizes="[10,30,50]"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
    import {orderInvoiceList, invoicedById} from '@/api/oms'
    import {formatSearchTime} from '@/utils/date';

    export default {
        name: "orderBillList",
        props: ['types'],
        data() {
            return {
                billList: [
                    {
                        label: "全部",
                        value: ''
                    }, {
                        label: "增值税普通发票",
                        value: 1
                    }, {
                        label: "增值税专用发票",
                        value: 2
                    }],
                statusList: [
                    {
                        label: "全部",
                        value: ''
                    }, {
                        label: "待开票",
                        value: 0
                    }, {
                        label: "已开票",
                        value: 1
                    }
                ],
                timeArray: [],
                total: 0,
                form: {
                    page: 1,
                    pageSize: 10,
                    type: +this.types,//	是	int	1服务商，2雇主
                    invoice_type: '',//	否	int	发票类型：1普通，2增值税
                    status: '',//	否	int	0待开票，1已开票
                    start_time: '',//	否	string	申请时间-起始
                    end_time: '',//	否	string	申请时间-结束
                    company_name: '',//	否	string	抬头名称
                    name: '',//	否	string	收票人
                    order_sn: '',//	否	string	订单号
                },
                list: [],
            }
        },
        created() {
          // const {order_sn = ''} = this.$route.query;
          // if (order_sn) {
          //   this.form.order_sn = order_sn;
          // }
            this.getAllList();
        },
        methods: {
            handleSearchList() {//搜索查询事件
                this.getAllList();
            },
            openInvoice(index, id) {//开票
                this.invoicedByIdHttp(index, id);
            },
            handleSizeChange(val) { //分页器：页大小变更
                this.form.pageSize = val
                this.getAllList()
            },
            handlePageChange(val) { //分页器：页码变更
                this.form.page = val
                this.getAllList()
            },
            getAllList() {
                const [startTime, endTime] = formatSearchTime(this.timeArray);
                let data = JSON.parse(JSON.stringify(this.form))
                data.start_time = startTime;
                data.end_time = endTime;
                delete data.type
                orderInvoiceList(data, this.form.type).then(res => {
                    const {data = [], total, per_page} = res
                    this.list = data
                    this.total = total
                    this.form.pageSize = +per_page
                }).catch(err => {
                    console.log(err)
                })
            },
            invoicedByIdHttp(index, id) {
                invoicedById(id).then(res => {
                    if (res.code === 1) {
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                        let data = this.list[index]
                        data.status = 1
                        this.$set(this.list, index, data)
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

<style scoped>

</style>
