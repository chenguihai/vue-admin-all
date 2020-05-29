<template>
  <el-dialog :title="dialogTitle" width="500px" @close="handleClose" class="demo-ruleForm"
             :visible.sync="showFlag">
    <el-form :model="form" status-icon :rules="rules" label-position="right" label-width="80px"
             size="small" ref="form">
      <el-form-item prop="sr_name" label="领域：">
        <el-input v-model="form.sr_name" placeholder="领域" clearable/>
      </el-form-item>
      <el-form-item prop="sort" label="排序：">
        <el-input v-model.number="form.sort" placeholder="排序" autocomplete="off"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">取 消</el-button>
      <el-button size="small" type="primary" @click="submitForm('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
    export default {
        name: "addField",
        props: ['title', 'item'],
        data() {
            const {sr_name = '', sort = ''} = this.item;
            return {
                showFlag: true,
                dialogTitle: this.title,
                form: {//添加/编辑单位
                    sr_name: sr_name,
                    sort: sort,
                },
                rules: {
                    sr_name: [{required: true, trigger: 'change', message: '领域不能为空'},
                        {min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'change'}],
                    sort: [{required: true, trigger: 'change', message: '排序不能为空'}, {
                        type: 'number',
                        message: '排序必须为数字值'
                    }],
                },
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.$emit('emitSubmit', this.form)
                    } else {
                        return false;
                    }
                });
            },
            handleClose() {
                this.$emit('emitClose')
            }
        }
    }
</script>

<style scoped>

</style>
