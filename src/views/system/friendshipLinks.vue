<template>
  <el-container>
    <el-main>
      <el-form :inline="true" size="small">
        <el-form-item label="友情链接名称">
          <el-input class="w_150" placeholder="友情链接名称" v-model="form.blogroll_name" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearchList">搜索</el-button>
        </el-form-item>
        <el-form-item class="fr">
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加友情链接</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" border>
        <el-table-column prop="id" label="ID" min-width="130" align="center" />
        <el-table-column prop="blogroll_name" label="友情链接名称" min-width="250" align="center" />
        <el-table-column prop="sort" label="排序" min-width="120" align="center" />
        <el-table-column label="是否显示" min-width="120" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_show"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="180" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
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
          :page-sizes="[10,30,50]"
          :total="total"
        ></el-pagination>
      </div>
      <!-- 添加/编辑友情链接 -->
      <add-friendship-link
        v-if="dialogFlag"
        :title="dialogTitle"
        :item="selectItem"
        @submit="emitSubmit"
        @close="emitClose"
      ></add-friendship-link>
    </el-main>
  </el-container>
</template>
<script>
import {
  requestList,
  requestDelete,
  requestAdd,
  requestEdit,
  requestShow
} from "@/api/system/friendshipLink";
import AddFriendshipLink from "./components/addFriendshipLink";

export default {
  name: "pictureLabel",
  components: { AddFriendshipLink },
  data() {
    return {
      list: [],
      total: 0,
      dialogTitle: "添加友情链接",
      dialogFlag: false,
      selectId: 0,
      selectItem: {},
      form: {
        page: 1,
        pageSize: 10,
        blogroll_name: ""
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleSearchList() {
      this.form.page = 1;
      this.getList();
    },
    handleCurrentChange(val) {
      this.form.page = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.form.page = 1;
      this.form.pageSize = val;
      this.getList();
    },
    getList() {
      requestList(this.form)
        .then(res => {
          const { data = [], total = 0 } = res;
          this.list = data;
          this.total = total;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleAdd() {
      this.dialogFlag = true;
      this.dialogTitle = "添加友情链接";
      this.selectId = 0;
      this.selectItem = {};
    },
    handleEdit(row) {
      console.log(row);
      this.dialogFlag = true;
      this.dialogTitle = "编辑友情链接";
      this.selectId = row.id;
      this.selectItem = row;
    },
    handleStatusChange(item) {
      //修改显示状态
      const { id, is_show } = item;
      this.showHttp(id, is_show);
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteHttp(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    emitClose() {
      //emit
      this.dialogFlag = false;
    },
    emitSubmit(item) {
      //emit
      if (this.selectId === 0) {
        this.addHttp(item);
      } else {
        this.editHttp(item);
      }
    },
    editHttp(params) {
      requestEdit(this.selectId, params)
        .then(res => {
          if (res.code === 1) {
            this.$message({ type: "success", message: "编辑成功!" });
            this.emitClose();
            this.getList(); //删除更新页面
          } else {
            this.$message.error(res.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    addHttp(params) {
      requestAdd(params)
        .then(res => {
          if (res.code === 1) {
            this.$message({ type: "success", message: "添加成功!" });
            this.emitClose();
            this.getList(); //删除更新页面
          } else {
            this.$message.error(res.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteHttp(id) {
      requestDelete(id)
        .then(res => {
          if (res.code === 1) {
            this.$message({ type: "success", message: "删除成功!" });
            this.getList(); //删除更新页面
          } else {
            this.$message.error(res.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    showHttp(id, open) {
      requestShow(id, open)
        .then(res => {
          if (res.code === 1) {
            this.$message({ type: "success", message: "状态修改成功!" });
          } else {
            this.$message({ type: "error", message: res.data });
          }
        })
        .catch(e => {
          this.getList();
          console.log(e);
        });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
