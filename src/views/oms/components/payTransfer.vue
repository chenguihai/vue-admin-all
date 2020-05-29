<template>
  <el-dialog title="申请代付转出" width="500px" :before-close="onClose" class="demo-ruleForm"
             :visible.sync="showFlag" :close-on-click-modal="false">
    <el-form :model="form" status-icon :rules="rules" size="small" label-position="right" label-width="130px"
             class="headerForm"
             ref="form">
      <el-form-item prop="name" label="开户户名：">
        <el-input v-model="form.name" placeholder="请输入" clearable/>
      </el-form-item>
      <el-form-item prop="bank_number" label="银行账号：">
        <el-input type="number" v-model="form.bank_number" placeholder="请输入"/>
      </el-form-item>
      <el-form-item prop="bank_name" label="开户银行：">
        <el-select class="w_max" v-model="form.bank_name" placeholder="请选择" clearable>
          <el-option
            v-for="item in bankList"
            :key="item.id"
            :label="item.bank_name"
            :value="item.bank_name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="bank_branch" label="开户支行名称：">
        <el-input v-model="form.bank_branch" placeholder="请输入" clearable/>
      </el-form-item>
      <el-form-item prop="money" label="代付金额：">
        <el-input type="number" v-model="form.money" placeholder="请输入"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="onSubmit('form')">确定代付转出</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: "payTransfer",
    props: {
      bank: {
        type: Array,
        default: []
      },
    },
    data() {
      // const {id = '', name = '', shortname = '', leveltype = '', parentid = '', citycode = '', zipcode = '', pinyin = '', status = 0} = this.item;
      return {
        showFlag: true,
        bankList: this.bank,
        form: {//添加/编辑举报类型
          id: '',//	是	int	代付id
          name: '',//	是	string	开户名
          bank_name: '',//	是	string	开户银行
          bank_number: '',//	是	string	银行账号
          bank_branch: '',//	是	string	支行名
          money: '',//	是	string	代付金额
        },
        // {min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur'}
        rules: {
          name: [{required: true, trigger: 'change', message: '开户名称不能为空'}],
          bank_name: [{required: true, trigger: 'change', message: '开户银行不能为空'}],
          bank_number: [{required: true, trigger: 'change', message: '银行账号不能为空'}],
          bank_branch: [{required: true, trigger: 'change', message: '支行名称不能为空'}],
          money: [{required: true, trigger: 'change', message: '代付金额不能为空'}],
        },
        count: 0,
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
      },
    }
  }
</script>

<style scoped>

</style>
