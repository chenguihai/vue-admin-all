<template>
  <el-dialog :title="dialogTitle" width="500px" @close="onClose" class="demo-ruleForm"
             :visible.sync="showFlag" :close-on-click-modal="false">
    <el-form :model="form" status-icon :rules="rules" size="small" label-position="right" label-width="130px"
             ref="form">
      <el-form-item prop="cat_id" label="所属分类：">
        <el-select class="w_120" v-model="form.cat_id" placeholder="请选择" clearable>
          <el-option
            v-for="item in cateList"
            :key="item.id"
            :label="item.cate_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="max_price" label="价格上限值：">
        <el-input-number v-model="form.max_price" placeholder="价格上限值" controls-position="right" :min="0"/>
      </el-form-item>
      <el-form-item prop="min_price" label="价格下限值：">
        <el-input-number v-model="form.min_price" placeholder="价格下限值" controls-position="right" :min="1"/>
      </el-form-item>
      <el-form-item prop="show_info" label="前端显示：">
        <el-input v-model="form.show_info" placeholder="前端显示" clearable/>
      </el-form-item>
      <el-form-item prop="sort" label="排序值：">
        <el-input-number v-model="form.sort" controls-position="right" :min="1"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="onClose">取 消</el-button>
      <el-button size="small" type="primary" @click="onSubmit('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: "addPriceRange",
    props: {
      item: {
        type: Object,
        default: {}
      },
      title: {
        type: String,
        default: ''
      },
      cate: {
        type: Array,
        default: []
      }
    },
    data() {
      const {cat_id = '', min_price = '', max_price = 0, show_info = '', sort = 1} = this.item;
      return {
        dialogTitle: this.title,
        showFlag: true,
        cateList: this.cate,
        form: {//添加/编辑举报类型
          cat_id,//	是	int	分类id
          min_price,//	是	int	价格区间最小值
          max_price,//	否	int	价格区间最大值
          show_info,//	否	string	页面显示信息
          sort,//	是	int	排序
        },
        // {min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur'}
        rules: {
          cat_id: [{required: true, trigger: 'change', message: '分类id不能为空'}],
          min_price: [{required: true, trigger: 'change', message: '举报类型描述不能为空'}],
          sort: [{required: true, trigger: 'change', message: '排序值要大于0'}],
        },
      }
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            // let data = JSON.parse(JSON.stringify(this.form))
            // if (!data.max_price) {
            //   data.max_price = null;
            // }
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

<style scoped>

</style>
