<template>
  <div class="app-container">
    <el-form :inline="true" :model="form" size="small" class="headerForm">
      <el-form-item>
        <el-input class="w_150" placeholder="操作项" v-model="form.title" clearable />
      </el-form-item>
      <el-form-item>
        <el-input class="w_150" placeholder="敏感词" v-model="form.word" clearable />
      </el-form-item>
      <el-form-item>
        <el-input class="w_150" placeholder="用户id" v-model="form.user_id" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="isLoading" @click="handleSearchList">查询</el-button>
      </el-form-item>
    </el-form>
    <!--表格-->
    <el-table :data="list" border>
      <el-table-column prop="id" label="编号" min-width="100" align="center" />
      <el-table-column prop="user_id" label="用户id" min-width="100" align="center" />
      <el-table-column prop="title" label="操作项" min-width="160" align="center" />
      <el-table-column prop="word" label="提交敏感词" min-width="160" align="center"/>
      <el-table-column prop="ip" label="操作IP" min-width="140" align="center" />
      <el-table-column prop="created_at" label="操作时间" min-width="160" align="center" />
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
import { formatSearchTime } from "@/utils/date";
import { requestWords } from "@/api/power/log";

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
        pageSize: 20,
        title: "", //	否	string	操作项
        word: "", //	否	string	敏感词
        user_id: "" //	否	int	用户id
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
      requestWords(this.form)
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

</style>
