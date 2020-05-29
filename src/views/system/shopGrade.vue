<template> 
  <el-container>
    <el-main>
      <el-form :inline="true" size="small">
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加等级</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border>
        <el-table-column prop="bl_name" label="等级名称" min-width="100" align="center"/>
        <el-table-column prop="grow_up_min" min-width="120" label="等级下限成长值" align="center"/>
        <el-table-column prop="grow_up_max" min-width="120" label="等级上限成长值" align="center"/>
        <el-table-column label="等级背景图标" min-width="140" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.icon!=''">
              <el-image style="width: 100px; height: 50px" :src="scope.row.icon | completePicture">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
            <span v-else>未上传图标</span>
          </template>
        </el-table-column>
        <el-table-column min-width="110" prop="allow_case_num" label="允许发布案例" align="center"/>
        <el-table-column min-width="110" prop="allow_biog_num" label="允许发布传记" align="center"/>
        <el-table-column min-width="170" prop="allow_daily_img" label="允许每天发布上刊图片" align="center"/>
        <el-table-column min-width="170" prop="allow_daily_video" label="允许每天发布上刊视频" align="center"/>
        <el-table-column width="160" label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index,scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          :current-page="pager.page"
          background
          :page-sizes="[10, 30, 50, 100]"
          :page-size="pager.pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange">
        </el-pagination>
      </div>
      <!-- 添加/编辑单位 -->
      <basic-level v-if="showFlag" :title="dialogTitle" :item="selectItem"
                   @submit="emitSubmit"
                   @close="emitClose"></basic-level>
    </el-main>
  </el-container>
</template>
<script>
    import {deleteshop, gradeList, addshop, editshop} from '@/api/system/shopgrade';
    import BasicLevel from './components/basicLevel'

    export default {
        name: 'shopGrade',
        components: {BasicLevel},
        data() {
            return {
                pager: {
                    page: 1,
                    pageSize: 10,
                },
                tableData: [],
                total: 0,
                dialogTitle: "添加店铺等级",
                showFlag: false,
                selectId: 0,
                selectItem: {},
            }
        },
        created() {
            this.getList();
        },
        methods: {
            emitClose() { //emit
                this.showFlag = false
            },
            emitSubmit(params) { //emit
                if (this.selectId === 0) {
                    this.addHttp(params);
                } else {
                    this.editHttp(params);
                }
            },
            getList() {
                gradeList(this.pager).then((res) => {
                    const {data = [], total = 0} = res
                    this.tableData = data
                    this.total = total
                    // this.$message({type: "error", message: res.data});
                }).catch((err) => {
                  console.log(err)
                })
            },
            handleAdd() {
                this.showFlag = true;
                this.dialogTitle = "添加店铺等级";
                this.selectId = 0;
                this.selectItem = {};
            },
            handleEdit(row) {
                this.showFlag = true;
                this.dialogTitle = "编辑店铺等级";
                this.selectId = row.id;
                this.selectItem = row;
            },
            editHttp(params) { //编辑单位
                editshop(this.selectId, params).then(res => {
                    if (res.code === 1) {
                        this.$message({type: 'success', message: '编辑成功!'});
                        this.emitClose();
                        this.getList();//删除更新页面
                    } else {
                        this.$message({type: "error", message: res.data});
                    }
                }).catch((err) => {
                  console.log(err)
                })
            },
            addHttp(params) { //添加单位
                addshop(params).then(res => {
                    if (res.code === 1) {
                        this.$message({type: 'success', message: '添加成功!'});
                        this.emitClose();
                        this.getList();//删除更新页面
                    } else {
                        this.$message({type: "error", message: res.data});
                    }
                }).catch((err) => {
                  console.log(err)
                })
            },
            handleDelete(index, id) {
                this.selectId = id;
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteHttp();
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            deleteHttp() {
                deleteshop(this.selectId).then(res => {
                    if (res.code === 1) {
                        this.$message({type: 'success', message: '删除成功!'});
                        this.emitClose();
                        this.getList();//删除更新页面
                    } else {
                        this.$message({type: "error", message: res.data});
                    }
                }).catch((err) => {
                  console.log(err)
                })
            },
            handlePageChange(val) {
                this.pager.page = val;
                this.getList();
            },
            handleSizeChange(val) {
                this.pager.page = 1;
                this.pager.pageSize = val;
                this.getList();
            },
        }
    }

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
