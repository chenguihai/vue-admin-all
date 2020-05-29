<template>
  <div class="app-container active">
    <el-form
      :model="form"
      :rules="rules"
      label-width="110px"
      style="width: 100%"
      size="small"
      ref="form"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="标题：" prop="title">
            <el-input class="tool_name" v-model="form.title" placeholder="标题" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分类：" prop="cate_id">
            <el-cascader
              class="tool_name"
              v-model="form.cate_id"
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
        </el-col>
        <el-col :span="12">
          <el-form-item label="分类描述：">
            <el-input
              class="tool_name"
              type="textarea"
              :rows="3"
              v-model="form.description"
              placeholder="分类描述"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分类关键字：">
            <el-input
              class="tool_name"
              type="textarea"
              :rows="3"
              v-model="form.keyword"
              placeholder="分类关键字"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序：" prop="sort">
            <el-input class="tool_name" v-model="form.sort" placeholder="排序" clearable></el-input>

          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="作者：">
            <el-input class="tool_name" v-model="form.author" placeholder="作者" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="外部链接地址：">
            <el-input class="tool_name" v-model="form.link" placeholder="外部链接地址" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否显示：">
            <template>
              <el-radio-group v-model="form.is_show">
                <el-radio :label="1">显示</el-radio>
                <el-radio :label="0">不显示</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="24"></el-col>
        <el-col :span="12">
          <el-form-item label="封面：">
            <single-upload :url="form.cover" @close="_deleteUpload" @emitSubmit="_handleUpload"></single-upload>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否热门：">
            <template>
              <el-radio-group v-model="form.is_hot">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="文章简介：" prop="preface">
            <el-input type="textarea" autosize placeholder="请输入内容" v-model="form.preface"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="内容：" prop="content">
            <tinymce-cpn ref="editor" v-model="form.content"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="">
            <router-link class="mr_10" :to="{path:'/article/articleList'}">
              <el-button size="mini">返回</el-button>
            </router-link>
            <el-button size="mini" type="primary" @click="submitForm('form')">保存</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import TinymceCpn from "@/components/Common/tinymceCpn";
  import SingleUpload from "@/components/Upload/singleUpload";
  import {addArticle, editArticle} from "@/api/article";

  export default {
    name: "publishArticle",
    components: {TinymceCpn, SingleUpload},
    data() {
      return {
        cateList: [],
        fileList: [],
        selectId: '',
        form: {  //表单数据
          cover: '',//	否	string	封面
          cate_id: [],//	是	int	文章分类id
          keyword: '',//	否	string	关键字
          link: '',//	否	string	链接
          title: '',//	是	string	文章标题
          content: '',//	是	string	文章内容
          description: '',//	否	string	描述
          sort: '',//	是	int	排序
          author: '',//	否	string	作者
          is_show: 1,//	否	int	是否显示：0 否，1 是
          is_hot: 1,//否 int	是否热门：0否，1是
          preface: '',//否 文章简介
        },
        rules: {
          cate_id: [{required: true, trigger: 'change', message: '文章分类不能为空'}],
          title: [{required: true, trigger: 'change', message: '文章标题不能为空'}],
          content: [{required: true, trigger: 'change', message: '文章内容不能为空'}],
          sort: [{required: true, trigger: 'change', message: '排序不能为空'}],
          preface: [{required: true, trigger: 'change', message: '文章简介不能为空'},
            {min: 10, max: 100, message: '长度在 10 到 100 个字符', trigger: 'change'}],
        },
      }
    },
    created() {
      let cate = localStorage.getItem('cateList');
      let item = localStorage.getItem('articleItem');
      if (cate) {
        this.cateList = JSON.parse(cate);
      }
      if (item) {
        let articleItem = JSON.parse(item);
        const {id = '', cover = '', cate_id = [], keyword = '', link = '', title = '', content = '', description = '', sort = '', author = '', is_show = 1, is_hot = 1, preface = ''} = articleItem || {};
        this.selectId = id;
        this.form = {  //表单数据
          cover: cover,//	否	string	封面
          cate_id: cate_id,//	是	int	文章分类id
          keyword: keyword,//	否	string	关键字
          link: link,//	否	string	链接
          title: title,//	是	string	文章标题
          content: content,//	是	string	文章内容
          description: description,//	否	string	描述
          sort: sort,//	是	int	排序
          author: author,//	否	string	作者
          is_show: is_show,//	否	int	是否显示：0 否，1 是
          is_hot: is_hot,//否 int	是否热门：0否，1是
          preface: preface,//文章简介
        };
      }
    },
    methods: {
      _handleUpload(url) {
        this.form.cover = url;
      },
      _deleteUpload() {
        this.form.cover = '';
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let data = {...this.form, cate_id: this.form.cate_id.pop()}
            if (this.selectId) {
              this.editArticleHttp(data);
            } else {
              this.addArticleHttp(data);
            }
          } else {
            return false;
          }
        });
      },
      addArticleHttp(params) {
        addArticle(params).then(res => {
          if (res.code === 1) {
            this.$router.push('/article/articleList')
          } else {
            this.messageFun();
          }
        }).catch(err => {
          console.log(err);
        })
      },
      editArticleHttp(params) {
        editArticle(params, this.selectId).then(res => {
          if (res.code === 1) {
            localStorage.removeItem('articleItem');
            this.$router.push('/article/articleList')
          } else {
            this.messageFun();
          }
        }).catch(err => {
          console.log(err);
        })
      },
      messageFun() {
        this.$message({type: 'error', message: '操作失败!'});
      }
    },
    beforeDestroy(){
      localStorage.removeItem('articleItem')
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-container {
    &.active {
      min-width: 1340px;
      max-width: 1920px;
    }
  }
</style>
