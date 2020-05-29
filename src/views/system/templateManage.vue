<template> 
  <el-container>
    <el-main>
      <el-form :inline="true" size="small" class="headerForm">
        <el-form-item label="模板类型">
          <el-select class="w_120"
                     v-model="form.type" clearable>
            <el-option
              v-for="item in templateTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开启状态">
          <el-select class="w_120"
                     v-model="form.is_open" clearable>
            <el-option
              v-for="item in openStates"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="timeArray"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="模板标题" v-model="form.title" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearchList()">搜索</el-button>
        </el-form-item>
        <el-form-item class="fr">
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加模板</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" border>
        <el-table-column prop="id" label="模板编号" min-width="100" align="center">
        </el-table-column>
        <el-table-column prop="title" label="模板标题" min-width="200" align="center"/>
        <el-table-column prop="created_at" label="创建时间" min-width="160" align="center">
        </el-table-column>
        <el-table-column label="是否开启" min-width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_open"
              @change="handleStatusChange(scope.row)"
              :active-value="1"
              :inactive-value="0">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="模板类型" min-width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.type |templateType}}
          </template>
        </el-table-column>
        <!--          fixed="right"-->
        <el-table-column label="操作" align="center" min-width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          :current-page="form.page"
          background
          :page-sizes="[10, 30, 50, 100]"
          :page-size="form.pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange">
        </el-pagination>
      </div>
    </el-main>
  </el-container>
</template>
<script>
  import {formatSearchTime} from '@/utils/date';
  import {templateList, templateShow, deleteTemplate} from '@/api/system/template';
  import {openState, templateType} from '@/utils/commonData'

  export default {
    name: 'Temmanage',
    data() {
      return {
        list: [],
        total: 0,
        templateTypes: templateType,
        openStates: openState,
        timeArray: [],
        selectId: '',
        form: {
          page: 1,
          pageSize: 10,
          type: '',//	否	int	模板类型：1线索模板，2任务模板
          is_open: '',//	否	int	开启状态：1开，0关
          created_at_start: '',//	否	int	创建时间1，时间戳
          created_at_end: '',//	否	int	创建时间2，时间戳
          title: '',//	否	string	模板标题:'',//
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      handleStatusChange(item) {//修改显示状态
        const {id, is_open} = item
        this.templateShowHttp(id, is_open)
      },
      handleSearchList() {
        const [startTime, endTime] = formatSearchTime(this.timeArray)
        this.form.created_at_start = startTime
        this.form.created_at_end = endTime
        this.form.page = 1;
        this.getList()
      },
      getList() {
        templateList(this.form).then((res) => {
          this.list = res.data
          this.total = res.meta.pagination.total
        }).catch((e) => {
          console.log(e)
        })
      },
      handleAdd() {
        this.selectId = '';
        this.$router.push('/system/templateAdd')
      },
      handleEdit(item) {
        const {title, content, type} = item
        this.selectId = item.id;
        localStorage.setItem('templateItem', JSON.stringify({title, content, type, id: item.id}))
        this.$router.push('/system/templateEdit')
      },
      handleDelete(id) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteTemplateHttp(id)
        }).catch(() => {
          this.$message({type: 'info', message: '已取消删除'});
        });
      },
      handlePageChange(val) {
        this.form.page = val;
        this.getList();
      },
      handleSizeChange(val) {
        this.form.page = 1;
        this.form.pageSize = val
        this.getList();
      },
      deleteTemplateHttp(id) {
        deleteTemplate(id).then(res => {
          if (res.code === 1) {
            this.$message({type: 'success', message: '删除成功!'});
            this.getList();//删除更新页面
          } else {
            this.$message({type: 'error', message: res.data});
          }
        }).catch((e) => {
          console.log(e)
        })
      },
      templateShowHttp(id, open) {
        templateShow(id, open).then(res => {
          if (res.code === 1) {
            this.$message({type: 'success', message: '状态修改成功!'});
          } else {
            this.$message({type: 'error', message: res.data});
          }
        }).catch((e) => {
           this.getList();
          console.log(e)
        })
      },
    }
  }

</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
