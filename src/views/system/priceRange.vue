<template>
  <el-container>
    <el-main>
      <el-form :inline="true" size="small">
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加价格区间</el-button>
        </el-form-item>
      </el-form>
      <el-table v-if="list.length > 0" :data="list" border>
        <el-table-column prop="id" label="ID" min-width="100" align="center" />
        <el-table-column prop="cate_name" label="所属分类" min-width="120" align="center" />
        <el-table-column prop="min_price" label="价格下限值" min-width="120" align="center" />
        <el-table-column prop="max_price" label="价格上限值" min-width="120" align="center" />
        <el-table-column prop="show_info" label="前端显示" min-width="120" align="center" />
        <el-table-column prop="sort" label="排序" min-width="80" align="center" />
        <el-table-column label="操作" fixed="right" align="center" width="160">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row,scope.$index)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id,scope.$index)">删除</el-button>
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
      <!-- 添加/编辑举报类型 -->
      <add-price-range
        v-if="dialogFlag"
        :title="dialogTitle"
        :item="selectItem"
        :cate="cateList"
        @submit="emitSubmit"
        @close="emitClose"
      ></add-price-range>
    </el-main>
  </el-container>
</template>
<script>
import { deleteReq, listReq, addReq, editReq } from "@/api/system/priceRange";
import { serviceCat } from "@/api/common";
import AddPriceRange from "./components/addPriceRange";

export default {
  name: "priceRange",
  components: { AddPriceRange },
  data() {
    return {
      list: [],
      total: 0,
      dialogTitle: "添加价格区间",
      dialogFlag: false,
      selectId: 0,
      selectIndex: 0,
      selectItem: {},
      cateList: [],
      filterList: [],
        form: {
        page: 1,
        pageSize: 10
      }
    };
  },
  async created() {
    await this.getCateHttp();
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
      listReq(this.form)
        .then(res => {
          const { data = [], total = 0 } = res;
          // for (let i = 0; i < data.length; i++) {
          //   data[i].cate_name = this.filterList[data[i].id];
          // }
          this.list = data;
          this.total = total;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleAdd() {
      this.dialogFlag = true;
      this.dialogTitle = "添加价格区间";
      this.selectId = 0;
      this.selectItem = {};
    },
    handleEdit(row, index) {
      this.dialogFlag = true;
      this.dialogTitle = "编辑价格区间";
      this.selectId = row.id;
      this.selectIndex = index;
      this.selectItem = row;
    },
    handleDelete(id, index) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteHttp(id, index);
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
      editReq(this.selectId, params)
        .then(res => {
          if (res.code === 1) {
            this.$message({ type: "success", message: "编辑成功!" });
            this.emitClose();
            // const { cat_id, min_price, max_price, show_info, sort } = params;
            // let index = this.selectIndex,
            //   data = this.list[index];
            // data.cat_id = cat_id;
            // data.min_price = min_price;
            // data.max_price = max_price;
            // data.show_info = show_info;
            // data.sort = sort;
            // this.$set(this.list, index, data);
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
      addReq(params)
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
    getCateHttp() {
      serviceCat(0)
        .then(res => {
          if (res.code === 1) {
            // let data = {};
            // this.filterList = res.data.map(item => {
            //   return (data[item.id] = item.cate_name);
            // });
            this.cateList = res.data;
          } else {
            this.$message.error(res.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteHttp(id, index) {
      deleteReq(id)
        .then(res => {
          if (res.code === 1) {
            this.$message({ type: "success", message: "删除成功!" });
            this.list.splice(index, 1);
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
