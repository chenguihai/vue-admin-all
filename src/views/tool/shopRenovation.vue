<template>
  <el-container>
    <el-main v-if="form.id">
      <el-form :model="form" label-width="120px" style="width: 100%" size="small">
        <el-form-item label="工具名称：">
          <el-input class="tool_name" v-model="form.tool_name" placeholder="工具名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="价格配置：">
          <el-table :data="shopRenovation"
                    style="width: 80%" border>
            <el-table-column prop="designer_level" label="设计师等级" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.designer_level" filterable placeholder="请选择" clearable>
                  <el-option
                    v-for="(value,key,index) in designerLevel"
                    :key="key"
                    :label="value"
                    :value="+key">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="service_type" label="服务类型" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.service_type" filterable placeholder="请选择" clearable>
                  <el-option
                    v-for="(value,key,index) in serviceType"
                    :key="key"
                    :label="value"
                    :value="+key">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="现价" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.price" placeholder="现价" clearable></el-input>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="handleRemoveFull(scope.$index, scope.row)">删除</el-button>
                <el-button type="text" @click="handleAddFull">添加一项</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item style="width:80%;" label="工具主图：" prop="icon">
          <el-col :span="12">
            <single-upload class="w_300" :url="form.tool_img" @close="deleteUpload"
                           @emitSubmit="submitUpload"></single-upload>
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
          <el-button :disabled="disabled" class="btn" size="medium" type="primary" @click="handleClick">保存</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
  import TinymceCpn from "@/components/Common/tinymceCpn";
  import {deleteServe, listServe, editServe} from '@/api/tool/shop';
  import SingleUpload from "@/components/Upload/singleUpload";

  export default {
    name: 'shopRenovation',
    components: {TinymceCpn, SingleUpload},
    data() {
      return {
        designerLevel: {},
        serviceType: {},
        shopRenovation: [],
        form: {
          id: null,
          tool_name: '',//	string	是	工具名称
          tool_img: '',//	string	是	工具主图
          support_platform: [],//	string	是	支持平台:1pc 2手机，多选，用逗号隔开
          description: '',//	text	是	详情介绍
          is_show: '',//	int	是	是否显示：0否，1是
          store_renovation: [],//=> [[‘id’,’designer_level’,’serviceType’,’price’],[‘designer_level’,’serviceType’,’price’]]	array	是	价格配置：id有编辑，无新增；designer_level设计师等级id；service_type服务类型id；price价格
        },
        disabled: false,
        selectIndex: 0
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        listServe().then((res) => {
          const {main_data = {}, designer_level = {}, service_type = {}} = res;
          main_data.support_platform = main_data.support_platform.split(',');
          if (main_data.store_renovation.length === 0) {
            this.shopRenovation.push({
              service_type: '',
              designer_level: '',
              price: ''
            });
          } else {
            this.shopRenovation = main_data.store_renovation;
          }
          delete main_data.store_renovation
          this.designerLevel = designer_level;
          this.serviceType = service_type;
          this.form = main_data;
        }).catch((err) => {
          console.log(err)
        })
      },

      handleRemoveFull(index, row) {
        this.selectIndex = index;
        if (this.shopRenovation.length > 1) {
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
        deleteServe(id).then(res => {
          this.shopRenovation.splice(this.selectIndex, 1);
          this.$message({type: 'success', message: '删除成功!'});
        }).catch((e) => {
          console.log(e)
        })
      },
      handleAddFull() {
        if (this.shopRenovation.length <= 20) {
          this.shopRenovation.push({service_type: '', designer_level: '', price: ''});
        } else {
          this.$message({message: '最多只能添加20条', type: 'warning'});
        }
      },
      handleClick() {
        let data = this.shopRenovation, item = {}
        for (let i = 0; i < data.length; i++) {
          item = data[i]
          for (const key in item) {
            if (!item[key]) {
              this.$message({message: '价格配置不能为空', type: 'error'});
              return
            }
          }
        }
        this.disabled = true
        let param = JSON.parse(JSON.stringify(this.form));
        param.support_platform = param.support_platform.filter(item => item).join(',')
        param.store_renovation = this.shopRenovation;
        editServe(param.id, param).then(res => {
          this.getList();
          this.$message({type: 'success', message: '修改成功!'});
        }).catch((e) => {
          console.log(e)
        }).finally(() => {
          this.disabled = false
        })
      },
      submitUpload(url) {
        this.form.tool_img = url
      },
      deleteUpload() {
        this.form.tool_img = '';
      },
    },
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
