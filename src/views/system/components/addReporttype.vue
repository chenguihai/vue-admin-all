<template>
  <el-dialog :title="dialogTitle" width="500px" @close="onClose" class="demo-ruleForm"
             :visible.sync="showFlag" :close-on-click-modal="false">
    <el-form :model="form" status-icon :rules="rules" label-position="right" label-width="130px" ref="form"
             size="small">
      <el-form-item prop="type" label="举报类型：">
        <el-input v-model="form.type" placeholder="举报类型" clearable/>
      </el-form-item>
      <el-form-item prop="description" label="举报类型描述：">
        <el-input v-model="form.description" placeholder="举报类型描述" clearable/>
      </el-form-item>
      <el-form-item prop="sort" label="排序值：">
        <el-input-number v-model="form.sort" controls-position="right" :min="1"></el-input-number>
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
    name: "addReporttype",
    props: {
      item: {
        type: Object,
        default: {}
      },
      title: {
        type: String,
        default: '添加举报类型'
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
            {min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'change'}],
          description: [{required: true, trigger: 'change', message: '举报类型描述不能为空'},
            {min: 4, max: 255, message: '长度在 4 到 255 个字符', trigger: 'change'}],
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
