<template>
  <el-dialog :title="dialogTitle" width="500px" @close="handleClose" class="demo-ruleForm"
             :visible.sync="showFlag">
    <el-form :model="form" status-icon :rules="rules" label-position="right" label-width="120px"
             ref="form" size="small">
      <el-form-item prop="inc_name" label="增值服务名称：">
        <el-input style="width:300px;" v-model="form.inc_name" placeholder="增值服务名称" clearable/>
      </el-form-item>
      <el-form-item prop="price" label="价格：">
        <el-input style="width:300px;" v-model="form.price" placeholder="价格" clearable/>
      </el-form-item>
      <el-form-item prop="description" label="描述：">
        <el-input
          style="width:300px;"
          type="textarea" maxlength="255"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="描述"
          v-model="form.description">
        </el-input>
      </el-form-item>
      <el-form-item prop="sort" label="排序：">
        <el-slider :max="200" v-model="form.sort"></el-slider>
      </el-form-item>
      <el-form-item prop="short" label="简称：">
        <el-input maxlength="1" style="width:300px;" v-model="form.short" placeholder="简称"
                  clearable/>
      </el-form-item>
      <el-form-item label="是否显示：">
        <span style="margin-right: 5px;">NO</span>
        <el-switch
          v-model="form.is_show"
          :active-value="1"
          :inactive-value="0"></el-switch>
        <span style="margin-left: 5px;">YES</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">取 消</el-button>
      <el-button size="small" type="primary" @click="submitForm('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
    export default {
        name: "incrementService",
        props: ['title', 'item'],
        data() {
            const validatePass = (rule, value, callback) => {
                if (!/^\d+(\.\d+)?$/.test(value)) {
                    callback(new Error('价格为数字或浮点!'))
                } else {
                    callback()
                }
            };
            const {short = '', inc_name = '', price = '', description = '', sort = 1, is_show = 1} = this.item;
            return {
                showFlag: true,
                dialogTitle: this.title,
                form: {//添加/编辑单位
                    short: short,
                    inc_name: inc_name,//	是	string	增值服务名称
                    price: price,//	是	int	价格
                    description: description,//	否	string	描述
                    sort: sort,//	否	int	排序
                    is_show: is_show,//	是	int	是否显示：1是，0否
                },
                rules: {
                    inc_name: [{required: true, trigger: 'change', message: '名称不能为空'}, {
                        min: 2,
                        max: 30,
                        message: '长度在 2 到 30 个字符',
                        trigger: 'change'
                    }],
                    description: [{required: true, trigger: 'change', message: '描述不能为空'}],
                    sort: [{required: true, trigger: 'change', message: '请选择排序'}],
                    short: [{required: true, trigger: 'change', message: '简称一个字'}],
                    price: [{required: true, trigger: 'change', message: '价格不能为空'}, {
                        validator: validatePass, trigger: 'change'
                    }],
                },
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.$emit('emitSubmit', this.form)
                    } else {
                        return false;
                    }
                });
            },
            handleClose() {
                this.$emit('emitClose')
            }
        }
    }
</script>

<style scoped>

</style>
