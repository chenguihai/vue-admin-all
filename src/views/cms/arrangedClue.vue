<template>
  <div class="app-container active">
    <el-form
      :model="form"
      :rules="rules"
      label-width="110px"
      size="small"
      ref="form"
    >
      <el-form-item label="线索标题：" prop="clue_title">
        <el-input class="tool_name" v-model="form.clue_title" placeholder="线索标题" clearable></el-input>
      </el-form-item>
      <el-form-item label="线索详情：" prop="clue_content">
        <tinymce-cpn ref="editor" v-model="form.clue_content"/>
      </el-form-item>
      <el-form-item label="">
        <router-link class="mr_10" :to="{path:'/cms/advertManage'}">
          <el-button size="small">返回</el-button>
        </router-link>
        <el-button size="small" type="primary" @click="submitForm('form')">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {clueHandle} from "@/api/cms/clue";
  import TinymceCpn from "@/components/Common/tinymceCpn";

  export default {
    name: "arrangedClue",
    components: {TinymceCpn},
    data() {
      return {
        form: {  //表单数据
          clue_title: '',//	是	string	线索标题
          clue_content: '',//	是	string	线索内容
        },
        rules: {
          clue_title: [{required: true, trigger: 'blur', message: '线索标题不能为空'}],
          clue_content: [{required: true, trigger: 'blur', message: '线索详情不能为空'}],
        }
      }
    },
    created() {
      let item = localStorage.getItem('clueItem');
      if (item) {
        let clueItem = JSON.parse(item);
        const {id = '', title = '', content = ''} = clueItem;
        this.form = {
          id,
          clue_title: title,//	是	string	线索标题
          clue_content: content,//	是	string	线索内容
        };
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.clueHandleHttp();
          } else {
            return false;
          }
        });
      },
      clueHandleHttp() {//线索 - 客服包办
        clueHandle(this.form).then(res => {
          if (res.code === 1) {
            localStorage.removeItem('clueItem')
            this.$router.push('/cms/advertManage')
          } else {
            this.$message({type: 'success', message: '审核失败'})
          }
        }).catch(err => {
          console.log(err)
        });
      },
    }
  }

</script>

<style scoped lang="scss">
  .app-container {
    &.active {
      width: 1210px;
    }
  }
</style>
