<template>
  <div class="app-container">
    <el-form :inline="true" size="small" class="headerForm">
      <!-- <el-form-item label="序号">
        <el-input class="w_120" placeholder v-model="form.id" clearable />
      </el-form-item> -->
      <el-form-item label="账号">
        <el-input class="w_140" placeholder v-model="form.username" clearable />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input class="w_140" placeholder v-model="form.name" clearable />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input class="w_140" placeholder v-model="form.phone" clearable />
      </el-form-item>
      <el-form-item label="角色">
        <el-select class="w_150" v-model="form.role_id" clearable>
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.role_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearchList" :loading="isLoading">查询</el-button>
      </el-form-item>
      <el-form-item class="fr">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border>
      <el-table-column prop="id" label="序号" min-width="80" align="center" />
      <el-table-column prop="username" label="账号" min-width="140" align="center" />
      <el-table-column prop="name" label="姓名" min-width="130" align="center"/>
      <el-table-column label="所属角色" min-width="160" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.role.map(item=>item.role_name).toString()}}</span>    
          </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号" min-width="110" align="center" />
      <el-table-column label="是否启用" width="100" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            @change="handleStatusChange(scope.row)"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
    <!-- 添加/编辑品牌 -->
    <add-managers
      v-if="dialogFlag"
      :title="dialogTitle"
      :item="selectItem"
      :list="roleList"
      @close="_handleClose"
      @submit="_handleSubmit"
    ></add-managers>
  </div>
</template>
<script>
import {
  managersList,managersDelete,managersEdit,managersAdd,managersStatus
} from "@/api/power/managers";
import AddManagers from "./components/addManagers";

export default {
  name: "brandManage",
  components: { AddManagers },
  data() {
    return {
      cateList1: [], //一级分类
      cateList2: [], //页面检索二级分类
      selectId: 0,
      selectIndex: 0,
      selectItem: {},
      form: {
        page: 1,
        pageSize: 10,
        // id:'',//序号
        username:'',//	否	string	账号
        name:'',//	否	string	姓名
        phone:'',//	否	string	手机号
        role_id:'',//	否	int	角色id
      },
      tableData: [],
      roleList:[],
      total: 0,
      dialogTitle: "添加管理员角色",
      dialogFlag: false,
      isLoading:true
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
       this.isLoading = true;
      managersList(this.form)
        .then(res => {
          const {
            role = [],
            admin: { data = [],total=0 }
          } = res;
          this.tableData = data;
          this.roleList = role
          this.total = total;
            
        })
        .catch(err => {
        }).finally(()=>this.isLoading = false);
    },
    //修改展示状态
    handleStatusChange(row) {
      managersStatus(row.id,row.status).then(res => {
        if (res.code === 1) {
          this.$message({ message: "状态修改成功", type: "success" });
        } else {
          this.$message.error(res.data);
        }
      }).catch((err)=>{
         this.getList();
      });
    },
    handleSearchList() {
      this.form.page = 1;
      this.getList();
    },
    handleAdd() {
      this.dialogFlag = true;
      this.dialogTitle = "添加管理员角色";
      this.selectId = 0;
      this.selectItem = {};
    },
    handleEdit(index, row) {
      this.dialogFlag = true;
      this.dialogTitle = "编辑管理员角色";
      this.selectIndex = index;
      this.selectItem = row;
      this.selectId = row.id;
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除该数据，是否继续？", "删除管理员提示", {
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
      managersEdit(this.selectId, params)
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
      managersAdd(params)
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
      managersDelete(id)
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
