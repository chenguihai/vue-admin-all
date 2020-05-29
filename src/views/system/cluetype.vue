<template> 
  <el-container>
    <el-main>
      <el-form :inline="true" size="small">
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="addType">添加客户类型</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border>
        <el-table-column prop="id" label="ID" align="center"/>
        <el-table-column prop="customer_type" label="客户类型" align="center"/>
        <el-table-column label="价格" align="center">
          <template slot-scope="scope">
            ￥<span>{{scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small"
                       @click="handleEdit(scope.$index, scope.row)">修改
            </el-button>
            <el-button size="small" type="danger"
                       @click="handleDelete(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="pagination-container">
          <el-pagination
              :current-page="pager.page"
              background
              :page-sizes="[10, 30, 50, 100]"
              :page-size="pager.pageSize"
              :total="pager.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handlePageChange">
          </el-pagination>
      </div> -->
      <!-- 添加/编辑单位 -->
      <el-dialog :title="dialogTitle" width="500px" @close="handleClose" class="demo-ruleForm"
                 :visible.sync="dialogFormVisible">
        <el-form :model="nologyform" status-icon :rules="rules" label-position="right" label-width="130px"
                 ref="nologyform" size="small">
          <el-form-item prop="customer_type" label="客户类型：">
            <el-input v-model="nologyform.customer_type" maxlength="20" placeholder="客户类型" clearable/>
          </el-form-item>
          <el-form-item prop="price" label="价格：">
            <el-input v-model="nologyform.price" placeholder="价格" clearable/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="quotaopen('nologyform')">确 定</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
    import {validatNum} from '@/utils/validate';
    import {deleteclue, clueList, addclue, editclue} from '@/api/system/cluetype';

    export default {
        name: 'Cluetype',
        data() {
            const validateprice = (rule, value, callback) => {
                if (!validatNum(value)) {
                    callback(new Error('价格为数字或浮点'))
                } else {
                    callback()
                }
            };
            return {
                rules: {
                    customer_type: [{required: true, message: '客户类型不能为空'}],
                    price: [{required: true, validator: validateprice}],
                },
                pager: {
                    page: 1,
                    pageSize: 10,
                    total: 0,
                },
                tableData: [],
                total: null,
                dialogTitle: "添加客户类型",
                dialogFormVisible: false,
                //添加/编辑单位
                nologyform: {
                    id: null,
                    customer_type: null,
                    price: null
                },
            }
        },
        created() {
            this.getList();
        },
        methods: {
            getList() {
                clueList().then((result) => {
                    this.tableData = result.data
                }).catch((err) => {
                  console.log(err)
                })
            },
            addType() {
                this.dialogFormVisible = true;
                this.dialogTitle = "添加线索价格配置";
                this.nologyform.id = null;
                this.nologyform.customer_type = null;
                this.nologyform.price = null;
            },
            handleEdit(index, row) {
                this.dialogFormVisible = true;
                this.dialogTitle = "编辑位置管理";
                this.nologyform.id = row.id;
                this.nologyform.customer_type = row.customer_type
                this.nologyform.price = row.price
            },
            //添加、编辑线索
            quotaopen(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.nologyform.id) {
                            let clueid = this.nologyform.id;
                            let cluejson = {
                                customer_type: this.nologyform.customer_type,
                                price: this.nologyform.price,
                            }
                            editclue(clueid, cluejson).then((res) => {
                                if (res.code === 1) {
                                    this.dialogFormVisible = false;
                                    this.$message({type: 'success', message: '编辑成功!'});
                                    this.getList();//删除更新页面
                                } else {
                                    this.$message({type: 'error', message: res.data});
                                }
                            }).catch((err) => {
                              console.log(err)
                            })

                        } else {
                            addclue(this.nologyform).then(res => {
                                if (res.code === 1) {
                                    this.dialogFormVisible = false;
                                    this.$message({type: 'success', message: '添加成功!'});
                                    this.getList();//删除更新页面
                                } else {
                                    this.$message({type: 'error', message: res.data});
                                }
                            }).catch((err) => {
                              console.log(err)
                            });
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            handleDelete(row) {
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteclue(row.id).then(res => {
                        if (res.code === 1) {
                            this.$message({type: 'success', message: '删除成功!'});
                            this.getList();//删除更新页面
                        } else {
                            this.$message({type: 'error', message: res.data});
                        }
                    }).catch((err) => {
                      console.log(err)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handlePageChange(val) {
                this.pager.page = val;
                this.getList();
            },
            handleSizeChange(val) {
                this.pager.pageSize = val
                this.getList();
            },

            /**
             * 表单关闭时事件
             */
            handleClose() {
                // this.$refs.nologyform.resetFields();
                this.$refs.nologyform.clearValidate();
            },
        }
    }

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
