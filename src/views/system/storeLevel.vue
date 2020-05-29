<template> 
  <el-container>
    <el-main>
      <el-form :inline="true" size="small">
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加会员等级</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border>
        <el-table-column prop="ml_name" label="会员等级名称" align="center" min-width="120px">
        </el-table-column>
        <el-table-column prop="tag" label="会员等级标识" align="center" min-width="120px"/>
        <el-table-column label="会员等级图标" align="center" min-width="120px">
          <template slot-scope="scope">
            <div v-if="scope.row.icon!=''">
              <el-image style="width: 100px; height: 50px" :src="scope.row.icon|imgPrefixF">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
            <span v-else>未上传图标</span>
          </template>
        </el-table-column>
        <el-table-column label="技术费率" align="center" min-width="120px">
          <template slot-scope="scope">{{scope.row.tech_rate}}%</template>
        </el-table-column>
        <el-table-column label="允许发布服务" align="center" min-width="120px">
          <template slot-scope="scope">{{scope.row.allow_service_num}}个</template>
        </el-table-column>
        <el-table-column label="允许入驻类目" align="center" min-width="120px">
          <template slot-scope="scope">{{scope.row.allow_cate_num}}个</template>
        </el-table-column>
        <el-table-column min-width="110" prop="allow_case_num" label="允许发布案例" align="center"/>
        <el-table-column min-width="110" prop="allow_biog_num" label="允许发布传记" align="center"/>
        <el-table-column min-width="170" prop="allow_daily_img" label="允许每天发布上刊图片" align="center"/>
        <el-table-column min-width="170" prop="allow_daily_video" label="允许每天发布上刊视频" align="center"/>
        <el-table-column fixed="right" label="操作" align="center" min-width="150px">
          <template slot-scope="scope">
            <el-button size="mini"
                       @click="handleEdit(scope.row)">修改
            </el-button>
            <el-button size="mini" type="danger"
                       @click="handleDelete(scope.$index,scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加/编辑单位 -->
      <member-level v-if="showFlag" :title="dialogTitle" :item="selectItem"
                    @submit="_handleSubmit"
                    @close="_handleClose"></member-level>
    </el-main>
  </el-container>
</template>
<script>
  import {deletemenber, menberList, addmenber, editmenber} from '@/api/system/shopmenber';
  import MemberLevel from './components/memberLevel';

  export default {
    name: 'storeLevel',
    components: {MemberLevel},
    data() {
      return {
        tableData: [],
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
      _handleClose() { //emit
        this.showFlag = false
      },
      _handleSubmit(params) { //emit
        if (this.selectId === 0) {
          this.addHttp(params);
        } else {
          this.editHttp(params);
        }
      },
      getList() {
        menberList().then((res) => {
          this.tableData = res
        }).catch((err) => {
          console.log(err)
        })
      },
      handleAdd() {
        this.showFlag = true;
        this.dialogTitle = "添加店铺会员等级";
        this.selectId = 0;
        this.selectItem = {};
      },
      handleEdit(row) {
        this.showFlag = true;
        this.dialogTitle = "编辑店铺会员等级";
        this.selectId = row.id;
        this.selectItem = row;
      },
      editHttp(params) {
        editmenber(this.selectId, params).then((res) => {
          if (res.code === 1) {
            this.$message({type: 'success', message: '编辑成功!'});
            this._handleClose();
            this.getList();//新增更新页面
          } else {
            this.$message({type: "error", message: res.data});
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      addHttp(params) {
        addmenber(params).then((res) => {
          if (res.code === 1) {
            this.$message({type: 'success', message: '添加成功!'});
            this._handleClose();
            this.getList();//删除更新页面
          } else {
            this.$message({type: "error", message: res.data});
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      deleteHttp(index) {
        deletemenber(this.selectId).then(res => {
          if (res.code === 1) {
            this.$message({type: 'success', message: '删除成功!'});
            this._handleClose();
            this.tableData.splice(index, 1);
          } else {
            this.$message({type: "error", message: res.data});
          }
        }).catch((e) => {
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
          this.deleteHttp(index);
        }).catch(() => {
          this.$message({type: 'info', message: '已取消删除'});
        });
      }
    }
  }

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
