<template>
  <el-dialog title="提示" :before-close="handleClose"
             :visible.sync="showFlag" width="500px" :close-on-click-modal="false">
    <el-form
      ref="ruleForm"
      :model="form"
      label-width="100px"
      size="small"
    >
      <el-form-item label="拒绝原因" prop="reasons">
        <el-input v-model="form.reasons" maxLength="20" type="textarea"/>
      </el-form-item>
      <el-form-item prop="sort">
        <el-button size="small" type="primary" @click="submitForm">拒绝</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  export default {
    name: 'refusalReasons',
    data() {
      return {
        showFlag: true,
        form: {
          reasons: ''
        }
      }
    },
    methods: {
      submitForm() {
        this.$emit('emitSubmit', this.form.reasons)
      },
      handleClose() {
        this.$emit('emitClose')
      }
    }
  }
</script>

<style scoped>

</style>
