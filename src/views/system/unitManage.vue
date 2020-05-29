<template>
  <el-container>
    <el-main>
      <el-form :inline="true" size="small">
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加单位</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" border>
        <el-table-column prop="id" label="ID" width="180" align="center" />
        <el-table-column prop="unit_name" label="单位名称" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="total,prev, pager, next,jumper"
          :current-page.sync="page"
          :page-size="pageSize"
          :total="total"
        ></el-pagination>
      </div>
      <!-- 添加/编辑单位 -->
      <add-unit
        v-if="dialogFlag"
        :title="dialogTitle"
        :item="selectItem"
        @emitSubmit="_handleSubmit"
        @emitClose="_handleClose"
      ></add-unit>
    </el-main>
  </el-container>
</template>
<script>
import {
  deleteUnit,
  unitList,
  addUnit,
  editUnit
} from "@/api/system/unitManage";
import AddUnit from "./components/addUnit";

export default {
  name: "unitManage",
  components: { AddUnit },
  data() {
    return {
      page: 1,
      pageSize: 10,
      list: [],
      total: 0,
      dialogTitle: "添加单位",
      dialogFlag: false,
      selectId: 0,
      selectItem: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleCurrentChange(val) {
      // 分页器：页码变更
      this.page = val;
      this.getList();
    },
    getList() {
      unitList(this.page)
        .then(res => {
          const { data, total } = res;
          this.list = data;
          this.total = total;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleAdd() {
      this.dialogFlag = true;
      this.dialogTitle = "添加单位";
      this.selectId = 0;
      this.selectItem = {};
    },
    handleEdit(row) {
      this.dialogFlag = true;
      this.dialogTitle = "编辑单位";
      this.selectId = row.id;
      this.selectItem = row;
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteUnitHttp(row.id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    _handleClose() {
      //emit
      this.dialogFlag = false;
    },
    _handleSubmit(item) {
      //emit
      if (this.selectId === 0) {
        this.addUnitHttp(item);
      } else {
        this.editUnitHttp(item);
      }
    },
    editUnitHttp(params) {
      editUnit(this.selectId, params)
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
    addUnitHttp(params) {
      addUnit(params)
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
    deleteUnitHttp(id) {
      deleteUnit(id)
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
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
