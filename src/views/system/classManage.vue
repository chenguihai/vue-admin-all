<template>
  <div class="app-container">
    <el-header style="height:40px; padding:0;">
      <el-form :inline="true" size="small">
        <el-form-item>
          <el-input placeholder="类目关键字" v-model="form.cname" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearchList">搜索</el-button>
        </el-form-item>
        <el-form-item class="fr">
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加类目</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-table
      :data="list"
      row-key="id"
      border
      :default-expand-all="false"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="cate_name" label="分类名称" min-width="200"></el-table-column>
      <!--      <el-table-column prop="description" label="内容数量" width="100" align="center"></el-table-column>-->
      <el-table-column prop="keyword" label="首页导航栏显示规则" min-width="100" align="center">
        <template slot-scope="scope">{{scope.row.index_nav_show | statusFilter}}</template>
      </el-table-column>
      <el-table-column prop="index_nav_sort" label="排序" min-width="80" align="center"></el-table-column>
      <el-table-column prop="keyword" label="首页楼层导航显示规则" min-width="100" align="center">
        <template slot-scope="scope">{{scope.row.index_nav_show | floorFilter}}</template>
      </el-table-column>
      <el-table-column prop="floor_nav_sort" label="排序" min-width="80" align="center"></el-table-column>
      <el-table-column label="首页需求大厅展示" min-width="90" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.class ===1">
             <el-switch
               v-model="scope.row.index_needs_show"
               @change="handleStatusChange(scope.row.id,scope.row.index_needs_show)"
               :active-value="1"
               :inactive-value="0">
          </el-switch>
          </span>
          <span v-else>—</span>
        </template>
      </el-table-column>
      <el-table-column prop="index_needs_sort" label="排序" min-width="80" align="center"></el-table-column>
      <el-table-column label="技术费率" min-width="100" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.class ===3">{{scope.row.tech_rate}}%</span>
          <span v-else>—</span>
        </template>
      </el-table-column>
      <el-table-column label="企业/个人保证金" min-width="180" align="center">
        <template slot-scope="scope">
          <span
            v-if="scope.row.class ===1">￥{{scope.row.min_deposit_enterprise}}/{{scope.row.min_deposit_personal}}</span>
          <span v-else>—</span>
        </template>
      </el-table-column>
      <!--      is_settle 是否开启结算申请：0关闭，1开启-->
      <el-table-column label="是否需要结算申请" min-width="100" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.class ===1">
                      <el-switch
                        v-model="scope.row.is_settle"
                        @change="handleSettleStatus(scope.row.id,scope.row.is_settle)"
                        :active-value="1"
                        :inactive-value="0">
          </el-switch>
          </span>
          <span v-else>—</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="280">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button v-if="scope.row.class < 3" size="mini"
                     @click="handleAddClass(scope.$index, scope.row)">新增下级
          </el-button>
          <el-button v-if="scope.row.class===1" size="mini"
                     @click="handleadver">设置广告图
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 一级 -->
    <add-class v-if="classifyFlag" :title="dialogTitle" :item="selectItem"
               @close="handleClose" @submit="handleSubmit"/>
    <!-- 二级 -->
    <add-class-two v-if="twoFlag" :title="dialogTitle" :item="selectItem" :options="options"
                   @close="handleClose" @submit="handleSubmit"/>
    <!-- 三级 -->
    <add-class-three v-if="threeFlag" :title="dialogTitle" :item="selectItem" :options="options"
                     @close="handleClose" @submit="handleSubmit"/>
  </div>
</template>
<script>
  import {edittype, typeList, addmanage, editstatus, catecut, settleStatus} from '@/api/system/typemanage';

  import AddClass from './components/addClass'
  import AddClassTwo from './components/addClassTwo'
  import AddClassThree from './components/addClassThree'

  export default {
    name: 'classManage',
    components: {AddClass, AddClassTwo, AddClassThree},
    data() {
      return {
        total: 0,
        dialogTitle: "添加分类",
        classifyFlag: false,
        twoFlag: false,
        threeFlag: false,
        selectId: '',
        selectItem: [],
        list: [],
        cateList: [],
        form: {
          cname: ''
        },
        keyArr: [],
        options: [],
        isLoading:false
      }
    },
   async created() {
     await this.getList();
     await this.gettype();
    },
    methods: {
      handleSubmit(params) {//      //添加、编辑一级分类
        if (params.id) {//编辑
          this.edittypeHttp(params);
        } else {//新增
          this.addmanageHttp(params);
        }
      },
      edittypeHttp(params) {
        edittype(params.id, params).then((res) => {
          if (res.code === 0) {
            this.$message.error(res.data);
            return
          }
          this.$message({type: 'success', message: '编辑成功!'});
          this.handleClose();
          this.getList();//编辑更新页面
        }).catch((err) => {
          console.log(err)
        })
      },
      addmanageHttp(params) {
        addmanage(params).then(res => {
          if (res.code === 0) {
            this.$message.error(res.data);
            return
          }
          this.$message({type: 'success', message: '添加成功!'});
          this.handleClose();
          this.getList();//新增更新页面
        }).catch((err) => {
          console.log(err)
        })
      },
      handleadver(row) {//设置广告图事件
        this.$router.push({path: '/system/advertisement'})
      },
      handleSearchList() {
        this.getList();
      },
      getList() {
        if(this.isLoading){return}
        this.isLoading = true;
        typeList(this.form).then(res => {
          this.list = res.data;
          this.keyArr = [res.data[0].id]
        }).catch(err => {
          console.log(err)
        }).finally(() => (this.isLoading = false));
      },
      handleStatusChange(id, show) { //修改展示状态
        let param = {id, show};
        editstatus(param).then(res => {
           if (res.code === 1) {
            this.$message({ message: '状态修改成功', type: 'success' });
          } else {
            this.$message({type: 'error', message: res.data});
          }
        }).catch((err)=>{
          this.getList();
        });
      },
      handleSettleStatus(id, status) { //是否开启结算申请
        settleStatus(id, status).then(res => {
          if (res.code === 1) {
            this.$message({ message: '状态修改成功', type: 'success' });
          } else {
            this.$message({type: 'error', message: res.data});
          }
        }).catch((err)=>{
          this.getList();
        });
      },
      handleEdit(index, row) { //三级分类编辑
        let title = ''
        if (row.class === 1) {
          title = '编辑一级分类';
          this.classifyFlag = true;
        } else if (row.class === 2) {
          title = '编辑二级分类';
          this.twoFlag = true;
        } else {
          title = '编辑三级分类';
          this.threeFlag = true;
        }
        this.dialogTitle = title;
        this.selectItem = row;
      },
      handleAddClass(index, row) {
        let title = '';
        if (row.class === 1) {
          title = '新增二级分类';
          this.twoFlag = true;
          this.selectItem = {pid: row.id};
        } else if (row.class === 2) {
          title = '新增三级分类';
          this.threeFlag = true;
          this.selectItem = {pid: row.id, newPid: row.pid};
        }
        this.dialogTitle = title;
      },
      handleAdd() {
        this.classifyFlag = true;
        this.dialogTitle = '添加一级分类';
        this.selectItem = {};
      },
      handleClose() { //emit 表单关闭时事件
        this.classifyFlag = false;
        this.twoFlag = false;
        this.threeFlag = false;
        this.selectItem = {};
      },
      gettype() {//初始化分类数据
        catecut().then((result) => {
          this.options = result;
          this.options.splice(0, 0, {value: 0, label: '顶级分类'});
        }).catch((err) => {
          console.log(err)
        })
      },
    },
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
