<template>
  <div class="app-container">
    <el-button class="mb_20" type="primary" icon="el-icon-plus" @click="handleAdd" size="small">添加分类</el-button>
    <el-table
      :data="list"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="name" label="分类名称" min-width="200"></el-table-column>
      <el-table-column prop="description" label="分类描述" min-width="180"></el-table-column>
      <el-table-column prop="keyword" label="关键字" min-width="180"></el-table-column>
      <el-table-column prop="sort" label="排序" min-width="100" align="center"></el-table-column>
      <el-table-column label="状态" min-width="100" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_show"
            @change="handleStatusChange(scope.row.id,scope.row.is_show)"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="160" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加分类弹框 -->
    <add-classify v-if="classifyFlag" :title="dialogTitle" :item="selectItem" :list="cateList"
                  @emitClose="handleClose" @emitSubmit="handleSubmit"
    ></add-classify>
  </div>
</template>
<script>
    import {
        articleCateList,
        articleCateCut,
        addArticleCate,
        editArticleCate,
        deleteArticleCate,
        articleCateShow
    } from '@/api/article'
    import AddClassify from './components/addclassify'

    export default {
        name: 'articleType',
        components: {AddClassify},
        data() {
            return {
                total: 0,
                dialogTitle: "添加分类",
                classifyFlag: false,
                selectId: '',
                selectItem: [],
                list: [],
                cateList: [],
            }
        },
        created() {
            this.getList();
            this.articleCateCutHttp();
        },
        methods: {
            getList() {
                articleCateList().then(res => {
                    this.list = res;
                }).catch(err => {
                    console.log(err)
                })
            },
            handleStatusChange(id, is_show) { //修改展示状态
                articleCateShow(id, is_show).then(res => {
                  if (res.code === 1) {
                    this.$message({ message: '状态修改成功', type: 'success' });
                  } else {
                    this.$message({type: 'error', message: res.data});
                  }
                }).catch(err => {
                  this.getList();
                });
            },
            handleEdit(row) { //三级分类编辑
                this.classifyFlag = true;
                this.dialogTitle = '编辑分类';
                this.selectItem = row;
            },
            handleAdd() {
                this.classifyFlag = true;
                this.dialogTitle = '添加分类';
                this.selectItem = {};
            },
            articleCateCutHttp() {
                articleCateCut().then(res => {
                    let item = [], subItem = [];
                    for (let i = 0; i < res.length; i++) {
                        item = res[i].children;
                        if (item) {
                            for (let j = 0; j < item.length; j++) {
                                subItem = item[j].children;
                                if (subItem && subItem.length > 0) {
                                    delete item[j].children
                                }
                            }
                        }
                    }
                    this.cateList = res;
                }).catch(err => {
                    console.log(err)
                })
            },
            handleDelete(index, id) {
                this.selectId = id
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteArticleCateHttp()
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            deleteArticleCateHttp() {
                deleteArticleCate(this.selectId).then(res => {
                    this.getList();
                }).catch(err => {
                    console.log(err)
                })
            },
            addArticleCateHttp(params) {
                addArticleCate(params).then(res => {
                    if (res.code === 1) {
                        this.$message({
                            type: 'success',
                            message: '添加成功'
                        });
                        this.classifyFlag = false;
                        this.getList()
                        this.articleCateCutHttp();
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data
                        });
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            editArticleCateHttp(params) {
                editArticleCate(params, this.selectItem.id).then(res => {
                    if (res.code === 1) {
                        this.$message({
                            type: 'success',
                            message: '编辑成功'
                        });
                        this.classifyFlag = false;
                        this.getList()
                        this.articleCateCutHttp();
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data
                        });
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            handleClose() { //emit 表单关闭时事件
                this.classifyFlag = false;
            },
            handleSubmit(params) { //emit
              if (this.selectItem.id) {
                    this.editArticleCateHttp(params);
                } else {
                    this.addArticleCateHttp(params);
                }
            },
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>