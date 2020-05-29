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
        <el-form-item prop="brand_name" label="品牌名称：">
          <el-input class="w_300" v-model="form.brand_name" placeholder="品牌名称" clearable />
        </el-form-item>
        <el-form-item prop="brand_code" label="品牌标识码：">
          <el-input class="w_300" v-model="form.brand_code" placeholder="品牌标识码" clearable />
        </el-form-item>
        <el-form-item prop="first_letter" label="品牌首字母：">
          <el-input
            class="w_300"
            v-model="form.first_letter"
            maxlength="1"
            placeholder="品牌首字母"
            clearable
          />
        </el-form-item>
        <el-form-item prop="brand_logo" label="logo：">
          <single-upload
            class="w_300"
            :url="form.brand_logo"
            @close="_deleteUpload"
            @emitSubmit="_handleUpload"
          ></single-upload>
        </el-form-item>

        <el-form-item prop="cate_id" label="分类：">
          <ul v-if="form.cate_id.length > 0" class="Annex">
            <!-- v-model="form.cate_id" -->
            <li v-for="(item, index) in form.cate_id" v-bind:key="item.c_id">
              {{item.c_name}};
              <span
                @click="removeTodo(index)"
                style="cursor: pointer;color:red;font-size: 20px;margin-left: 8px;"
              >x</span>
            </li>
          </ul>
          <el-button @click="showAddType">添加分类</el-button>
        </el-form-item>
        <el-form-item label="网址：" prop="logo_link">
          <el-input v-model="form.logo_link" placeholder="网址" clearable />
        </el-form-item>
        <el-form-item label="排序：">
          <el-slider :min="1" v-model="form.sort"></el-slider>
        </el-form-item>
        <el-form-item label="热门：">
          <el-radio-group v-model="form.is_hot">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="推荐：">
          <el-radio-group v-model="form.is_recommend">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态：">
          <span style="margin-right: 5px;">NO</span>
          <el-switch v-model="form.is_show" :active-value="1" :inactive-value="0"></el-switch>
          <span style="margin-left: 5px;">YES</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加分类-->
    <add-three-class
      v-if="dialogFlag"
      :list="listData"
      @emitClose="_handleClose"
      @emitSubmit="_handleSubmit"
    ></add-three-class>
  </div>
</template>

<script>
import AddThreeClass from "./addThreeClass";
import { validateURL, firstLetterRegExp,validateLowerCase } from "@/utils/validate";
import SingleUpload from "@/components/Upload/singleUpload";
export default {
  name: "addBrand",
  props: ["title", "list", "item"],
  components: { AddThreeClass, SingleUpload },
  data() {
    const {
      cate_id = [],
      brand_name = "",
      brand_code = "",
      first_letter = "",
      brand_logo = "",
      logo_link = "",
      sort = 1,
      is_hot = 0,
      is_recommend = 0,
      is_show = 1
    } = this.item;
    var validateCode = (rule, value, callback) => {
      if (!validateLowerCase(value)) {
        callback(new Error("品牌标识码由小写字母组成"));
      }else {
        callback();
      }
    };
    var validateLetter = (rule, value, callback) => {
     if (!firstLetterRegExp(value)) {
        callback(new Error("品牌名称首字母为英文字母"));
      } else {
        callback();
      }
    };
    var validateLink = (rule, value, callback) => {
      if (!value) {
        callback();
      } else if (!validateURL(value)) {
        callback(new Error("品牌网址不匹配"));
      } else {
        callback();
      }
    };
    return {
      listData: this.list,
      dialogTitle: this.title,
      showFlag: true,
      dialogFlag: false,
      form: {
        cate_id: cate_id || [], //	是	string	分类id，三级用竖线分开，多个用英文逗号隔开
        brand_name, //	是	string	品牌名称
        brand_code, //	是	string	品牌标识码
        first_letter, //	是	string	品牌首字母，A-Z
        brand_logo, //	是	string	品牌logo，图片路径
        logo_link, //	否	string	品牌网址，URL链接
        sort, //	是	int	排序
        is_hot, //	否	int	是否热门：1是，0否
        is_recommend, //	否	int	是否推荐：1是，0否
        is_show //否	int	是否显示：1是，0否
      },
      rules: {
        cate_id: [
          { required: true, trigger: "change", message: "分类不能为空" }
          // {validator: validateCate,trigger: 'blur',}
        ],
        brand_name: [
          { required: true, trigger: "change", message: "品牌名称不能为空" },
          {
            min: 2,
            max: 50,
            message: "长度在 2 到 50 个字符",
            trigger: "change"
          }
        ],
        brand_code: [
          { required: true, trigger: "change", message: "品牌标识码不能为空" },
          {
            required: true,
            trigger: "change",
            validator: validateCode
          }
        ],
        first_letter: [
          { required: true, trigger: "change", message: "品牌首字母不能为空" },
          {
            required: true,
            trigger: "change",
            validator: validateLetter
          }
        ],
        logo_link: [{ validator: validateLink, trigger: "change" }],
        brand_logo: [
          { required: true, trigger: "change", message: "品牌logo不能为空" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      //编辑或新增规格
      this.$refs[formName].validate(valid => {
        if (valid) {
          let ids = [];
          let data = JSON.parse(JSON.stringify(this.form));
          data.cate_id.map(item => {
            ids.push(item.c_id);
          });
          data.first_letter = data.first_letter.toUpperCase();
          data.cate_id = ids.join(",");
          this.$emit("emitSubmit", data);
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
    showAddType() {
      this.dialogFlag = true;
    },
    removeTodo: function(index) {
      //删除分类某一行
      this.form.cate_id.splice(index, 1);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.Annex {
  margin: 0;
  list-style: none;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
  padding-left: 0;
}

.w_300 {
  width: 300px;
}
</style>