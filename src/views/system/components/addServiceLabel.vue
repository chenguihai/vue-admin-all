<template>
  <el-dialog :title="dialogTitle" width="500px" @close="onClose" class="demo-ruleForm"
             :visible.sync="showFlag" :close-on-click-modal="false">
    <el-form :model="form" status-icon :rules="rules" size="small" label-position="right" label-width="120px"
             ref="form">
      <el-form-item prop="tag_name" label="服务标签名称：">
        <el-input v-model="form.tag_name" placeholder="服务标签名称" clearable/>
      </el-form-item>
      <el-form-item style="width:95%;" label="等级背景图：" prop="tag_img">
        <single-upload :url="form.tag_img" @close="closeUpload" @emitSubmit="emitUpload"/>
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
  import SingleUpload from "@/components/Upload/singleUpload";

  export default {
    name: "addServiceLabel",
    components: {SingleUpload},
    props: {
      item: {
        type: Object,
        default: {}
      },
      title: {
        type: String,
        default: '添加服务标签'
      }

    },
    data() {
      const {tag_name = '', tag_img = '', sort = ''} = this.item;
      return {
        dialogTitle: this.title,
        showFlag: true,
        form: {//添加/编辑举报类型
          tag_name: tag_name,//	是	string	标签名称
          tag_img: tag_img,//	否	string	标签图
          sort: sort,//	是	int	排序
        },
        rules: {
          tag_name: [{required: true, trigger: 'change', message: '服务标签名称不能为空'},
            {min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'change'}],
          tag_img: [{required: true, trigger: 'change', message: '标签图不能为空'}],
          sort: [{required: true, trigger: 'change', message: '排序值不能为空'}],
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
      },
      emitUpload(url) {
        this.form.tag_img = url;
      },
      closeUpload() {
        this.form.tag_img = '';
      },
    }
  }
</script>

<style scoped>

</style>
