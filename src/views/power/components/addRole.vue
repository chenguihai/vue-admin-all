<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      width="600px"
      @close="handleClose"
      class="demo-ruleForm"
      :visible.sync="showFlag"
      :close-on-click-modal="false"
    >
      <el-form
        :model="form"
        class="serveform"
        status-icon
        :rules="rules"
        label-position="right"
        size="small"
        label-width="110px"
        ref="form"
      >
        <el-form-item prop="role_name" label="角色名称：">
          <el-input v-model="form.role_name" placeholder="角色名称" clearable />
        </el-form-item>
        <el-form-item prop="description" label="角色描述：">
          <el-input
            type="textarea"
            :rows="6"
            v-model="form.description"
            placeholder="角色描述"
            clearable
          />
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  validateURL,
  firstLetterRegExp,
  validateLowerCase
} from "@/utils/validate";
export default {
  name: "addBrand",
  props: ["title", "item"],
  data() {
    const {
      role_name = "",
      description = "",
      status = 0
    } = this.item;
    return {
      dialogTitle: this.title,
      showFlag: true,
      dialogFlag: false,
      form: {
        role_name, //	是	string	角色名称
        description, //	是	string	描述
        status //	是	int	0禁用，1启用
      },
      rules: {
        role_name: [
          { required: true, trigger: "change", message: "角色名称不能为空" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "change"
          }
        ],
        description: [
          { required: true, trigger: "change", message: "描述不能为空" },
          {
            min: 2,
            max: 50,
            message: "长度在 2 到 30 个字符",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      //编辑或新增规格
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("emitSubmit", this.form);
        } else {
          return false;
        }
      });
    },
    handleClose() {
      this.$emit("emitClose");
    },
    _handleClose() {
      this.dialogFlag = false;
    },
    _handleSubmit(params) {
      this._handleClose();
      let flag = this.form.cate_id.some(item => item.c_id === params.c_id);
      if (!flag) {
        this.form.cate_id.push(params);
      }
    },
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>