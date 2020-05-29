<template>
  <el-dialog :title="dialogTitle" width="550px" @close="onClose" class="demo-ruleForm"
             :visible.sync="showFlag" :close-on-click-modal="false">
    <el-form :model="form" status-icon :rules="rules" size="small" label-position="right" label-width="110px"
             ref="form">
      <el-form-item prop="keyword" label="热词名称：">
        <el-input v-model="form.keyword" placeholder="热词名称" clearable/>
      </el-form-item>
      <el-form-item prop="sort" label="排序值：">
        <el-input v-model="form.sort" placeholder="排序值" type="number" min="1"/>
      </el-form-item>
      <el-form-item prop="link" label="PC跳转链接：">
        <el-input v-model="form.link" placeholder="PC跳转链接" clearable/>
      </el-form-item>
      <el-form-item prop="m_link" label="H5跳转链接：">
        <el-input v-model="form.m_link" placeholder="H5跳转链接" clearable/>
      </el-form-item>
      <el-form-item prop="type" label="类型：" class="type_item">
        <el-radio-group v-model="form.type">
          <el-radio :label="(index+1)" v-for="(item,index) in typeList" :key="index">{{item}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="is_show" label="是否显示搜索框内：" label-width="160px">
        <el-switch
          v-model="form.is_show"
          active-value="1"
          inactive-value="0">
        </el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="onClose">取 消</el-button>
      <el-button size="small" type="primary" @click="onSubmit('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {validateURL} from '@/utils/validate'

  export default {
    name: "addHotword",
    props: {
      item: {
        type: Object,
        default: {}
      },
      title: {
        type: String,
        default: '添加银行'
      }

    },
    data() {
      const {keyword = '', sort = 1, type = '1', link = '', m_link = '', is_show = '0'} = this.item;
      console.log(this.item)
      var validateSort = (rule, value, callback) => {
        if (value > 0) {
          callback();
        } else {
          callback(new Error('排序值要大于0'))
        }
      }
      var validateLink = (rule, value, callback) => {
        if (validateURL(value)) {
          callback();
        } else {
          callback(new Error('跳转链接格式不正确'))
        }
      }
      return {
        dialogTitle: this.title,
        showFlag: true,
        typeList: ['服务', '店铺', '线索', '任务', '其他'],
        form: {//添加/编辑举报类型
          sort: sort,//	是	int	排序
          keyword: keyword,//	是	string	热词
          type: type,//	是	int	类型：1服务，2店铺，3线索，4任务，5其他
          link: link,//	否	string	跳转链接
          m_link: m_link,//	否	string	跳转链接
          is_show: is_show + '',//是	int	是否显示搜索框内：0否，1是
        },
        rules: {
          keyword: [{required: true, trigger: 'change', message: '热词名称不能为空'},
            {min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'change'}],
          sort: [{required: true, trigger: 'change', message: '排序值要大于0'},
            {validator: validateSort, trigger: 'change'}
          ],
          link: [{validator: validateLink, trigger: 'change'}],
          m_link: [{validator: validateLink, trigger: 'change'}],
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
      }
    }
  }
</script>

<style scoped lang="scss">
  .type_item {
    .el-radio {
      margin-right: 20px;
    }
  }
</style>
