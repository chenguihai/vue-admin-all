<template>
  <el-dialog :title="dialogTitle" width="500px" @close="handleClose" class="demo-ruleForm"
             :visible.sync="showFlag">
    <el-form :model="form" status-icon :rules="rules" label-position="right" label-width="80px" ref="form" size="small">
      <el-form-item prop="unit_name" label="单位：">
        <el-input v-model="form.unit_name" placeholder="单位" clearable/>
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
        name: "addUnit",
        props: ['title', 'item'],
        data() {
            const {unit_name = ''} = this.item;
            return {
                dialogTitle: this.title,
                showFlag: true,
                form: {//添加/编辑单位
                    unit_name: unit_name,
                },
                rules: {
                    unit_name: [{required: true, trigger: 'change', message: '单位不能为空'}],
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
