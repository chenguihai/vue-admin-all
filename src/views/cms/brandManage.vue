<template> 
  <div class="app-container">
    <el-form :inline="true" size="small" class="headerForm">
      <el-form-item label="分类">
        <el-select
          @change="handleCategory"
          v-model="form.cate_id_1" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in cateList1"
            :key="item.id"
            :label="item.cate_name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="form.cate_id_2" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in cateList2"
            :key="item.id"
            :label="item.cate_name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select class="w_100"
                   v-model="form.is_show" clearable>
          <el-option
            v-for="item in isShowList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="名称" v-model="form.brand_name" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearchList">搜索</el-button>
      </el-form-item>
      <el-form-item class="fr">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加服务品牌</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border>
      <el-table-column prop="id" label="ID" min-width="80" align="center"/>
      <el-table-column min-width="140" prop="brand_name" label="名称" align="center"/>
      <el-table-column label="logo" min-width="130" align="center">
        <template slot-scope="scope">
          <a v-if="scope.row.brand_logo" :href="scope.row.brand_logo | imgPrefixF" target="_blank">
            <el-image class="imgCover" fit="cover" :src="scope.row.brand_logo | brandPicture">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </a>
        </template>
      </el-table-column>
      <el-table-column label="所属分类" min-width="350">
        <template slot-scope="scope">
          <ul class="Annex">
            <li v-for="(item, index) in scope.row.cate_id" :key="index">
              {{item.c_name}}<span>；</span>
            </li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column prop="first_letter" label="首字母" min-width="70" align="center"/>
      <el-table-column prop="logo_link" label="品牌网址" min-width="260" align="center"/>
      <el-table-column label="热门" width="80" align="center">
        <template slot-scope="scope">
          <el-tag size="small"
            :type="scope.row.is_hot == 1 ? 'danger' : 'success'"
            disable-transitions>{{scope.row.is_hot == 1 ? '是' : '否'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="80" label="推荐" align="center">
        <template slot-scope="scope">
          <el-tag size="small"
            :type="scope.row.is_recommend == 1 ? 'danger' : 'success'"
            disable-transitions>{{scope.row.is_recommend == 1 ? '是' : '否'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="80" align="center"/>
      <el-table-column label="状态" width="100" align="center">
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
                     @click="handleEdit(scope.$index, scope.row)">修改
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
    <!-- 添加/编辑品牌 -->
    <add-brand v-if="dialogFlag" :title="dialogTitle" :item="selectItem" :list="cateList1" @emitClose="_handleClose"
               @emitSubmit="_handleSubmit"></add-brand>
  </div>
</template>
<script>
  import {serveList, deleteserve, editserve, addserve, servetype, updateApplyStatus} from '@/api/cms/serve';
  import AddBrand from './components/addBrand';
  import {isShow} from '@/utils/commonData';

  export default {
    name: 'brandManage',
    components: {AddBrand},
    data() {
      return {
        cateList1: [],//一级分类
        cateList2: [], //页面检索二级分类
        isShowList: isShow,
        selectId: 0,
        selectIndex: 0,
        selectItem: {},
        form: {
          page: 1,
          pageSize: 10,
          brand_name: '',//	否	string	品牌名称
          cate_id_1: '',//	否	int	一级分类id
          cate_id_2: '',//	否	int	二级分类id
          is_show: '',//	否	int	是否显示：1是，0否
        },
        tableData: [],
        total: 0,
        dialogTitle: "添加服务品牌",
        dialogFlag: false,
        dialogFormVisible1: false,
      }
    },
    created() {
      this.getList();
      this.serviceCatHttp('cat1', 0);
    },
    methods: {
      serviceCatHttp(type, id) { //初始化一级分类数据
        if (id === '') {
          return
        }
        servetype(id).then(res => {
          if (res.code === 1) {
            if (type === 'cat1') {
              this.cateList1 = res.data;
            } else {
              this.cateList2 = res.data;
            }
          }
        }).catch(err => {
          console.log(err)
        })
      },
      handleCategory(value) { //分类change事件
        this.cateList2 = [];
        this.form.cate_id_2 = '';
        this.serviceCatHttp('cat2', value);
      },
      getList() {
        serveList(this.form).then(res => {
          const {data = [],total=0} = res
          this.tableData = data
          this.total = total;
        }).catch(err => {
          console.log(err) // 这里catch到错误timeout
        })
      },
      //修改展示状态
      handleStatusChange(row) {
        let param = {
          id: row.id,
          show: row.is_show
        };
        updateApplyStatus(param).then(res => {
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
        this.dialogTitle = "添加服务品牌";
        this.selectId = 0;
        this.selectItem = {};
      },
      handleEdit(index, row) {
        this.dialogFlag = true;
        this.dialogTitle = "编辑服务品牌";
        this.selectIndex = index;
        this.selectItem = row;
        this.selectId = row.id;
      },
      handleDelete(id) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteHttp(id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
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
      _handleClose() {
        this.dialogFlag = false
      },
      _handleSubmit(params) {
        if (this.selectId > 0) {
          this.editBrandHttp(params);
        } else {
          this.addBrandHttp(params);
        }
      },
      editBrandHttp(params) {
        editserve(this.selectId, params).then((res) => {
          if (res.code === 1) {
            this.$message({type: 'success', message: '编辑成功!'});
            this._handleClose()
            this.getList();//删除更新页面
          } else {
            this.$message.error(res.data)
          }
        }).catch((err) => {
          this.$message.error(err.data)
        })
      },
      addBrandHttp(params) {
        addserve(params).then(res => {
          if (res.code === 1) {
            this.$message({message: '品牌新增成功', type: 'success'});
            this._handleClose()
            this.getList();//更新页面
          } else {
            this.$message.error(res.data);
          }
        }).catch(err => {
          this.$message.error(err.data)
        })
      },
      deleteHttp(id) {
        deleteserve(id).then(res => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getList();//删除更新页面
          } else {
            this.$message.error(res.data)
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
