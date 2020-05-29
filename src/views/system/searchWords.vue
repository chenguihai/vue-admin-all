<template> 
  <el-container>
    <el-main>
      <el-form :inline="true" :model="form" size="small" class="headerForm">
        <el-form-item label="热词名称">
          <el-input class="w_150" placeholder="热词名称" v-model="form.keyword" clearable/>
        </el-form-item>
        <el-form-item label="类型">
          <el-select class="w_100" v-model="form.type" placeholder="请选择" clearable>
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchList">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加搜索热词</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" border>
        <el-table-column prop="id" label="ID" min-width="100" align="center"/>
        <el-table-column prop="keyword" label="热词名称" min-width="160" align="center"/>
        <el-table-column label="类型" min-width="100" align="center">
          <template slot-scope="scope">
            {{scope.row.type | hotWordF}}
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" min-width="100" align="center"/>
        <el-table-column label="操作" align="center" min-width="160" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          :current-page="form.page"
          background
          :page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next, jumper"
          @current-change="handlePageChange">
        </el-pagination>
      </div>
      <!-- 添加/编辑搜索热词 -->
      <add-hotword v-if="dialogFlag" :title="dialogTitle" :item="selectItem" @submit="emitSubmit"
                   @close="emitClose"></add-hotword>
    </el-main>
  </el-container>
</template>
<script>
  import {keyword, addKeyword, editKeyword, deleteKeyword} from '@/api/system/searchWords';
  import AddHotword from './components/addHotword'

  export default {
    name: 'searchWords',
    components: {AddHotword},
    data() {
      return {
        list: [],
        total: 0,
        pageSize: 0,
        dialogTitle: "添加搜索热词",
        dialogFlag: false,
        selectId: 0,
        selectItem: {},
        typeList: [ //类型：1服务，2店铺，3线索，4任务，5其他
          {label: "全部", value: ''},
          {label: "服务", value: 1},
          {label: "店铺", value: 2},
          {label: "线索", value: 3},
          {label: "任务", value: 4},
          {label: "其他", value: 5},
        ],
        form: {
          page: 1,
          keyword: '',
          type: '',
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      handlePageChange(val) {
        this.form.page = val;
        this.getList();
      },
      searchList() {
        this.form.page = 1;
        this.getList();
      },
      getList() {
        keyword(this.form).then((res) => {
            const {data = [], total = 0, per_page = 0} = res
            this.list = data;
            this.total = total;
            this.pageSize = per_page;
        }).catch((err) => {
          console.log(err)
        })
      },
      handleAdd() {
        this.dialogFlag = true;
        this.dialogTitle = "添加搜索热词";
        this.selectId = 0;
        this.selectItem = {};
      },
      handleEdit(row) {
        this.dialogFlag = true;
        this.dialogTitle = "编辑搜索热词";
        this.selectId = row.id;
        this.selectItem = row;
      },
      handleDelete(id) {
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
      emitClose() { //emit
        this.dialogFlag = false
      },
      emitSubmit(item) { //emit
        if (this.selectId === 0) {
          this.addHttp(item);
        } else {
          this.editHttp(item);
        }
      },
      editHttp(params) {
        editKeyword(this.selectId, params).then((res) => {
          if (res.code === 1) {
            this.$message({type: 'success', message: '编辑成功!'});
            this.emitClose();
            this.getList();//删除更新页面
          } else {
            this.$message.error(res.data);
          }

        }).catch((err) => {
          console.log(err)
        })
      },
      addHttp(params) {
        addKeyword(params).then((res) => {
          if (res.code === 1) {
            this.$message({type: 'success', message: '添加成功!'});
            this.emitClose();
            this.getList();//删除更新页面
          } else {
            this.$message.error(res.data);
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      deleteHttp(id) {
        deleteKeyword(id).then(res => {
          if (res.code === 1) {
            this.$message({type: 'success', message: '删除成功!'});
            this.getList();//删除更新页面
          } else {
            this.$message.error(res.data);
          }
        }).catch((e) => {
          console.log(err)
        })
      }
    }
  }

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
