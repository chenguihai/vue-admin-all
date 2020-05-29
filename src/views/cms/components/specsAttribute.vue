<template>
  <div>
    <el-dialog :title="dialogTitle" width="600px" @close="handleClose" class="demo-ruleForm"
               :visible.sync="showFLag" :close-on-click-modal="false">
      <el-form :model="form" class="specsform" status-icon :rules="rules" label-position="right"
               label-width="100px" ref="form" size="small">
        <el-form-item prop="attr_name" label="名称：">
          <el-input v-model="form.attr_name" maxlength="15" clearable/>
        </el-form-item>
        <el-form-item prop="cate_id" label="所属分类：">
          <ul class="Annex">
            <li v-for="(item,index) in cateList" v-bind:key='item.id'>
              {{item.cate_name}}; <span @click="removeTodo(index)"
                                        style="cursor: pointer;color:red;font-size: 20px;margin-left: 8px;">x</span>
            </li>
          </ul>
          <el-button size="small" @click="addType">添加分类</el-button>
        </el-form-item>
        <el-form-item label="输入方式：">
          <el-radio-group @change="radioChange" v-model="form.input_type">
            <el-radio :label="1">手动输入</el-radio>
            <el-radio :label="2">下拉列表选择</el-radio>
            <el-radio :label="3">复选框选择</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="input_show" label="可选值：" prop="input_select_val">
          <el-input :autosize="{ minRows: 1, maxRows: 4}"
                    type="textarea"
                    placeholder="请输入内容"
                    v-model="form.input_select_val">
          </el-input>
          <div>请使用“|”符号分隔，如A|B，范围数值需与筛选范围一 一对应</div>
        </el-form-item>
        <el-form-item label="销售属性：">
          <el-radio-group v-model="form.sale_attr" :disabled="form.input_type === 1 || form.input_type === 3">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="属性筛选：">
          <el-radio-group @change="radiooptional" v-model="form.optional">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="attFlag" label="筛选范围：" prop="optional_val_1">
          <el-input :autosize="{ minRows: 1, maxRows: 4}"
                    type="textarea"
                    placeholder="请输入内容"
                    v-model="form.optional_val_1">
          </el-input>
          <div>请使用“|”符号分隔，如A|B，范围数值需与筛选范围一 一对应</div>
        </el-form-item>
        <el-form-item v-show="attFlag" label="范围数值：" prop="optional_val_2">
          <el-input :autosize="{ minRows: 1, maxRows: 4}"
                    type="textarea"
                    placeholder="请输入内容"
                    v-model="form.optional_val_2">
          </el-input>
          <div>请使用“|”符号分隔，如A|B，范围数值需与筛选范围一 一对应</div>
        </el-form-item>
        <el-form-item label="状态：">
          <el-radio-group v-model="form.is_show">
            <el-radio :label=1>显示</el-radio>
            <el-radio :label=0>不显示</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加分类-->
    <add-class v-if="addFlag" :select="form.cate_id" :list="typeList" @emitClose="_handleClose"
               @emitSubmit="_handleSubmit"></add-class>
  </div>
</template>

<script>
  import AddClass from './addClass';
  import {duplicateRemoval} from '@/utils/commonData'

  export default {
    name: "specsAttribute",
    components: {AddClass},
    props: ['title', 'typeData', 'item'],
    data() {
      const {attr_name = '', cate_id = [], input_type = 1, input_select_val = '', sale_attr = 0, optional = 0, optional_val_1 = '', optional_val_2 = '', is_show = 1} = this.item;
      let catId = cate_id.map(item => item.id);
      var validateName = (rule, value, callback) => {
        if (!(value.length >= 2 && value.length <= 15)) {
          callback(new Error('规格属性名称2-15汉字'))
        } else {
          callback()
        }
      }
      return {
        showFLag: true,
        dialogTitle: this.title,
        input_show: input_type !== 1,
        addFlag: false,
        attFlag: optional === 1,
        typeList: this.typeData,
        cateList: cate_id,
        form: {
          attr_name: attr_name,//	是	string	规格属性名称
          cate_id: catId,//	是	string	一级分类id，多个用英文逗号隔开
          input_type: input_type,//	是	int	输入方式，单选，1 手动输入或2 下拉选择 3 复选框
          input_select_val: input_select_val,//	否	string	当输入方式=2时填写，多个值用英文逗号隔开
          sale_attr: sale_attr,//否	int	销售属性，单选，0否（默认）或1是
          optional: optional,//	否	int	可筛选，单选，0否（默认）或1是
          optional_val_1: optional_val_1,//	否	string	当可筛选=1时填写，多个值用英文逗号隔开（显示用）
          optional_val_2: optional_val_2,//	否	string	当可筛选=1时填写，多个值用英文逗号隔开（查询用）
          is_show: is_show,//	否	int	是否显示，单选，0否或1是（默认）
        },
        rules: {
          attr_name: [{required: true, trigger: 'change', message: '规格属性名称不能为空'},
            {validator: validateName, trigger: 'change'}
          ],
          cate_id: [{required: true, trigger: 'change', message: '所属分类不能为空'}],
          input_select_val: [{required: input_type !== 1, trigger: 'change', message: '可选值不能为空'}],
          optional_val_1: [{required: optional === 1, trigger: 'change', message: '筛选范围不能为空'}],
          optional_val_2: [{required: optional === 1, trigger: 'change', message: '范围数值不能为空'}],
        },
      }
    },
    methods: {
      addType() {
        this.addFlag = true
      },
      radioChange() {  //检索输入方式类型
        let flag = this.form.input_type !== 1;
        this.input_show = flag;
        this.rules.input_select_val = [{required: flag, trigger: 'change', message: '可选值不能为空'}]
        if (this.form.input_type !== 2) { //销售属性
          this.form.sale_attr = 0;
        }
      },
      radiooptional() { //检索属性筛选类型
        let flag = this.form.optional === 1;
        this.attFlag = flag;
        this.rules.optional_val_1 = [{required: flag, trigger: 'change', message: '筛选范围不能为空'}]
        this.rules.optional_val_2 = [{required: flag, trigger: 'change', message: '范围数值不能为空'}]
      },
      //编辑或新增规格
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = JSON.parse(JSON.stringify(this.form))
            // Array.from(new Set(data.input_select_val.replace(/\s/g, '').split('|'))).join('|')
            data.input_select_val = duplicateRemoval(data.input_select_val)
            data.optional_val_1 = duplicateRemoval(data.optional_val_1)
            data.optional_val_2 = duplicateRemoval(data.optional_val_2)
            data.cate_id = data.cate_id.toString()
            this.$emit('emitSubmit', data)
          } else {
            return false
          }
        })
      },
      handleClose() {
        this.$emit('emitClose')
      },
      removeTodo: function (index) { //删除分类某一行数据
        this.form.cate_id.splice(index, 1);
        this.cateList.splice(index, 1);
      },
      _handleClose() {
        this.addFlag = false
      },
      _handleSubmit(params) {
        let data = [];
        for (let j = 0; j < params.length; j++) {
          for (let i = 0; i < this.typeList.length; i++) {
            if (this.typeList[i].id === params[j]) {
              data.push(this.typeList[i]);
              break;
            }
          }
        }
        this._handleClose()
        this.cateList = data
        if (params.length > 0) {
          this.$refs.form.clearValidate();
        }
        this.form.cate_id = params
      }
    }
  }
</script>

<style lang="scss" scoped>
  .Annex {
    margin: 0;
    list-style: none;
    display: -webkit-flex; /* Safari */
    display: flex;
    flex-direction: column;
    padding-left: 0;

  }
</style>
