<template>
  <el-container>
    <el-main>
      <el-form :inline="true" ref="form" :model="form" size="small" class="headerForm">
        <el-form-item label="分类">
          <el-select
            v-model="form.cate_id"
            clearable
            filterable
            collapse-tags
            placeholder="分类"
            style="width:100%;">
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in typeData"
              :key="item.id"
              :label="item.cate_name.toUpperCase()"
              :value="item.id"
              class="my-option"/>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select class="w_100"
                     v-model="form.is_show"
                     clearable
                     filterable
                     collapse-tags
                     placeholder="状态">
            <el-option
              v-for="item in statusData"
              :key="item.value"
              :label="item.label.toUpperCase()"
              :value="item.value"
              class="my-option"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="属性名称" v-model="form.attr_name" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getSearchList">搜索</el-button>
        </el-form-item>
        <el-form-item class="fr">
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加规格属性
          </el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" border>
        <el-table-column prop="id" label="ID" min-width="100" align="center"/>
        <el-table-column prop="attr_name" label="名称" min-width="160" align="center"/>
        <el-table-column label="所属分类" align="center" min-width="260">
          <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.cate_id" :key="index">{{item.cate_name}}；</span>
          </template>
        </el-table-column>
        <el-table-column label="销售属性" min-width="80" align="center">
          <template slot-scope="scope">
            <el-tag size="mini"
              :type="scope.row.sale_attr == 1 ? 'success' : 'danger'"
              disable-transitions>{{scope.row.sale_attr == 1 ? '是' : '否'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="输入方式" min-width="110" align="center">
          <template slot-scope="scope">
            <el-tag type="mini" size="mini" v-if="scope.row.input_type==1">手动输入</el-tag>
            <el-tag type="mini" size="mini" v-else-if="scope.row.input_type==2">下拉列表选择</el-tag>
            <el-tag type="mini" size="mini" v-else-if="scope.row.input_type==3">复选框选择</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="input_select_val" label="可选值" min-width="300" align="center">
        </el-table-column>
        <el-table-column prop="" label="可筛选" min-width="80" align="center">
          <template slot-scope="scope">
            <el-tag size="mini"
              :type="scope.row.optional == 1 ? 'success' : 'danger'"
              disable-transitions>{{scope.row.optional == 1 ? '是' : '否'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="70" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_show"
              @change="handleStatusChange(scope.row)"
              :active-value="1"
              :inactive-value="0">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       @click="handleEdit(scope.row)">修改
            </el-button>
            <el-button size="mini"
                       type="danger"
                       @click="handleDelete(scope.row.id)">删除
            </el-button>
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
      <!-- 添加/编辑规格属性 -->
      <specs-attribute v-if="specsFlag" :title="dialogTitle" :type-data="typeData" :item="selectItem"
                       @emitClose="_handleClose" @emitSubmit="_handleSubmit"></specs-attribute>
    </el-main>
  </el-container>
</template>

<script>
    import {specsList, deleteSpecs, editSpecs, addSpecs, specsShow} from '@/api/cms/specs';
    import {serviceCat} from '@/api/common';
    import SpecsAttribute from './components/specsAttribute';

    export default {
        name: 'specsManage',
        components: {SpecsAttribute},
        data() {
            return {
                list: [],
                typeData: [],
                statusData: [
                    {
                        label: "全部",
                        value: ''
                    }, {
                        label: "显示",
                        value: 1
                    }, {
                        label: "不显示",
                        value: 0
                    }],
                form: {
                    page: 1,
                    pageSize: 10,
                    attr_name: '',//	否	string	规格属性名称
                    cate_id: '',//	否	int	一级分类id
                    is_show: '',//	否	int	是否显示：1是，0否
                },
                total: 0,
                specsFlag: false,
                dialogTitle: '添加规格属性',
                selectItem: {},
                selectId: 0,
            }
        },
        created() {
            this.searchTypeHttp();//初始化分类数据
            this.getAllList();//初始化列表数据
        },
        methods: {
            getSearchList() {
                this.form.page = 1;
                this.getAllList()
            },
            searchTypeHttp(pid = 0) { //初始化一级分类数据
                serviceCat(pid).then(res => {
                    this.typeData = res.data
                }).catch(err => {
                  console.log(err)
                })
            },
            //添加规格弹窗
            handleAdd() {
                this.specsFlag = true;
                this.dialogTitle = "添加规格属性";
                this.selectId = 0;
                this.selectItem = {};
            },
            handleEdit(row) {
                this.specsFlag = true;
                this.dialogTitle = "编辑规格属性";
                this.selectItem = row;
                this.selectId = row.id;
            },
            getAllList() { //搜索
                specsList(this.form).then((res) => {
                  const {data=[],total=0} = res;
                  this.list = data;
                  this.total = total;
                }).catch((err) => {
                  console.log(err)
                })

            },
            handleDelete(id) {
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteSpecsHttp(id);
                }).catch(() => {
                    this.$message({type: 'info', message: '已取消删除'});
                });
            },
            handleStatusChange(row) { //修改展示状态
                let param = {
                    id: row.id,
                    show: row.is_show
                };
                specsShow(param).then(res => {
                    if (res.code === 1) {
                        this.$message({message: '状态修改成功', type: 'success'});
                    } else {
                        this.$message.error(res.data)
                    }
                }).catch(err => {
                    this.getAllList()
                    console.log(err)
                });
            },
            handleSizeChange(val) { //分页器：页大小变更
                this.form.page = 1;
                this.form.pageSize = val
                this.getAllList()
            },
            handlePageChange(val) { //分页器：页码变更
                this.form.page = val
                this.getAllList()
            },
            _handleClose() {
                this.specsFlag = false
            },
            _handleSubmit(params) {
                if (this.selectId > 0) {
                    this.editSpecsHttp(params);
                } else {
                    this.addSpecsHttp(params);
                }
            },
            editSpecsHttp(params) {
                editSpecs(this.selectId, params).then((res) => {
                    if (res.code === 1) {
                        this.$message({type: 'success', message: '编辑成功!'});
                        this._handleClose();
                        this.getAllList();//删除更新页面
                    } else {
                        this.$message.error(res.data)
                    }

                }).catch((err) => {
                  console.log(err)
                })
            },
            addSpecsHttp(params) {
                addSpecs(params).then(res => {
                    if (res.code === 1) {
                        this.$message({message: '规格新增成功', type: 'success'});
                        this._handleClose();
                        this.getAllList();//更新页面
                    } else {
                        this.$message.error(res.data)
                    }
                }).catch(err => {
                  console.log(err)
                })
            },
            deleteSpecsHttp(id) {
                deleteSpecs(id).then(res => {
                    if (res.code === 1) {
                        this.$message({type: 'success', message: '删除成功!'});
                        this.getAllList();//删除更新页面
                    } else {
                        this.$message.error(res.data)
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

