<template>
  <el-dialog :title="dialogTitle" width="500px" @close="handleClose" class="demo-ruleForm"
             :visible.sync="showFlag">
    <el-form :model="form" status-icon :rules="rules" label-position="right" label-width="180px" ref="form"
             size="small">
      <el-form-item prop="bl_name" label="等级名称：">
        <el-input v-model="form.bl_name" placeholder="等级名称" clearable/>
      </el-form-item>
      <el-form-item prop="level" label="等级标识：">
        <el-input-number v-model="form.level" controls-position="right" :min="1" :max="100"/>
      </el-form-item>
      <el-form-item prop="grow_up_min" label="成长值下限：">
        <el-input v-model.number="form.grow_up_min" placeholder="成长值下限" type="number" clearable/>
      </el-form-item>
      <el-form-item prop="grow_up_max" label="成长值上限：">
        <el-input v-model.number="form.grow_up_max" placeholder="成长值上限" type="number" clearable/>
      </el-form-item>
      <el-form-item prop="allow_case_num" label="允许发布案例：">
        <el-input v-model.number="form.allow_case_num" placeholder="允许发布案例" type="number" clearable/>
      </el-form-item>
      <el-form-item prop="allow_biog_num" label="允许发布传记：">
        <el-input v-model.number="form.allow_biog_num" placeholder="允许发布传记" type="number" clearable/>
      </el-form-item>
      <el-form-item prop="allow_daily_img" label="允许每天发布上刊图片：">
        <el-input v-model.number="form.allow_daily_img" placeholder="允许每天发布上刊图片" type="number" clearable/>
      </el-form-item>
      <el-form-item prop="allow_daily_video" label="允许每天发布上刊视频：">
        <el-input v-model.number="form.allow_daily_video" placeholder="允许每天发布上刊视频" type="number" clearable/>
      </el-form-item>
      <el-form-item label="等级背景图：" prop="icon">
        <single-upload :url="form.icon" @close="_deleteUpload" @emitSubmit="_handleUpload"></single-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">取 消</el-button>
      <el-button size="small" type="primary" @click="submitForm('form')">确 定</el-button>
    </div>
  </el-dialog>

</template>

<script>
  import SingleUpload from "@/components/Upload/singleUpload";

  export default {
    name: "basicLevel",
    components: {SingleUpload},
    props: ['title', 'item'],
    data() {
      const {bl_name = '', level = 1, grow_up_min = '', grow_up_max = '', icon = '', allow_case_num = '', allow_biog_num = '', allow_daily_img = '', allow_daily_video = ''} = this.item;
      var validateSort = (rule, value, callback) => {
        if (value > 0) {
          callback();
        } else {
          callback(new Error('值要大于0'))
        }
      }
      return {
        showFlag: true,
        dialogTitle: this.title,
        form: {
          bl_name,//	是	string	基础等级名称
          level,//	是	int	等级标识
          grow_up_min,//	是	int	成长值下限
          grow_up_max,//	是	int	成长值上限
          icon,//	否	string	等级图标
          allow_case_num,//	是	int	案例数
          allow_biog_num,//	是	int	传记数
          allow_daily_img,//	是	int	每天上刊图片数
          allow_daily_video,//是	int	每天上刊视频数
        },
        rules: {
          bl_name: [{required: true, trigger: 'change', message: '等级名称不能为空'},
            {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'change'}],
          level: [{required: true, trigger: 'change', message: '等级标识不能为空'}],
          grow_up_min: [{required: true, message: '成长值下限不能为空', trigger: 'change'},
            {validator: validateSort, trigger: 'change'}],
          grow_up_max: [{required: true, message: '成长值上限不能为空', trigger: 'change'},
            {validator: validateSort, trigger: 'change'}],
          allow_case_num: [{required: true, message: '案例数不能为空', trigger: 'change'},
            {validator: validateSort, trigger: 'change'}],
          allow_biog_num: [{required: true, message: '传记数不能为空', trigger: 'change'},
            {validator: validateSort, trigger: 'change'}],
          allow_daily_img: [{required: true, message: '每天上刊图片数不能为空', trigger: 'change'},
            {validator: validateSort, trigger: 'change'}],
          allow_daily_video: [{required: true, message: '每天上刊视频数不能为空', trigger: 'change'},
            {validator: validateSort, trigger: 'change'}],
          icon: [{required: true, message: '等级图标不能为空', trigger: 'change'}],
        },
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            const {grow_up_min, grow_up_max} = this.form;
            if (grow_up_min >= grow_up_max) {
              this.$message.error('成长值下限不能大于等于成长值上限')
              return
            }
            this.$emit('submit', this.form)
          } else {
            return false;
          }
        });
      },
      handleClose() {
        this.$emit('close')
      },
      _handleUpload(url) {
        this.form.icon = url;
      },
      _deleteUpload() {
        this.form.icon = '';
      },
    }
  }
</script>

<style scoped>

</style>
