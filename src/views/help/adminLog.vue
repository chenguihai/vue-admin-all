<template>
  <div class="app-container">
      <!-- 
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
     -->
    <!--表格-->
    <el-table :data="list" border>
      <el-table-column prop="username" label="用户名" min-width="120" align="center"/>
      <el-table-column prop="route" label="模块" min-width="100" align="center"/>
       <el-table-column prop="action" label="动作" min-width="100" align="center"/>
      <el-table-column prop="method" label="请求方式" min-width="100" align="center"/>
      <el-table-column  prop="params" label="内容" min-width="120" align="center"/>
      <el-table-column  prop="ua" label="用户客户端" min-width="120" align="center"/>
      <el-table-column  prop="ip" label="IP" min-width="120" align="center"/>
      <el-table-column  prop="created_at" label="操作时间" min-width="120" align="center"/>
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
  </div>
</template>
<script>
  import {formatSearchTime} from '@/utils/date';
  import {reportState} from '@/utils/commonData';
  import {getAdminLog} from '@/api/help/report';

  export default {
    name: "reportManage",
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
    //   this.tipOffTypeHttp();
    },
    methods: {
    /**
      handleSearchList() {//搜索查询事件
        const [startTime, endTime] = formatSearchTime(this.timeArray);
        this.form.start_time = startTime;
        this.form.end_time = endTime;
        this.form.page = 1;
        this.getList()
      },
       */
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
        getAdminLog().then(res => {
          const {data = [], total} = res
          this.list = data
          this.total = total
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
    }
  }

</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
