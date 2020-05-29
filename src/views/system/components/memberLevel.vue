<template>
  <el-dialog
    :title="dialogTitle"
    width="600px"
    @close="handleClose"
    class="demo-ruleForm"
    :visible.sync="showFlag"
  >
    <el-form
      class="shopmenber"
      size="small"
      :model="form"
      status-icon
      :rules="rules"
      label-position="right"
      label-width="180px"
      ref="form"
    >
      <el-form-item prop="ml_name" label="会员等级名称：">
        <el-input v-model="form.ml_name" placeholder="会员等级名称" clearable />
      </el-form-item>
      <el-form-item prop="tag" label="会员等级标识：">
        <el-input v-model="form.tag" placeholder="会员等级标识" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item style="width:95%;" label="等级背景图：" prop="icon">
        <single-upload :url="form.icon" @close="_deleteUpload" @emitSubmit="_handleUpload"></single-upload>
      </el-form-item>
      <el-form-item prop="tech_rate" label="技术费率：">
        <el-input-number v-model.number="form.tech_rate" placeholder="技术费率" :min="1" :max="100" />%
      </el-form-item>
      <el-form-item prop="share_rate" label="案例传记上刊分成比：">
        <el-input-number
          v-model.number="form.share_rate"
          placeholder="案例传记上刊分成比"
          :min="1"
          :max="100"
        />%
      </el-form-item>
      <el-form-item prop="allow_service_num" label="允许发布服务：">
        <el-input-number v-model.number="form.allow_service_num" placeholder="允许发布服务" :min="1" />个
      </el-form-item>
      <el-form-item prop="allow_cate_num" label="允许入驻类目：">
        <el-input-number v-model.number="form.allow_cate_num" placeholder="允许入驻类目" :min="1" />个
      </el-form-item>
      <el-form-item prop="allow_case_num" label="允许发布案例：">
        <el-input-number v-model.number="form.allow_case_num" placeholder="允许发布案例" :min="1" />个
      </el-form-item>
      <el-form-item prop="allow_biog_num" label="允许发布传记：">
        <el-input-number v-model.number="form.allow_biog_num" placeholder="允许发布传记" :min="1" />个
      </el-form-item>
      <el-form-item prop="allow_daily_img" label="允许每天发布上刊图片：">
        <el-input-number v-model.number="form.allow_daily_img" placeholder="允许每天发布上刊图片" :min="1" />个
      </el-form-item>
      <el-form-item prop="allow_daily_video" label="允许每天发布上刊视频：">
        <el-input-number v-model.number="form.allow_daily_video" placeholder="允许每天发布上刊视频" :min="1" />个
      </el-form-item>
      <el-form-item prop="service_tag_num" label="服务标签：">
        <el-input-number v-model.number="form.service_tag_num" placeholder="服务标签" :min="1" />个
      </el-form-item>
      <el-form-item prop="store_search_weight" label="店铺加权：">
        <el-input-number
          v-model.number="form.store_search_weight"
          placeholder="店铺加权"
          :min="0"
          :max="100"
        />%
      </el-form-item>
      <el-form-item prop="service_search_weight" label="服务加权：">
        <el-input-number
          v-model.number="form.service_search_weight"
          placeholder="服务加权"
          :min="0"
          :max="100"
        />%
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
  name: "memberLevel",
  components: { SingleUpload },
  props: ["title", "item"],
  data() {
    const {
      ml_name = "",
      tag = "",
      icon = "",
      tech_rate = 1,
      allow_service_num = 1,
      allow_cate_num = 1,
      allow_case_num = 1,
      allow_biog_num = 1,
      allow_daily_img = 1,
      allow_daily_video = 1,
      share_rate = 1,
      service_tag_num = 1,
      store_search_weight = 0,
      service_search_weight = 0
    } = this.item;
    return {
      showFlag: true,
      dialogTitle: this.title,
      form: {
        ml_name, //	是	string	会员等级名称
        tag, //是	int	会员等级标识
        icon, //	是	string	会员等级图标
        tech_rate, //	是	int	技术费率
        allow_service_num, //	是	int	允许发布服务数
        allow_cate_num, //	是	int	允许入住类目数
        allow_case_num, //	是	int	案例数
        allow_biog_num, //	是	int	传记数
        allow_daily_img, //	是	int	每天上刊图片数
        allow_daily_video, //	是	int	每天上刊视频数
        share_rate, //	是	int	平台分成比
        service_tag_num, //	是	int	服务标签数
        store_search_weight, //	否	int	店铺权重
        service_search_weight //	否	int	服务权重
      },
      rules: {
        ml_name: [
          {
            required: true,
            trigger: "change",
            message: "会员等级名称不能为空"
          },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "change"
          }
        ],
        tag: [
          {
            required: true,
            trigger: "change",
            message: "会员等级标识不能为空"
          },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "change"
          }
        ],
        icon: [
          { required: true, trigger: "change", message: "等级背景图不能为空" }
        ],
        tech_rate: [
          { required: true, trigger: "change", message: "技术费率不能为空" }
        ],
        allow_service_num: [
          { required: true, trigger: "change", message: "发布服务不能为空" }
        ],
        allow_cate_num: [
          { required: true, trigger: "change", message: "入驻类目不能为空" }
        ],
        allow_case_num: [
          { required: true, trigger: "change", message: "案例数不能为空" }
        ],
        allow_biog_num: [
          { required: true, trigger: "change", message: "传记数不能为空" }
        ],
        allow_daily_img: [
          {
            required: true,
            trigger: "change",
            message: "每天上刊图片数不能为空"
          }
        ],
        allow_daily_video: [
          {
            required: true,
            trigger: "change",
            message: "每天上刊视频数不能为空"
          }
        ],
        share_rate: [
          { required: true, trigger: "change", message: "平台分成比不能为空" }
        ],
        service_tag_num: [
          { required: true, trigger: "change", message: "服务标签数不能为空" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("submit", this.form);
        } else {
          return false;
        }
      });
    },
    handleClose() {
      this.$emit("close");
    },
    _handleUpload(url) {
      this.form.icon = url;
    },
    _deleteUpload() {
      this.form.icon = "";
    }
  }
};
</script>

<style scoped>
</style>
