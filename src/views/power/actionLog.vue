<template>
  <div class="app-container">
    <el-form :inline="true" :model="form" size="small" class="headerForm">
      <el-form-item label="操作时间">
        <el-date-picker
          v-model="timeArray"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-input class="w_150" v-model="form.username" placeholder="账号" clearable />
      </el-form-item>
      <el-form-item>
        <el-input class="w_150" placeholder="姓名" v-model="form.name" clearable />
      </el-form-item>
      <el-form-item>
        <el-input class="w_150" placeholder="操作模块" v-model="form.module" clearable />
      </el-form-item>
      <el-form-item label="结果">
        <el-select class="w_100" v-model="form.result" clearable>
          <el-option value label="全部"></el-option>
          <el-option
            v-for="item in openState"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="isLoading" @click="handleSearchList">查询</el-button>
      </el-form-item>
    </el-form>
    <!--表格-->
    <el-table :data="list" border>
      <el-table-column prop="id" label="序号" min-width="100" align="center" />
      <el-table-column prop="username" label="账号" min-width="100" align="center" />
      <el-table-column prop="name" label="姓名" min-width="100" align="center" />
      <el-table-column prop="module" label="操作模块" min-width="120" align="center" />
      <el-table-column prop="action" label="操作类型" min-width="100" align="center" />
      <el-table-column prop="target" label="操作目标id" min-width="100" align="center" />
      <el-table-column prop="content" label="操作目标内容" min-width="160" align="center" />
      <el-table-column label="操作结果" min-width="100" align="center">
        <template slot-scope="scope">
          <span style="cursor: pointer;">{{scope.row.result===1?'成功':'失败'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ip" label="操作IP" width="130" align="center" />
      <el-table-column prop="created_at" label="操作时间" width="160" align="center" />
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
import { formatSearchTime } from "@/utils/date";
import { requestLog } from "@/api/power/log";

export default {
  name: "reportManage",
  data() {
    return {
      timeArray: [],
      total: 0,
      examineFlag: false,
      selectId: 0,
      openState: [
        { label: "成功", value: 1 },
        { label: "失败", value: 0 }
      ],
      form: {
        page: 1,
        pageSize: 15,
        username: "", //	否	string	账号
        name: "", //	否	string	姓名
        start_time: "", //	否	string	操作时间-开始
        end_time: "", //	否	string	操作时间-结束
        module: "", //	否	string	操作模块
        result: "" //	否	string	结果：0失败，1成功
      },
      list: [],
      isLoading: true
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleSearchList() {
      //搜索查询事件
      const [startTime, endTime] = formatSearchTime(this.timeArray);
      this.form.start_time = startTime;
      this.form.end_time = endTime;
      this.form.page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      //分页器：页大小变更
      this.form.page = 1;
      this.form.pageSize = val;
      this.getList();
    },
    handlePageChange(val) {
      //分页器：页码变更
      this.form.page = val;
      this.getList();
    },
    emitClose() {
      // emit
      this.examineFlag = false;
    },
    emitSubmit(failNote) {
      //emit
      this.tipOffCheckHttp(2, failNote);
    },
    getList() {
      this.isLoading = true;
      requestLog(this.form)
        .then(res => {
          const { data = [], total } = res;
          this.list = data;
          this.total = total;
        })
        .catch(err => {
          this.list = [];
          this.total = 0;
        })
        .finally(() => (this.isLoading = false));
    },
    messageCommon(type = 0) {
      if (type === 0) {
        this.$message({ type: "success", message: "操作成功!" });
      } else {
        this.$message({ type: "error", message: "操作失败!" });
      }
    }
  }
};
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
  color: #409eff;
  display: inline-block;
  margin-right: 10px;
}

.link {
  color: #409eff;
  margin: 0 10px;
}
</style>
