<template>
  <div class="app-container">
    <el-form :inline="true" :model="form" size="small" class="headerForm">
      <el-form-item label="举报时间">
        <el-date-picker
          v-model="timeArray"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="举报类型">
        <el-select v-model="form.tip_offs_type" placeholder="全部" clearable>
          <el-option label="全部" value=""/>
          <el-option v-for="item in typeList" :key="item.id" :label="item.type" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="处理状态">
        <el-select class="w_100" v-model="form.status" placeholder="请选择" clearable>
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input class="w_150" v-model="form.active_name" placeholder="举报人" clearable/>
      </el-form-item>
      <el-form-item>
        <el-input class="w_150" placeholder="被举报人" v-model="form.passive_name" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearchList">搜索</el-button>
      </el-form-item>
    </el-form>
    <!--表格-->
    <el-table :data="list" border>
      <el-table-column prop="created_at" label="举报时间" width="100" align="center"/>
      <el-table-column prop="type" label="举报类型" min-width="120" align="center"/>
      <el-table-column prop="nick_name" label="举报人" min-width="100" align="center"/>
      <el-table-column prop="passive_name" label="被举报人" min-width="100" align="center"/>
      <el-table-column label="被举报人店铺" min-width="120" align="center">
        <template slot-scope="scope">{{scope.row.store_name ||'无'}}</template>
      </el-table-column>
      <el-table-column prop="project_name" label="举报项目" min-width="160" align="center"/>
      <el-table-column label="举报原因描述" min-width="400" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.description }}</div>
          <a class="jump" v-for="(item,index) in scope.row.proof_imgs.split(',')" :key="index"
             :href="item | previewPicture"
             target="_blank">附件{{index}}</a>
        </template>
      </el-table-column>
      <el-table-column label="处理状态" min-width="150" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | tagType" size="mini">
            {{scope.row.status | reportState}}
          </el-tag>
          <popover-cpn v-if="scope.row.status ===2" :key="scope.row.id" :reason="scope.row.reason"></popover-cpn>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="180" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.status === 0">
            <el-button type="text" size="mini" @click="handleExamine(scope.row.id,1)">审核通过</el-button>
            <el-button type="text" size="mini" @click="handleExamine(scope.row.id,2)">审核不通过</el-button>
          </template>
          <!--do_status '处理状态：0未处理，1已处理',-->
          <template v-else-if="scope.row.status === 1 && scope.row.do_status ===0">
            <!--1 用户，2 店铺，3 线索，4 服务，5 客户示例，6 案例，7 传记，8 上刊图片，9 上刊视频-->
            <el-button size="mini"
                       @click="handleDetail(scope.row.id,scope.row.project_type)">{{btnList[scope.row.project_type]}}
            </el-button>
          </template>
          <el-button type="text" size="mini" @click="showDelete(scope.row.id)">删除</el-button>
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
        :page-sizes="[20,40,60]"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 审核未通过弹窗 -->
    <audit-fail v-if="examineFlag" @emitSubmit="emitSubmit" @emitClose="emitClose"></audit-fail>
  </div>
</template>
<script>
  import PopoverCpn from "@/components/PopoverCpn";
  import AuditFail from "@/components/AuditFail";
  import {formatSearchTime} from '@/utils/date';
  import {reportState} from '@/utils/commonData';
  import {tipOff, tipOffType, tipOffCheck, tipOffDo, tipOffDel} from '@/api/help/report';
  import {getTipOffType} from '@/api/common';

  export default {
    name: "reportManage",
    components: {PopoverCpn, AuditFail},
    data() {
      return {
        statusList: reportState,
        timeArray: [],
        total: 0,
        examineFlag: false,
        selectId: 0,
        form: {
          page: 1,
          pageSize: 20,
          tip_offs_type: '',//	否	int	举报类型id
          active_name: '',//	否	string	举报人
          passive_name: '',//	否	string	被举报人
          status: '',//	否	int 处理状态：0 待审核，1 审核通过，2 审核未通过
          start_time: '',//	否	string	举报时间-起始
          end_time: '',//	否	string	举报时间-结束
        },
        btnList: ['', '禁用用户', '关闭店铺', '关闭线索', '下架服务', '下架客户示例', '下架案例', '下架传记', '下架上刊图片', '下架上刊视频'],
        list: [],
        typeList: [],
      }
    },
    created() {
      this.getList();
      this.tipOffTypeHttp();
    },
    methods: {
      handleExamine(id, type) {
        this.selectId = id;
        if (type === 1) {
          this.tipOffCheckHttp(type);
        } else {
          this.examineFlag = true;
        }
      },
      handleDetail(id, type) {
        this.selectId = id;
        this.tipOffDoHttp(type);
      },
      handleSearchList() {//搜索查询事件
        const [startTime, endTime] = formatSearchTime(this.timeArray);
        this.form.start_time = startTime;
        this.form.end_time = endTime;
        this.form.page = 1;
        this.getList()
      },
      handleSizeChange(val) { //分页器：页大小变更
        this.form.page = 1;
        this.form.pageSize = val;
        this.getList()
      },
      handlePageChange(val) { //分页器：页码变更
        this.form.page = val
        this.getList()
      },
      emitClose() { // emit
        this.examineFlag = false;
      },
      emitSubmit(failNote) { //emit
        this.tipOffCheckHttp(2, failNote);
      },
      getList() {
        tipOff(this.form).then(res => {
          const {data = [], total} = res
          this.list = data
          this.total = total
        }).catch(err => {
          console.log(err)
        })
      },
      showDelete(id) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteHttp(id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      deleteHttp(id) {
        tipOffDel(id).then(res => {
          if (res.code === 1) {
            this.messageCommon();
            this.getList();
          } else {
            this.messageCommon(1);
          }
        }).catch(err => {
          console.log(err)
        })
      },
      messageCommon(type = 0) {
        if (type === 0) {
          this.$message({type: 'success', message: '操作成功!'});
        } else {
          this.$message({type: 'error', message: '操作失败!'});
        }
      },
      tipOffTypeHttp() {
        getTipOffType().then(res => {
          if (res.code === 1) {
            this.typeList = res.data;
          }
        }).catch(err => {
          console.log(err)
        })
      },
      tipOffCheckHttp(status = 0, reason = '') {
        let params = {
          id: this.selectId,//	是	int	举报id
          status: status,//	是	int	处理状态：0待审核，1审核通过，2审核未通过
        }
        if (reason) {
          params.reason = reason//	否	string	审核失败原因
        }
        tipOffCheck(params).then(res => {
          if (res.code === 1) {
            this.getList();
            this.messageCommon();
          } else {
            this.messageCommon(1);
          }
          this.emitClose()
        }).catch(err => {
          console.log(err)
        })
      },
      tipOffDoHttp(type = 0) {
        let params = {
          id: this.selectId,//	是	int	举报id
          type: type,//	是	int	1用户，2店铺，3线索，4服务，5客户示例，6案例，7传记，8上刊图片，9上刊视频
        }
        tipOffDo(params).then(res => {
          if (res.code === 0) {
            this.messageCommon();
            this.getList();
          } else {
            this.messageCommon(1);
          }
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../styles/mixin.scss";

  .oneRow {
    text-align: center;
    @include ellipsis();
  }

  .twoRow {
    @include ellipsis(2);
  }

  .refuseReason {
    color: #f00;
    @include ellipsis();
  }

  .jump {
    color: #409EFF;
    display: inline-block;
    margin-right: 10px;
  }

  .link {
    color: #409EFF;
    margin: 0 10px;
  }
</style>
