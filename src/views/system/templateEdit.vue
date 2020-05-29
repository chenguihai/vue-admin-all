<template>
  <div class="app-container">
    <el-form :model="form" status-icon :rules="rules" label-position="right" label-width="100px"
             ref="form" size="small">
      <el-form-item prop="title" label="模板标题：">
        <el-input style="width:200px;" v-model="form.title" placeholder="模板标题" clearable/>
      </el-form-item>
      <el-form-item label="模板内容：" prop="content">
        <tinymce-cpn ref="editor" v-model="form.content"/>
      </el-form-item>
      <el-form-item label="模板类型：" prop="type">
        <el-select
          v-model="form.type" clearable>
          <el-option
            v-for="item in templateTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <router-link class="mr_10" :to="{path:'/system/templateManage'}">
          <el-button size="mini">返回</el-button>
        </router-link>
        <el-button size="mini" type="primary" @click="submitForm('form')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {templateType} from '@/utils/commonData'
  import TinymceCpn from "@/components/Common/tinymceCpn";
  import {addTemplate, editTemplate} from '@/api/system/template';

  export default {
    name: "templateEdit",
    components: {TinymceCpn},
    data() {
      const {title = '', content = '', type = 1} = {}
      let data = JSON.parse(JSON.stringify(templateType))
      data.shift()
      return {
        templateTypes: data,
        selectId: '',
        form: {
          title: title,//	是	string	模板标题
          content: content,//	是	string	模板内容
          type: type//	是	int	模板类型：1线索模板，2任务模板
        },
        rules: {
          title: [{required: true, trigger: 'change', message: '模板标题不能为空'}],
          content: [{required: true, trigger: 'change', message: '模板内容不能为空'}],
        },
        fileList: [],
      }
    },
    created() {
      let item = localStorage.getItem('templateItem');
      if (item) {
        let templateItem = JSON.parse(item);
        const {id = '', title = '', content = '', type = 1} = templateItem;
        this.selectId = id;
        this.form = {
          title: title,//	是	string	模板标题
          content: content,//	是	string	模板内容
          type: type//	是	int	模板类型：1线索模板，2任务模板
        };
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.form)
            if (this.selectId) {
              this.editTemplateHttp(this.form)
            } else {
              this.addTemplateHttp(this.form)
            }
          } else {
            return false
          }
        })
      },
      addTemplateHttp(params) {
        addTemplate(params).then(res => {
          if (res.code === 1) {
            this.messageFun();
          }
        }).catch((e) => {
          console.log(e)
        })
      },
      editTemplateHttp(params) {
        editTemplate(params, this.selectId).then(res => {
          if (res.code === 1) {
            localStorage.removeItem('templateItem');
            this.messageFun();
          }
        }).catch((e) => {
          console.log(e)
        })
      },
      messageFun() {
        this.$router.push('/system/templateManage')
        this.$message({type: 'success', message: '操作成功!'});
      }
    }
  }
</script>

<style scoped>

</style>
