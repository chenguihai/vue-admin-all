<template>
  <el-container>
    <el-main>
      <el-form :inline="true" size="small">
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加服务标签</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" border>
        <el-table-column prop="id" label="ID" min-width="100" align="center" />
        <el-table-column prop="tag_name" label="服务标签名称" min-width="180" align="center" />
        <el-table-column label="服务标签图" min-width="130" align="center">
          <template slot-scope="scope">
            <preview-pictures :key="scope.row.id" :href="scope.row.tag_img" />
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" min-width="100" align="center" />
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
      <!-- 添加/编辑服务标签 -->
      <add-service-label
        v-if="dialogFlag"
        :title="dialogTitle"
        :item="selectItem"
        @submit="emitSubmit"
        @close="emitClose"
      ></add-service-label>
      <!--      <common-form v-if="dialogFlag" :list="formItem" :title="dialogTitle" :item="selectItem" @submit="emitSubmit" @close="emitClose"></common-form>-->
    </el-main>
  </el-container>
</template>
<script>
import {
  deleteItem,
  listItem,
  addItem,
  editItem
} from "@/api/system/serviceLabel";
import AddServiceLabel from "./components/addServiceLabel";
import commonForm from "@/components/Common/commonForm";

export default {
  name: "serviceLabel",
  components: { AddServiceLabel, commonForm },
  data() {
    return {
      list: [],
      total: 0,
      dialogTitle: "添加服务标签",
      dialogFlag: false,
      selectId: 0,
      selectItem: {},
       form: {
        page: 1,
        pageSize: 10
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
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
      listItem()
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
      this.dialogTitle = "添加服务标签";
      this.selectId = 0;
      this.selectItem = {};
    },
    handleEdit(row) {
      this.dialogFlag = true;
      this.dialogTitle = "编辑服务标签";
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
      editItem(this.selectId, params)
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
      addItem(params)
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
      deleteItem(id)
        .then(res => {
          if (res.code === 1) {
            this.$message({ type: "success", message: "删除成功!" });
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
