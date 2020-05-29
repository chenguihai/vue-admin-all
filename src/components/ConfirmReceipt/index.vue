<template>
  <el-dialog
    title="确认收款"
    width="500px"
    class="demo-ruleForm"
    :visible.sync="showFlag"
    @close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form
      :model="form"
      :rules="rules"
      status-icon
      label-position="right"
      label-width="110px"
      ref="form"
      size="small"
    >
      <el-form-item label="到账时间：" prop="pay_time">
        <el-date-picker
          v-model="form.pay_time"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="汇款金额：" prop="pay_money">
        <el-input v-model="form.pay_money" min="0" type="number" :disabled="true">
          <template slot="append">￥</template>
        </el-input>
      </el-form-item>
      <el-form-item label="付款单位：" prop="pay_company">
        <el-input v-model="form.pay_company" />
      </el-form-item>
      <el-form-item label="收款银行：" prop="receive_bank">
        <el-select class="w_120" v-model="form.receive_bank" placeholder="收款银行" clearable>
          <el-option v-for="(item,index) in bankList" :key="index" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="汇款凭证：" prop="pay_img">
        <single-upload
          :url="form.pay_img"
          btn="上传汇款凭证"
          @close="closeUpload"
          @emitSubmit="emitUpload"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">取 消</el-button>
      <el-button size="small" type="primary" @click="submitForm('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import SingleUpload from "@/components/Upload/singleUpload";
import { BankList } from "@/utils/commonData";

export default {
  name: "confirmReceipt",
  props: ["price"],
  components: { SingleUpload },
  data() {
    var validateMoney = (rule, value, callback) => {
      if (!(value > 0)) {
        callback(new Error("汇款金额要大于0"));
      } else {
        callback();
      }
    };
    return {
      bankList:BankList,
      showFlag: true,
      //确认收款弹框数据
      form: {
        pay_time:'', //	是	string	到账时间
        pay_money:this.price || '', //	是	string	汇款金额
        pay_company:'', //	是	string	付款单位
        receive_bank:'', //	是	string	收款银行
        pay_img:''//	是	string	汇款凭证
      },
      rules: {
        pay_money: [
          { required: true, message: "汇款金额不能为空", trigger: "change" },
          { validator: validateMoney, trigger: "change" }
        ],
        receive_bank: [
          { required: true, message: "收款银行不能为空", trigger: "change" }
        ],
        pay_company: [
          { required: true, message: "付款单位不能为空", trigger: "change" },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'change' }
        ],
        pay_time: [
          { required: true, message: "到账时间不能为空", trigger: "change" }
        ]
        // pay_img: [
        //   {required: true, message: '汇款凭证不能为空', trigger: 'change'},
        // ],
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let param = JSON.parse(JSON.stringify(this.form));
          this.$emit("emitSubmit", param);
        } else {
          return false;
        }
      });
    },
    handleClose() {
      this.$emit("emitClose");
    },
    emitUpload(url) {
      this.form.pay_img = url;
    },
    closeUpload() {
      this.form.pay_img = "";
    },
  }
};
</script>

<style scoped>
</style>
