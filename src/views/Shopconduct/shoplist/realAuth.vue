<template>
  <el-dialog title="操作提示" width="500px" @close="handleClose" class="demo-ruleForm" :visible.sync="showFlag">
    <el-form :model="form" status-icon :rules="rules" label-position="right" label-width="120px"
             ref="form" size="small">
      <el-form-item label="未通过原因：" prop="fail_reasons">
        <el-checkbox-group v-model="form.fail_reasons">
          <el-checkbox label="1">企业信息有误</el-checkbox>
          <el-checkbox label="2">法人信息有误</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="原因描述：" prop="fail_note">
        <el-input :rows="3" type="textarea" v-model="form.fail_note" placeholder="不通过原因"></el-input>
        <p>请描述具体的错误原因，以便用户修改。</p>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="submitForm('form')">审核未通过</el-button>
    </div>
  </el-dialog>
</template>

<script>
    export default {
        name: "realAuth",
        data() {
            return {
                showFlag: true,
                form: {
                    fail_reasons: [],//	否	string	失败原因：1法人信息有误 2企业信息有误
                    fail_note: '',//	否	string	审核未通过备注
                },
                rules: {
                    fail_note: [
                        {required: true, message: "原因描述不能为空"}
                    ],
                    fail_reasons: [
                        {required: true, message: "未通过原因不能为空"}
                    ],
                },
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {

                        let params = JSON.parse(JSON.stringify(this.form));
                        params.fail_reasons = params.fail_reasons.toString();
                        this.$emit('submit', params)
                    } else {
                        return false;
                    }
                });
            },
            handleClose() {
                this.$emit('close')
            }
        }
    }
</script>

<style scoped>

</style>
