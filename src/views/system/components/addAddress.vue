<template>
  <el-dialog :title="dialogTitle" width="500px" @close="onClose" class="demo-ruleForm"
             :visible.sync="showFlag" :close-on-click-modal="false">
    <el-form :model="form" status-icon :rules="rules" label-position="right" label-width="130px" ref="form"
             size="small">
      <el-form-item prop="type" label="地址编码：">
        <el-input v-model="form.type" placeholder="地址编码" clearable/>
      </el-form-item>
      <el-form-item prop="description" label="地址名称：">
        <el-input v-model="form.description" placeholder="地址名称" clearable/>
      </el-form-item>
      <el-form-item prop="description" label="级别：">
        <el-select class="w_120" v-model="form.status" placeholder="请选择" clearable>
          <el-option
            v-for="item in 4"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="description" label="上级地址：">
        <el-cascader v-model="form.cate_id"
                     :options="cateList"
                     :props="{ checkStrictly: true }"
                     expandTrigger="hover"
                     clearable>
        </el-cascader>
      </el-form-item>
      <el-form-item prop="description" label="区号：">
        <el-input v-model="form.description" placeholder="区号" clearable/>
      </el-form-item>
      <el-form-item prop="sort" label="邮编：">
        <el-input v-model="form.sort" placeholder="邮编" clearable/>
      </el-form-item>
      <el-form-item prop="sort" label="拼音：">
        <el-input v-model="form.sort" placeholder="拼音" clearable/>
      </el-form-item>
      <el-form-item prop="sort" label="是否显示：">
        <el-switch
          v-model="form.on_sale"
          :active-value="1"
          :inactive-value="0"
        ></el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="onClose">取 消</el-button>
      <el-button size="small" type="primary" @click="onSubmit('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
    export default {
        name: "addAddress",
        props: {
            item: {
                type: Object,
                default: {}
            },
            title: {
                type: String,
                default: ''
            }

        },
        data() {
            const {type = '', description = '', sort = 1} = this.item;
            return {
                dialogTitle: this.title,
                showFlag: true,
                form: {//添加/编辑举报类型
                    type: type,//	是	string	举报类型
                    description: description,//	是	string	举报类型描述
                    sort: sort,//	是	int	排序
                },
                rules: {
                    type: [{required: true, trigger: 'change', message: '举报类型不能为空'},
                        {min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur'}],
                    description: [{required: true, trigger: 'change', message: '举报类型描述不能为空'}],
                    sort: [{required: true, trigger: 'change', message: '排序值要大于0'}],
                },
                cateList: []
            }
        },
        methods: {
            onSubmit(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.$emit('submit', this.form)
                    } else {
                        return false;
                    }
                });
            },
            onClose() {
                this.$emit('close')
            }
        }
    }
</script>

<style scoped>

</style>
