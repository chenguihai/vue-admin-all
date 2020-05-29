<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      width="600px"
      @close="thatClose"
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
        <el-form-item prop="username" label="账号：">
          <el-input class="w_300" v-model="form.username" placeholder="支持5-20个字符" clearable />
        </el-form-item>
        <el-form-item prop="name" label="姓名：">
          <el-input class="w_300" v-model="form.name" placeholder="姓名" clearable />
        </el-form-item>
        <el-form-item prop="role_id" label="所属角色：">
          <ul v-if="form.role_id.length > 0" class="Annex">
            <li class="annex_item" v-for="item in form.role_id" :key="item">{{filterName[item]}};</li>
          </ul>
          <el-button @click="showAddType">添加角色</el-button>
        </el-form-item>
        <el-form-item label="手机号：" prop="phone">
          <el-input v-model="form.phone" placeholder="手机号" clearable />
        </el-form-item>
        <el-form-item label="登录密码：" prop="password">
          <el-input
            type="password"
            v-model="form.password"
            placeholder="密码（8-32位字母/数字/特殊符号）"
            clearable
          />
        </el-form-item>
        <el-form-item label="确认密码：" prop="password_repeat">
          <el-input
            type="password"
            v-model="form.password_repeat"
            placeholder=""
            clearable
          />
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="thatClose">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加分类-->
    <role-select
      v-if="dialogFlag"
      :select="form.role_id"
      :list="listData"
      @close="handleClose"
      @submit="handleSubmit"
    ></role-select>
  </div>
</template>

<script>
import RoleSelect from "./roleSelect";
import {
  validateURL,
  firstLetterRegExp,
  validateLowerCase,
  phoneRegExp,
  pwdRegExp
} from "@/utils/validate";
export default {
  name: "addBrand",
  props: ["title", "list", "item"],
  components: { RoleSelect },
  data() {
    const {
      username = "",
      password = "",
      password_repeat = "",
      name = "",
      phone = "",
      role_id = "",
      status = 0,
      role = []
    } = this.item;
    var validatePhone = (rule, value, callback) => {
      if (!phoneRegExp(value)) {
        callback(new Error("手机号格式不正确"));
      } else {
        callback();
      }
    };
    var validatePwd = (rule, value, callback) => {
      if (!value) {
        callback();
      }else if (!pwdRegExp(value)) {
        callback(new Error("密码包含字母、数字、特殊符号任意两种"));
      } else {
        callback();
      }
    };
    var validatePwdRepeat = (rule, value, callback) => {
      if (this.form.password != value) {
        callback(new Error("两次密码输入不一致"));
      } else {
        callback();
      }
    };
    let newObj = {},
      item = {};
    for (let i = 0; i < this.list.length; i++) {
      item = this.list[i];
      newObj[item.id] = item.role_name;
    }
    return {
      filterName: newObj,
      listData: this.list,
      dialogTitle: this.title,
      showFlag: true,
      dialogFlag: false,
      roleList: role,
      form: {
        username, //	是	string	账号
        password, //	是	string	密码
        password_repeat, //是	string	确认密码
        name, //	是	string	姓名
        phone, //	是	string	手机号
        role_id: role_id ? role_id.split(",").map(item => +item) : [], //是	int	角色id,多个用逗号分开
        status //int	0禁用，1启用
      },
      rules: {
        username: [
          { required: true, trigger: "change", message: "账号不能为空" },
          {
            min: 5,
            max: 20,
            message: "账号支持5-20个字符",
            trigger: "change"
          }
        ],
        name: [
          { required: true, trigger: "change", message: "姓名不能为空" },
          {
            min: 2,
            max: 15,
            message: "请输入正确的姓名",
            trigger: "change"
          }
        ],
        phone: [
          {
            required: true,
            trigger: "change",
            message: "手机号码不能为空"
          },
          {
            required: true,
            trigger: "change",
            validator: validatePhone
          }
        ],
        password: [
          {
            required: !username,
            trigger: ["change",'blur'],
            message: "密码不能为空"
          },
           {
            min: 8,
            max: 32,
            message: "密码长度为8个到32个字符",
            trigger: "change"
          },
          { validator: validatePwd, trigger: ["change",'blur'] }
        ],
        password_repeat: [
          {
            required: !username,
            trigger: ["change",'blur'],
            message: "确认密码不能为空"
          },
          { validator: validatePwdRepeat, trigger: ["change",'blur'] }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      //编辑或新增规格
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.form));
          data.role_id = data.role_id.toString();
          this.$emit("submit", data);
        } else {
          return false;
        }
      });
    },
    _deleteUpload() {
      this.form.brand_logo = "";
    },
    _handleUpload(url) {
      this.form.brand_logo = url;
    },
    thatClose() {
      this.$emit("close");
    },
    handleClose() {
      this.dialogFlag = false;
    },
    handleSubmit(params) {
      // this.form.role_id = Array.from(new Set(params.concat(this.form.role_id)));
      this.form.role_id = params;
      this.handleClose();
    },
    showAddType() {
      this.dialogFlag = true;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.Annex {
  display: flex;
  flex-wrap: wrap;
}
.annex_item{
  margin-right: 20px;
}

.w_300 {
  width: 300px;
}
</style>
