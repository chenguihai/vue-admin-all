<template>
  <!-- 添加/编辑一级分类 -->
  <el-dialog :title="titles" width="550px" @close="handleClose" :visible.sync="showFlag">
    <el-form
      :model="form"
      status-icon
      :rules="rules"
      label-position="right"
      label-width="155px"
      ref="form"
      size="small"
    >
      <el-form-item prop="cate_name" label="分类名称：">
        <el-input v-model="form.cate_name" placeholder="分类名称" clearable />
      </el-form-item>
      <el-form-item prop="pid" label="上级分类：">
        <el-cascader
          :disabled="isDisabled"
          v-model="form.pid"
          :options="cateList"
          :props="{ checkStrictly: true }"
          clearable
        >
          <template slot-scope="{ node, data }">
            <span>{{ data.label }}</span>
            <span v-if="!node.isLeaf">({{ data.children.length }})</span>
          </template>
        </el-cascader>
      </el-form-item>
      <el-form-item prop="cate_code" label="分类标识码：">
        <el-input v-model="form.cate_code" placeholder="分类标识码" clearable />
      </el-form-item>
      <el-form-item label="首页导航栏显示：" prop="index_nav_show">
        <el-select v-model="form.index_nav_show" clearable>
          <el-option
            v-for="item in listdata"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序：" prop="index_nav_sort">
        <el-input
          v-model.number="form.index_nav_sort"
          autocomplete="off"
          placeholder="排序"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="首页楼层推荐：">
        <el-radio-group v-model="form.floor_recommend">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序：">
        <el-input
          v-model.number="form.floor_recommend_sort"
          autocomplete="off"
          placeholder="排序"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="分类图标：">
        <single-upload
          :url="form.cate_icon"
          btn="选择图片"
          @close="deleteUpload('cate_icon')"
          @emitSubmit="cateIcon"
        ></single-upload>
      </el-form-item>
      <el-form-item label="分类关键词：">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          v-model="form.cate_keywords"
          placeholder="分类关键词"
          clearable
        />
        <div>关键词用于搜索引擎搜索，用"|"隔开，可输入多个</div>
      </el-form-item>
      <el-form-item label="分类描述：">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          v-model="form.cate_description"
          placeholder="分类描述"
        />
        <div>用于搜索引擎搜索</div>
      </el-form-item>
      <el-form-item label="手机端显示：">
        <el-radio-group v-model="form.mobile_show">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机显示图标：">
        <single-upload
          :url="form.mobile_icon"
          btn="选择图片"
          @close="deleteUpload('mobile_icon')"
          @emitSubmit="mobileIcon"
        ></single-upload>
      </el-form-item>
      <el-form-item label="手机显示排序：">
        <el-input v-model.number="form.mobile_sort" clearable></el-input>
      </el-form-item>
      <el-form-item label="手机显示名称：">
        <el-input v-model="form.mobile_name" clearable></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="submitForm('form')">保存</el-button>
      <el-button size="small" @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import SingleUpload from "@/components/Upload/singleUpload";
import { cateData } from "@/utils/commonData";

export default {
  name: "addClassTwo",
  components: { SingleUpload },
  props: ["title", "item", "options"],
  data() {
    let {
      id = null,
      pid = null,
      cate_name = "",
      cate_code = "",
      index_nav_show = 0,
      index_nav_sort = 1,
      floor_recommend = 0,
      floor_recommend_sort = 1,
      cate_icon = "",
      cate_keywords = "",
      cate_description = "",
      mobile_show = 0,
      mobile_icon = "",
      mobile_sort = "",
      mobile_name = ""
    } = this.item;
    let data = [],
      item = {};
    let list = JSON.parse(JSON.stringify(this.options));
    for (let i = 0; i < list.length; i++) {
      item = list[i];
      delete item.children;
      data.push(item);
    }
    return {
      showFlag: true,
      titles: this.title,
      isDisabled: !id,
      cateList: data,
      listdata: cateData,
      form: {
        id,
        pid: [pid], //	是	int	父级id
        cate_name, //	是	string	分类名称
        cate_code, //	是	string	分类标识码
        index_nav_show, //	是	int	首页导航栏显示：0不显示，1左侧，2右侧
        index_nav_sort: index_nav_sort || 1, //	是	int	首页导航栏排序

        floor_recommend, //	否	int	首页楼层推荐（二/三级）：0否，1是
        floor_recommend_sort: floor_recommend_sort || 1, //	否	int	首页楼层推荐排序
        cate_keywords, //	否	string	分类关键词
        cate_description, //	否	string	分类描述
        cate_icon, //	否	string	分类图标
        mobile_show, //	否	string	手机显示：0否，1是
        mobile_icon, //	否	string	手机显示图标
        mobile_sort: mobile_sort || 1, //	否	string	手机显示排序
        mobile_name //	否	string	手机显示名称
      },
      rules: {
        cate_name: [
          { required: true, trigger: "change", message: "名称不能为空" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "change"
          }
        ],
        cate_code: [
          { required: true, trigger: "change", message: "分类标识码不能为空" }
        ],
        pid: [{ required: true, trigger: "change", message: "父级id不能为空" }],
        index_nav_show: [
          { required: true, trigger: "change", message: "首页导航栏不能为空" }
        ],
        index_nav_sort: [
          {
            required: true,
            trigger: "change",
            message: "首页导航栏排序不能为空"
          },
          {
            type: "number",
            message: "首页导航栏排序为数字"
          }
        ],
        mobile_name: [
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.form));
          data.floor_recommend_sort === "" && delete data.floor_recommend_sort;
          data.mobile_sort === "" && delete data.mobile_sort;
          data.pid = data.pid[0];
          this.$emit("submit", data);
        } else {
          return false;
        }
      });
    },
    handleClose() {
      this.$emit("close");
    },
    cateIcon(url) {
      this.form.cate_icon = url;
    },
    mobileIcon(url) {
      this.form.mobile_icon = url;
    },
    deleteUpload(type) {
      this.form[type] = "";
    }
  }
};
</script>

<style scoped>
</style>
