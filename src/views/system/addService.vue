<template> 
  <el-container>
    <el-main>
      <el-form :inline="true" size="small" class="headerForm">
        <el-form-item label="增值服务名称">
          <el-input placeholder="增值服务名称" v-model="form.inc_name" clearable/>
        </el-form-item>
        <el-form-item label="开启状态">
          <el-select class="w_100"
                     v-model="form.is_show" clearable>
            <el-option value="" label="全部"></el-option>
            <el-option
              v-for="item in openState"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="描述关键字" v-model="form.description" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearchList">搜索</el-button>
        </el-form-item>
        <el-form-item class="fr">
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加增值服务</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" border>
        <el-table-column prop="id" label="增值编号" min-width="100" align="center">
        </el-table-column>
        <el-table-column prop="inc_name" label="增值服务名称" min-width="200" align="center"/>
        <el-table-column label="价格" min-width="150" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.price!==''">￥{{scope.row.price}}</span>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" align="center" min-width="250"/>
        <el-table-column prop="short" label="简称" align="center" min-width="100"/>
        <el-table-column prop="sort" label="排序" min-width="100" align="center"/>
        <el-table-column label="是否开启" min-width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_show"
              @change="handleStatusChange(scope.row)"
              :active-value="1"
              :inactive-value="0">
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" min-width="150px" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       @click="handleEdit(scope.row)">修改
            </el-button>
            <el-button size="mini" type="danger"
                       @click="handleDelete(scope.row)">删除
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
      <increment-service v-if="dialogFlag" :title="dialogTitle" :item="selectItem" @emitSubmit="_handleSubmit"
                         @emitClose="_handleClose"></increment-service>
    </el-main>
  </el-container>
</template>
<script>
    import {deleteservice, serviceList, addservice, editservice, editstatus} from '@/api/system/addservice';
    import IncrementService from './components/incrementService'

    export default {
        name: 'addService',
        components: {IncrementService},
        data() {
            return {
                dialogTitle: "添加增值服务",
                dialogFlag: false,
                openState: [
                    {
                        label: "开启",
                        value: 1
                    },
                    {
                        label: "未开启",
                        value: 0
                    }],
                form: {
                    page: 1,
                    pageSize: 10,
                    inc_name: '',//	否	string	增值服务名称
                    is_show: '',//	否	int	是否显示：1是，0否
                    description: '',//	否	string	描述
                },
                selectId: 0,
                selectItem: {},
                total: 0,
                list: [],
            }
        },
        created() {
            this.getList();
        },
        methods: {
            handleSearchList() {  //搜索
                this.form.page = 1;
                this.getList();
            },
            handleStatusChange(row) {   //修改显示状态
                let param = {
                    id: row.id,
                    show: row.is_show
                };
                editstatus(param).then(res => {
                    if (res.code === 1) {
                        this.$message({message: '显示修改成功', type: 'success'});
                    } else {
                        this.$message.error(res.data);
                    }
                }).catch(err => {
                   this.getList();
                });
            },
            getList() {
                serviceList(this.form).then((res) => {
                    const {data = [], total=0} = res
                    this.list = data
                    this.total = total
                }).catch((err) => {
                  console.log(err)
                })
            },
            handleAdd() {
                this.dialogFlag = true;
                this.dialogTitle = "添加增值服务";
                this.selectId = 0;
                this.selectItem = {};
            },
            handleEdit(row) {
                this.dialogFlag = true;
                this.dialogTitle = "编辑增值服务";
                this.selectId = row.id;
                this.selectItem = row;
            },
            handleDelete(row) {
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteServiceHttp(row.id);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handlePageChange(val) {
                this.form.page = val;
                this.getList();
            },
            handleSizeChange(val) {
                this.form.page = 1;
                this.form.pageSize = val;
                this.getList();
            },
            _handleClose() { //emit
                this.dialogFlag = false
            },
            _handleSubmit(item) { //emit
                if (this.selectId === 0) {
                    this.addServiceHttp(item);
                } else {
                    this.editServiceHttp(item);
                }
            },
            deleteServiceHttp(id) {
                deleteservice(id).then(res => {
                    if (res.code === 1) {
                        this.$message({type: 'success', message: '删除成功!'});
                        this.getList();
                    } else {
                        this.$message.error(res.data);
                    }

                }).catch((err) => {
                  console.log(err)
                })
            },
            editServiceHttp(params) {
                editservice(this.selectId, params).then((res) => {
                    if (res.code === 1) {
                        this.$message({type: 'success', message: '编辑成功!'});
                        this._handleClose();
                        this.getList();
                    } else {
                        this.$message.error(res.data);
                    }
                }).catch((err) => {
                  console.log(err)
                })
            },
            addServiceHttp(params) {
                addservice(params).then((res) => {
                    if (res.code === 1) {
                        this.$message({type: 'success', message: '添加成功!'});
                        this._handleClose();
                        this.getList();
                    } else {
                        this.$message.error(res.data);
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
