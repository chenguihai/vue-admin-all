<template> 
  <div class="app-container">
    <el-form :inline="true" :model="form" size="small">
      <el-form-item label="资质类型">
        <el-select
          v-model="form.type" clearable>
          <el-option
            v-for="item in aptitudeType"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="提交时间">
        <div class="block">
          <el-date-picker
            v-model="timeArray"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="form.status" clearable>
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="店铺名称"
          v-model="form.store_name"
          clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearchList">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" border>
      <el-table-column prop="id" label="ID" min-width="100" align="center"/>
      <el-table-column prop="store_name" label="店铺名称" min-width="180" align="center"/>
      <el-table-column label="资质类型" min-width="130" align="center">
        <template slot-scope="scope">{{scope.row.type_id | aptitudeType}}</template>
      </el-table-column>
      <el-table-column label="代理时间" min-width="180" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type_id !== 0">
          <span>{{scope.row.begin_time|splitSpaceF}}</span>&nbsp;-&nbsp;<span>{{scope.row.end_time|splitSpaceF}}</span>
            </span>
          <span v-else>—</span>
        </template>
      </el-table-column>
      <el-table-column label="资质图片" width="460" align="center">
        <template slot-scope="scope">
          <ul class="annex">
            <li v-for="(item,index) in [scope.row.img1,scope.row.img2,scope.row.img3].filter(item=>item)" :key="index">
              <preview-pictures :href="item"/>
            </li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="提交时间" width="180" align="center"/>
      <el-table-column label="状态" min-width="180" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | tagType" size="mini">{{scope.row.status | auditStatus}}</el-tag>
          <popover-cpn v-if="scope.row.status ===-1" :key="scope.row.id" :reason="scope.row.remarks"></popover-cpn>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="220">
        <template slot-scope="scope">
          <div class="mb_10" v-if="scope.row.status==0">
            <el-button @click="auditSuccess(scope.$index,scope.row.id)" size="mini">审核通过</el-button>
            <el-button @click="auditFail(scope.$index,scope.row.id)" size="mini">审核未通过</el-button>
          </div>
          <el-button size="mini" type="text" @click="handleViewDetail(scope.$index, scope.row)">详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="form.page"
        :page-size="form.pageSize"
        :page-sizes="[15,30,50]"
        :total="total">
      </el-pagination>
    </div>

    <!-- 审核未通过弹窗 -->
    <audit-fail v-if="auditFailFlag" @emitSubmit="handleSubmit" @emitClose="handleClose"></audit-fail>
  </div>
</template>
<script>
  import {formatSearchTime} from '@/utils/date';
  import {aptitudeType, statusList} from '@/utils/commonData';
  import AuditFail from '@/components/AuditFail';
  import PopoverCpn from "@/components/PopoverCpn";
  import {mediaAptitudeList, mediaAptitudeReviewById} from '@/api/shop/index';

  export default {
    name: 'mediaQua',
    components: {AuditFail, PopoverCpn},
    data() {
      return {
        timeArray: [],
        form: {
          page: 1,
          pageSize: 15,
          type: '',//	否	int	资质类型：0直营 1一级代理 2二级代理 3其他
          start_time: '',//	否	int	提交时间-开始
          end_time: '',//	否	int	提交时间-结束
          status: '',//	否	int	状态：0待审核 1审核通过 -1审核未通过
          store_name: '',//	否	string	店铺名称
        },
        param: { //审核参数
          id: 0,
          auditType: 0, //1 审核通过 0 审核未通过
          failNote: ''//失败的原因
        },
        total: 0,
        list: [],
        selectIndex: 0,
        auditFailFlag: false,
        aptitudeType: aptitudeType,
        statusList: statusList
      }
    },
    created() {
      this.getAllList();
    },
    methods: {
      auditSuccess(index, id) {    //审核通过
        this.selectIndex = index;
        this.param = {
          id: id,
          auditType: 1, //1 审核通过 0 审核未通过
          failNote: ''//失败的原因
        }
        this.mediaAptitudeReviewByIdHttp()
      },
      auditFail(index, id) { //审核未通过
        this.selectIndex = index;
        this.param = {
          id: id,
          auditType: 0, //1 审核通过 0 审核未通过
          failNote: ''//失败的原因
        }
        this.auditFailFlag = true;
      },
      handleSearchList() {
        const [startTime, endTime] = formatSearchTime(this.timeArray);
        this.form.start_time = startTime;
        this.form.end_time = endTime;
        this.form.page = 1;
        this.getAllList();
      },
      //查看详情
      handleViewDetail(index, row) {
        //type_id  1  个人店铺  2 企业店铺'  store_status 0 -1 未入驻 ， 1 -2已入驻
        if (row.type_id == 1) {//个人
          if (row.store_status == 0 || row.store_status == -1) {
            //入驻申请个人店铺详情
            this.$router.push({path: '/Shopconduct/ShopDetail', query: {id: row.store_id, type: 'first'}})
          } else {
            //已入驻店铺个人店铺详情
            this.$router.push({
              path: '/Shopconduct/beenShopDetail',
              query: {id: row.store_id, type: 'first'}
            })
          }
        } else {//企业
          if (row.store_status == 0 || row.store_status == -1) {
            //入驻申请企业店铺详情
            this.$router.push({
              path: '/Shopconduct/companyDetail',
              query: {id: row.store_id, type: 'first'}
            })
          } else {
            //已入驻店铺企业店铺详情
            this.$router.push({
              path: '/Shopconduct/beencompanyDetail',
              query: {id: row.store_id, type: 'first'}
            })
          }
        }
      },
      getAllList() {
        mediaAptitudeList(this.form).then(res => {
          const {data = [], total = 0} = res
          this.list = data
          this.total = total
        }).catch(err => {
          console.log(err)
        })
      },
      mediaAptitudeReviewByIdHttp() {
        const {id, auditType, failNote} = this.param;
        mediaAptitudeReviewById({fail_note: failNote}, id, auditType).then(res => {
          if (res.code === 1) {
            this.$message({type: 'success', message: '操作成功!'});
            this.handleClose()
            let data = this.list[this.selectIndex];
            if (auditType === 0) { //未通过
              data.remarks = failNote;
              data.status = -1;
            } else {
              data.status = 1;
            }
            this.$set(this.list, this.selectIndex, data)
          } else {
            this.$message({type: 'error', message: res.data});
          }
        }).catch(err => {
          console.log(err)
        })
      },
      handleSizeChange(val) {
        this.form.page = 1;
        this.form.pageSize = val;
        this.getAllList();
      },
      handleCurrentChange(val) {
        this.form.page = val;
        this.getAllList();
      },
      handleClose() { //emit 表单关闭时事件
        this.auditFailFlag = false
      },
      handleSubmit(failNote) { //emit
        this.param.failNote = failNote
        this.mediaAptitudeReviewByIdHttp()
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>

