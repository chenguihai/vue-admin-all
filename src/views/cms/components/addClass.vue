<template>
  <el-dialog title="选择分类" width="500" class="demo-ruleForm" @close="handleClose" :visible.sync="showFlag">
    <el-form :model="form" status-icon label-position="right" ref="form" size="small">
      <el-form-item prop="cate_id" label="">
        <el-checkbox-group v-model="form.cate_id">
          <el-checkbox v-for="item in typeList" :label="item.id"
                       :key="item.id">{{item.cate_name}}
          </el-checkbox>
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
        name: "addClass",
        props: ['list', 'select'],
        data() {
            return {
                showFlag: true,
                typeList: this.list,
                form: {
                    cate_id: this.select || [],
                },
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$emit('emitSubmit', this.form.cate_id)
                    } else {
                        return false;
                    }
                });
            },
            handleClose() {
                this.$emit('emitClose')
            },
        }
    }
</script>

<style scoped>

</style>
