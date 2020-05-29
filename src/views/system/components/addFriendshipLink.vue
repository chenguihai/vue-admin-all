<template>
  <el-dialog :title="dialogTitle" width="500px" @close="onClose" class="demo-ruleForm"
             :visible.sync="showFlag" :close-on-click-modal="false">
    <el-form :model="form" status-icon :rules="rules" size="small" label-position="right" label-width="150px"
             ref="form">
      <el-form-item prop="blogroll_name" label="友情链接名称：">
        <el-input maxlength="15" v-model="form.blogroll_name" placeholder="友情链接名称" clearable/>
      </el-form-item>
      <el-form-item prop="sort" label="排序值：">
        <el-input-number v-model="form.sort" controls-position="right" :min="1"/>
      </el-form-item>
      <el-form-item prop="blogroll_url" label="跳转链接：">
        <el-input v-model="form.blogroll_url" placeholder="跳转链接" clearable/>
      </el-form-item>
      <el-form-item label="是否显示：">
             <el-switch
            v-model="form.is_show"
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
        name: "addFriendshipLink",
        props: {
            item: {
                type: Object,
                default: {}
            },
            title: {
                type: String,
                default: '添加友情链接'
            }

        },
        data() {
            const {blogroll_name = '',blogroll_url='', sort = 1,is_show=1} = this.item;
            return {
                dialogTitle: this.title,
                showFlag: true,
                form: {
                    blogroll_name,//	是	string	友链名称
                    blogroll_url,//	否	string	跳转地址
                    sort,//	是	int	排序，默认1
                    is_show,//	否	int	是否显示：0否，1是
                },
                rules: {
                  blogroll_name: [{required: true, trigger: 'change', message: '友情链接名称不能为空'},
                    {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'change'}],
                  sort: [{required: true, trigger: 'change', message: '排序值要大于0'}],
                },
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
