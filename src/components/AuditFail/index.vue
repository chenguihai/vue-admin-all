<template>
  <el-dialog title="操作提示" width="500px" @close="handleClose" class="demo-ruleForm"
             :visible.sync="showFlag">
    <el-form :model="form" status-icon :rules="rules" label-position="right" label-width="120px"
             ref="form" size="small">
      <el-form-item prop="failNote" label="不通过原因：">
        <el-input type="textarea" maxlength="50" :row="3" v-model="form.failNote" placeholder="不通过原因" clearable></el-input>
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
        name: "auditFail",
        data() {
            return {
                showFlag:true,
                form: {
                    failNote: ''
                },
                rules: {
                    failNote: [{required: true, trigger: 'change', message: '原因不能为空'}],
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$emit('emitSubmit', this.form.failNote)
                    }
                })
            },
            handleClose() {
                this.$emit('emitClose')
            }
        }
    }
</script>

<style scoped>

</style>
