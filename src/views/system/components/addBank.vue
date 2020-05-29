<template>
  <el-dialog :title="dialogTitle" width="500px" @close="onClose" class="demo-ruleForm"
             :visible.sync="showFlag" :close-on-click-modal="false">
    <el-form :model="form" status-icon :rules="rules" size="small" label-position="right" label-width="100px"
             ref="form">
      <el-form-item prop="bank_name" label="银行名称：">
        <el-input v-model="form.bank_name" placeholder="举报类型" clearable/>
      </el-form-item>
      <el-form-item prop="sort" label="排序值：">
        <el-input-number v-model="form.sort" controls-position="right" :min="1"/>
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
        name: "addBank",
        props: {
            item: {
                type: Object,
                default: {}
            },
            title: {
                type: String,
                default: '添加银行'
            }

        },
        data() {
            const {bank_name = '', sort = 1} = this.item;
            return {
                dialogTitle: this.title,
                showFlag: true,
                form: {//添加/编辑举报类型
                    bank_name: bank_name,//	是	string	银行名称
                    sort: sort,//	是	int	排序

                },
                rules: {
                  bank_name: [{required: true, trigger: 'change', message: '银行名称不能为空'},
                    {min: 4, max: 50, message: '长度在 4 到 50 个字符', trigger: 'change'}],
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
