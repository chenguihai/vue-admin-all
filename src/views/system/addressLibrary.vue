<template> 
  <div class="app-container">
    <el-form :inline="true" size="small" class="headerForm">
      <el-form-item label="地址编码">
        <el-input placeholder="地址编码" v-model="form.id" clearable/>
      </el-form-item>
      <el-form-item label="地址名称">
        <el-input placeholder="地址名称" v-model="form.name" clearable/>
      </el-form-item>
      <el-form-item label="级别">
        <el-select class="w_100" v-model="form.level" clearable>
          <el-option
            v-for="item in levelList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="区号" v-model="form.citycode" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearchList">搜索</el-button>
      </el-form-item>
      <el-form-item class="fr">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border>
      <el-table-column prop="id" label="地址编码" min-width="80" align="center"/>
      <el-table-column min-width="140" prop="name" label="地址名称" align="center"/>
      <el-table-column prop="shortname" label="地址简称" min-width="100" align="center"/>
      <el-table-column prop="leveltype" label="级别" min-width="100" align="center">
        <template slot-scope="scope">
          {{scope.row.leveltype | levelTypeF}}
        </template>
      </el-table-column>
      <el-table-column prop="citycode" label="区号" min-width="100" align="center"/>
      <el-table-column prop="pinyin" label="拼音" min-width="160" align="center"/>
      <el-table-column label="是否显示" width="100" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            @change="handleStatusChange(scope.row)"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150" align="center">
        <template slot-scope="scope">
          <el-button size="mini"
                     @click="handleEdit(scope.$index, scope.row)">修改
          </el-button>
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
        :total="total">
      </el-pagination>
    </div>
    <!-- 添加/编辑地址库 -->
    <add-address v-if="dialogFlag" :title="dialogTitle" :item="selectItem" @close="emitClose"
                 @submit="emitSubmit"></add-address>
  </div>
</template>
<script>
  import {serveList, editserve, addserve, statusServe} from '@/api/system/addressLibrary';
  import AddAddress from './components/addAddressLibrary';
  import {levelState} from '@/utils/commonData';

  export default {
    name: 'addressLibrary',
    components: {AddAddress},
    data() {
      return {
        levelList: levelState,
        selectId: 0,
        selectIndex: 0,
        selectItem: {},
        form: {
          page: 1,
          pageSize: 10,
          id: '',//	否	int	地址编码
          name: '',//	否	string	地址名称
          level: '',//否	int	级别
          citycode: '',//	否	string	区号
        },
        tableData: [],
        total: 0,
        dialogTitle: "添加地址",
        dialogFlag: false,
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        serveList(this.form).then(res => {
          const {data = [], total = 0} = res
          this.tableData = data
          this.total = total;
        }).catch(err => {
          console.log(err) // 这里catch到错误timeout
        })
      },
      //修改展示状态
      handleStatusChange(row) {
        statusServe(row.id, row.status).then(res => {
          if (res.code === 1) {
            this.$message({message: '状态修改成功', type: 'success'});
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
        this.dialogTitle = "添加地址";
        this.selectId = 0;
        this.selectItem = {};
      },
      handleEdit(index, row) {
        this.dialogFlag = true;
        this.dialogTitle = "编辑地址";
        this.selectIndex = index;
        this.selectItem = row;
        this.selectId = row.id;
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
      emitClose() {
        this.dialogFlag = false
      },
      emitSubmit(params) {
        if (this.selectId > 0) {
          this.editHttp(params);
        } else {
          this.addHttp(params);
        }
      },
      editHttp(params) {
        editserve(this.selectId, params).then((res) => {
          if (res.code === 1) {
            this.$message({type: 'success', message: '编辑成功!'});
            this.emitClose()
            this.getList();//删除更新页面
          } else {
            this.$message.error(res.data)
          }
        }).catch((err) => {
          this.$message.error(err.data)
        })
      },
      addHttp(params) {
        addserve(params).then(res => {
          if (res.code === 1) {
            this.$message({message: '新增成功', type: 'success'});
            this.emitClose()
            this.getList();//更新页面
          } else {
            this.$message.error(res.data);
          }
        }).catch(err => {
          this.$message.error(err.data)
        })
      },
    }
  }

</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
