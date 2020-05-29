<template>
  <el-dialog title="角色选择" width="600px" @close="handleClose" class="demo-ruleForm"
             :visible.sync="showFlag">
    <el-form :model="form" status-icon :rules="rules" label-position="right" label-width="0px"
             ref="form">
      <el-form-item prop="role_id">
        <el-checkbox-group v-model="form.role_id">
    <el-checkbox v-for="item in listData" :label="item.id" :key="item.id">{{item.role_name}}</el-checkbox>
  </el-checkbox-group>
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
        name: "roleSelect",
        props: ['list','select'],
        data() {
            return {
                //添加分类
                showFlag: true,
                listData: this.list,
                form: {
                    role_id:this.select
                },
                rules: {
                    role_id: [{type: 'array',required: true, trigger: 'change', message: '角色选择不能为空'}],
                },
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$emit('submit', this.form.role_id)
                    } else {
                        return false;
                    }
                });
            },
            handleClose() {
                this.$emit('close')
            },
        }
    }
</script>

<style scoped>

</style>
