<template>
  <div class="app-container">
    <el-form :inline="true" size="small" class="headerForm">
      <el-form-item>
        <el-input placeholder="角色名称" v-model="form.role_name" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="isLoading" @click="handleSearchList">查询</el-button>
      </el-form-item>
      <el-form-item class="fr">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border>
      <el-table-column prop="role_name" label="角色名称" min-width="80" align="center" />
      <el-table-column prop="description" label="角色描述" min-width="140" align="center" />
      <el-table-column label="是否启用" min-width="100" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            @change="handleStatusChange(scope.row,scope.$index)"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="250" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="setPower(scope.row)">设置权限</el-button>
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
    <!-- 添加/编辑品牌 -->
    <add-role
      v-if="dialogFlag"
      :title="dialogTitle"
      :item="selectItem"
      @emitClose="_handleClose"
      @emitSubmit="_handleSubmit"
    ></add-role>
  </div>
</template>
<script>
import {
  requestList,
  requestDelete,
  requestEdit,
  requestAdd,
  requestStatus
} from "@/api/power/role";
import AddRole from "./components/addRole";

export default {
  name: "roleManage",
  components: { AddRole },
  data() {
    return {
      selectId: 0,
      selectIndex: 0,
      selectItem: {},
      form: {
        page: 1,
        pageSize: 10,
        role_name: "" //	否	string	角色名称
      },
      tableData: [],
      total: 0,
      dialogTitle: "新增角色",
      dialogFlag: false,
      isLoading: true
    };
  },
  created() {
    this.getList();
  },
  methods: {
    setPower(item) {
      sessionStorage.setItem("role", JSON.stringify(item));
      this.$router.push("/power/roleSet");
    },
    getList() {
      this.isLoading = true;
      requestList(this.form)
        .then(res => {
          const { data = [], total = 0 } = res;
          this.tableData = data;
          this.total = total;
        })
        .catch(err => {
          console.log(err); // 这里catch到错误timeout
        })
        .finally(() => (this.isLoading = false));
    },
    //修改展示状态
    handleStatusChange(row, index) {
      requestStatus(row.id, row.status)
        .then(res => {
          if (res.code === 1) {
            let item = this.tableData[index];
            item.status = row.status;
            this.$set(this.tableData, index, item);
            this.$message({ message: "状态修改成功", type: "success" });
          } else {
            this.$message.error(res.data);
          }
        })
        .catch(err => {
          this.getList();
        });
    },
    handleSearchList() {
      this.form.page = 1;
      this.getList();
    },
    handleAdd() {
      this.dialogFlag = true;
      this.dialogTitle = "新增角色";
      this.selectId = 0;
      this.selectItem = {};
    },
    handleEdit(index, row) {
      this.dialogFlag = true;
      this.dialogTitle = "编辑角色";
      this.selectIndex = index;
      this.selectItem = row;
      this.selectId = row.id;
    },
    handleDelete(item) {
      // console.log(JSON.parse(JSON.stringify(item)));

      const { status, id } = item;
      let content =
        status === 1
          ? "请先不启用当前角色，才可以删除该角色哦。"
          : "删除角色，将会使该角色下所有用户权限权限消失是否继续？";
      this.$confirm(content, "删除角色提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          console.log('点击了，确定');
          if (status === 0) {
              console.log('点击了，确定，执行了删除函数');
            this.deleteHttp(id);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
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
    _handleClose() {
      this.dialogFlag = false;
    },
    _handleSubmit(params) {
      if (this.selectId > 0) {
        this.editHttp(params);
      } else {
        this.addHttp(params);
      }
    },
    editHttp(params) {
      requestEdit(this.selectId, params)
        .then(res => {
          if (res.code === 1) {
            this.$message({ type: "success", message: "编辑成功!" });
            this._handleClose();
            this.getList(); //删除更新页面
          } else {
            this.$message.error(res.data);
          }
        })
        .catch(err => {
          this.$message.error(err.data);
        });
    },
    addHttp(params) {
      requestAdd(params)
        .then(res => {
          if (res.code === 1) {
            this.$message({ message: "新增成功", type: "success" });
            this._handleClose();
            this.getList(); //更新页面
          } else {
            this.$message.error(res.data);
          }
        })
        .catch(err => {
          this.$message.error(err.data);
        });
    },
    deleteHttp(id) {
      requestDelete(id)
        .then(res => {
          if (res.code === 1) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getList(); //删除更新页面
          } else {
            this.$message.error(res.data);
          }
        })
        .catch(e => {
          console.log(err);
        });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
