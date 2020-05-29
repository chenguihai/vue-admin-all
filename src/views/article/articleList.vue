<template>
  <div class="app-container">
    <el-form :inline="true" :model="form" size="small" class="headerForm">
      <el-form-item label="文章分类">
        <el-cascader v-model="form.cate_id"
                     :options="cateList"
                     :props="{ checkStrictly: true }"
                     expandTrigger="hover"
                     clearable>
        </el-cascader>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-date-picker
          v-model="timeArray"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="标题"
          v-model="form.title"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input class="w_150"
                  placeholder="作者"
                  v-model="form.author"
                  clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearchList">搜索</el-button>
      </el-form-item>
      <el-form-item class="fr">
        <el-button type="primary" @click="handleAdd">发布文章</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" v-loading="listLoading" border>
      <el-table-column prop="id" label="ID" min-width="100" align="center">
      </el-table-column>
      <el-table-column label="分类名称" min-width="180" align="center">
        <template slot-scope="scope">{{scope.row.article_cate && scope.row.article_cate.name}}</template>
      </el-table-column>
      <el-table-column prop="title" label="标题" min-width="250" align="center">
      </el-table-column>
      <el-table-column label="封面" width="130" align="center">
        <template slot-scope="scope">
          <preview-pictures :key="scope.row.id" :href="scope.row.cover"/>
        </template>
      </el-table-column>
      <el-table-column prop="keyword" label="关键字" min-width="180" align="center">
      </el-table-column>
      <el-table-column prop="author" label="作者" min-width="120" align="center">
      </el-table-column>
      <el-table-column prop="sort" label="排序" min-width="80" align="center">
      </el-table-column>
      <el-table-column prop="created_at" label="发布时间" width="100" align="center">
      </el-table-column>
      <el-table-column label="状态" width="100" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_show"
            @change="handleStatusChange(scope.row)"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="150" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.id)">删除</el-button>
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
  </div>
</template>
<script>
  import {formatSearchTime} from "@/utils/date";
  import {articleList, deleteArticle, articleShow, articleCateCut} from "@/api/article";

  export default {
    name: "articleList",
    data() {
      return {
        timeArray: [],
        selectId: 0,
        form: {
          page: 1,
          pageSize: 10,
          cate_id: '',//	否	int	文章分类id
          title: '',//	否	string	文章标题
          author: '',//	否	int	作者
          start_time: '',//	否	timestamp	发布时间 开始
          end_time: ''//	否	timestamp	发布时间 结束
        },
        list: [],
        total: 4,
        listLoading: false,
        cateList: []
      };
    },
    created() {
      this.getAllList();
      let cate = localStorage.getItem('cateList');
      if (cate) {
        this.cateList = JSON.parse(cate);
      } else {
        this.articleCateCutHttp()
      }
    },
    methods: {
      handleSearchList() {//搜索文章
        this.form.page = 1;
        this.getAllList();
      },
      handleAdd() { //发布文章
        this.selectId = '';
        this.$router.push('/article/articleAdd')
      },
      handleEdit(row) {//查看详情
        const {cate_id, id} = row
        let value = this.getCateIdArr(cate_id);
        this.selectId = id;
        localStorage.setItem('articleItem', JSON.stringify({...row, cate_id: value}))
        this.$router.push('/article/articleEdit')
      },
      getCateIdArr(cate_id) {
        let item = [], subItem = [], cat1 = 0, cat2 = 0, cat3 = 0;
        for (let i = 0; i < this.cateList.length; i++) {
          cat1 = this.cateList[i].value
          if (cat1 === cate_id) {
            return [cat1]
          }
          item = this.cateList[i].children;
          if (item) {
            for (let j = 0; j < item.length; j++) {
              cat2 = item[j].value
              if (cat2 === cate_id) {
                return [cat1, cat2]
              }
              subItem = item[j].children;
              if (subItem) {
                for (let k = 0; k < subItem.length; k++) {
                  cat3 = subItem[k].value
                  if (cat3 === cate_id) {
                    return [cat1, cat2, cat3]
                  }
                }
              }
            }
          }
        }
      },
      handleDelete(index, id) {
        this.selectId = id
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteArticleHttp()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleSizeChange(val) {
        this.form.page = 1;
        this.form.pageSize = val;
        this.getAllList();
      },
      handleCurrentChange(val) {
        this.form.page = val;
        this.getAllList();
      },
      getAllList() {
        this.listLoading = true;
        const [startTime, endTime] = formatSearchTime(this.timeArray);
        let data = JSON.parse(JSON.stringify(this.form))
        data.start_time = startTime;
        data.end_time = endTime;
        data.cate_id = data.cate_id ? data.cate_id.pop() : ''
        articleList(data).then(res => {
          this.list = res.data;
          this.total = res.total;
        }).catch(err => {
          console.log(err)
        }).finally(()=> this.listLoading = false)
      },
      articleCateCutHttp() {
        articleCateCut().then(res => {
          this.cateList = res;
          localStorage.setItem('cateList', JSON.stringify(res));
        }).catch(err => {
          console.log(err)
        })
      },
      deleteArticleHttp() {
        deleteArticle(this.selectId).then(res => {
          if (res.code === 1) {
            this.getAllList();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!'
            });
          }
        }).catch(err => {
          console.log(err)
        })
      },
      articleShowHttp(id, show) { //是否显示：0否，1是
        articleShow(id, show).then(res => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
          } else {
            this.$message({
              type: 'error',
              message: '操作失败!'
            });
          }
        }).catch(err => {
           this.getAllList();
        })
      },
      handleStatusChange(row) {  //修改展示状态
        this.articleShowHttp(row.id, row.is_show)
      },
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>