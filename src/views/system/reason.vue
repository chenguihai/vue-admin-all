<template> 
  <el-container>
    <el-main>
      <el-form :inline="true" size="small">
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加退款原因</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border>
        <el-table-column prop="id" label="ID" min-width="120" align="center"/>
        <el-table-column prop="reason" label="类型" align="center" min-width="180">
          <template slot-scope="scope">{{scope.row.type | reasonTypeF }}</template>
        </el-table-column>
        <el-table-column prop="reason" label="退款原因" align="center" min-width="300"/>
        <el-table-column prop="sort" label="排序" align="center" min-width="100"/>
        <el-table-column label="操作" align="center" min-width="160">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加/编辑退款原因 -->
      <refund-reason v-if="showFlag" :title="dialogTitle" :item="selectItem"
                     @submit="_handleSubmit"
                     @close="_handleClose"></refund-reason>
    </el-main>
  </el-container>
</template>
<script>
  import {deletereason, reasonList, addreason, editreason} from '@/api/system/reason';
  import RefundReason from "./components/refundReason";

  export default {
    name: 'reason',
    components: {RefundReason},
    data() {
      return {
        tableData: [],
        total: 0,
        selectId: 0,
        selectItem: {},
        dialogTitle: "添加服务领域",
        showFlag: false,
      }
    },
    created() {
      this.getList();
    },
    methods: {
      _handleClose() { //emit
        this.showFlag = false
      },
      _handleSubmit(params) { //emit
        if (this.selectId === 0) {
          this.addHttp(params);
        } else {
          this.editHttp(params);
        }
      },
      getList() {
        reasonList().then((result) => {
          this.tableData = result.data
        }).catch((err) => {
          console.log(err)
        })
      },
      handleAdd() {
        this.showFlag = true;
        this.dialogTitle = "添加退款原因";
        this.selectId = 0;
        this.selectItem = {}
      },
      handleEdit(row) {
        this.showFlag = true;
        this.dialogTitle = "编辑退款原因";
        this.selectId = row.id;
        this.selectItem = row
      },
      editHttp(params) {//编辑领域
        editreason(this.selectId, params).then(res => {
          if (res.code === 1) {
            this.$message({type: 'success', message: '编辑成功!'});
            this._handleClose();
            this.getList();//删除更新页面
          } else {
            this.$message({type: "error", message: res.data});
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      addHttp(params) {// //添加领域
        addreason(params).then(res => {
          if (res.code === 1) {
            this.$message({type: 'success', message: '添加成功!'});
            this._handleClose();
            this.getList();//删除更新页面
          } else {
            this.$message({type: "error", message: res.data});
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      handleDelete(id) {
        this.selectId = id;
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteHttp();
        }).catch(() => {
          this.$message({type: 'info', message: '已取消删除'});
        });
      },
      deleteHttp() {
        deletereason(this.selectId).then(res => {
          if (res.code === 1) {
            this.$message({type: 'success', message: '删除成功!'});
            this._handleClose();
            this.getList();//删除更新页面
          } else {
            this.$message({type: "error", message: res.data});
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
