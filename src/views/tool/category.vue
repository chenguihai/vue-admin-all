<template>
  <el-container>
    <el-main v-if="form.id">
      <el-form :model="form" label-width="120px" style="width: 100%" size="small">
        <el-form-item label="工具名称：">
          <el-input class="tool_name" v-model="form.tool_name" placeholder="工具名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="价格配置：">
          <el-table :data="skillCate"
                    style="width: 80%" border>
            <el-table-column
              label="类目有效期"
              align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.validity_limit" filterable placeholder="请选择" clearable>
                  <el-option
                    v-for="(value,key) in validData"
                    :key="key"
                    :label="value"
                    :value="+key">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              label="现价"
              align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.price" placeholder="现价" clearable></el-input>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="handleRemoveFull(scope.$index, scope.row)">删除</el-button>
                <el-button type="text" @click="handleAddFull">添加</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item style="width:80%;" label="工具主图：">
          <el-col :span="12">
            <single-upload :url="form.tool_img" btn="上传文件" @close="closeUpload" @emitSubmit="emitUpload"/>
          </el-col>
        </el-form-item>
        <el-form-item label="支持平台：">
          <template>
            <el-checkbox-group v-model="form.support_platform" :min="1">
              <el-checkbox label="1">PC</el-checkbox>
              <el-checkbox label="2">手机</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-form-item>
        <el-form-item label="详情介绍：">
          <tinymce-cpn ref="editor" v-model="form.description"/>
        </el-form-item>
        <el-form-item label="是否显示：">
          <template>
            <el-radio v-model="form.is_show" :label="1">显示</el-radio>
            <el-radio v-model="form.is_show" :label="0">不显示</el-radio>
          </template>
        </el-form-item>
        <el-form-item>
          <el-button class="btn" size="medium" type="primary" @click="handleClick()">保存</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
  import TinymceCpn from "@/components/Common/tinymceCpn";
  import {deleteCategory, category, editCategorytool} from '@/api/tool/category';
  import SingleUpload from "@/components/Upload/singleUpload";

  export default {
    name: 'Category',
    components: {TinymceCpn, SingleUpload},
    data() {
      return {
        form: {
          id: null,
          tool_name: '',
          tool_img: '',
          support_platform: [],
          skill_cate: [],
          is_show: null,
        },
        skillCate: [],
        validData: {},
        selectIndex: 0
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        category().then(res => {
          const {valid_data = {}, main_data = {}} = res;
          main_data.support_platform = main_data.support_platform.split(',');
          if (main_data.skill_cate.length === 0) {
            this.skillCate.push({
              validity_limit: '',
              price: ''
            });
          } else {
            this.skillCate = main_data.skill_cate;
          }
          delete main_data.skill_cate
          this.form = main_data
          this.validData = valid_data
          console.log(this.validData)
        }).catch((err) => {
          console.log(err)
        })
      },

      handleRemoveFull(index, row) {
        this.selectIndex = index;
        if (this.skillCate.length > 1) {
          this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteHttp(row.id);
          }).catch(() => {
            this.$message({type: 'info', message: '已取消删除'});
          });
        } else {
          this.$message({type: 'info', message: '至少保留一项'});
          return
        }
      },
      deleteHttp(id) {
        deleteCategory(id).then(res => {
          this.skillCate.splice(this.selectIndex, 1);
          this.$message({type: 'success', message: '删除成功!'});
        }).catch((e) => {
          console.log(e)
        })
      },
      handleAddFull() {
        if (this.skillCate.length < 20) {
          this.skillCate.push({validity_limit: '', price: ''});
        } else {
          this.$message({message: '最多只能添加20条', type: 'warning'});
        }
      },
      handleClick() {
        let data = this.skillCate, item = {}
        for (let i = 0; i < data.length; i++) {
          item = data[i]
          for (const key in item) {
            if (!item[key]) {
              this.$message({message: '价格配置不能为空', type: 'error'});
              return
            }
          }
        }

        let param = JSON.parse(JSON.stringify(this.form));
        param.support_platform = param.support_platform.filter(item => item).join(',')
        param.skill_cate = this.skillCate;
        editCategorytool(param.id, param).then(res => {
          this.getList();
          this.$message({type: 'success', message: '修改成功!'});
        }).catch((e) => {
          console.log(e)
        })
      },
      emitUpload(url) {
        this.form.tool_img = url;
      },
      closeUpload() {
        this.form.tool_img = '';
      },
    }
  }
</script>

<style scoped>
  .tool_name {
    width: 300px;
  }

  .btn {
    width: 150px;
  }
</style>
