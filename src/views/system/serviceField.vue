<template>
  <el-container>
    <el-main>
      <el-button
        class="mb_10"
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="handleAdd"
      >添加领域</el-button>
      <el-table :data="list" border>
        <el-table-column prop="id" label="ID" width="180" align="center"></el-table-column>
        <el-table-column prop="sr_name" label="领域" align="center"></el-table-column>
        <el-table-column prop="sort" label="排序" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加/编辑领域 -->
      <add-field
        v-if="dialogFlag"
        :title="dialogTitle"
        :item="selectItem"
        @emitSubmit="_handleSubmit"
        @emitClose="_handleClose"
      ></add-field>
    </el-main>
  </el-container>
</template>
<script>
import {
  deleteField,
  serviceRealm,
  addField,
  editField
} from "@/api/system/serviceField";
import AddField from "./components/addField";

export default {
  name: "serviceField",
  components: { AddField },
  data() {
    return {
      list: [],
      total: 0,
      dialogTitle: "添加服务领域",
      dialogFlag: false,
      selectId: 0,
      selectItem: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      serviceRealm()
        .then(res => {
          this.list = res ||[];
        })
        .catch(err => {
          console.log(err);
        });
    },

    handleSearchList() {
      this.getList();
    },
    handleAdd() {
      this.dialogFlag = true;
      this.dialogTitle = "添加领域";
      this.selectId = 0;
      this.selectItem = {};
    },
    handleEdit(row) {
      this.dialogFlag = true;
      this.dialogTitle = "编辑领域";
      this.selectId = row.id;
      this.selectItem = row;
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteFieldHttp(id);
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消删除" });
        });
    },
    _handleClose() {
      //emit
      this.dialogFlag = false;
    },
    _handleSubmit(item) {
      //emit
      if (this.selectId === 0) {
        this.addFieldHttp(item);
      } else {
        this.editFieldHttp(item);
      }
    },
    editFieldHttp(params) {
      editField(this.selectId, params)
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
          console.log(err);
        });
    },
    addFieldHttp(params) {
      addField(params)
        .then(res => {
          if (res.code === 1) {
            this.$message({ type: "success", message: "添加成功!" });
            this._handleClose();
            this.getList(); //删除更新页面
          } else {
            this.$message.error(res.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteFieldHttp(id) {
      deleteField(id)
        .then(res => {
          if (res.code === 1) {
            this.$message({ type: "success", message: "删除成功!" });
            this._handleClose();
            this.getList(); //删除更新页面
          } else {
            this.$message.error(res.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
