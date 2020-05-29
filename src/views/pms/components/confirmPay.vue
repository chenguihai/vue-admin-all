<template>
  <el-dialog title="确认收款" width="500px" class="demo-ruleForm" :visible.sync="showFlag" @close="handleClose"
             :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" status-icon label-position="right" label-width="100px" ref="form"
             size="small">
      <el-form-item label="打款时间：" prop="pay_time">
        <el-date-picker
          v-model="form.pay_time"
          type="datetime"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="打款凭证：" prop="pay_proof">
        <el-input v-model="form.pay_proof"/>
      </el-form-item>
      <el-form-item label="凭证附件：" prop="pay_img">
        <single-upload :url="form.pay_img" btn="上传凭证" @close="closeUpload" @emitSubmit="emitUpload"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">取 消</el-button>
      <el-button size="small" type="primary" @click="submitForm('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {formatDate} from '@/utils/date';
  import SingleUpload from "@/components/Upload/singleUpload";

  export default {
    name: "confirmPay",
    components: {SingleUpload},
    data() {
      return {
        showFlag: true,
        form: {        //确认收款弹框数据
          pay_time: '',//	是	string	打款时间
          pay_proof: '',//	是	string	打款凭证
          pay_img: '',//	是	string	凭证附件
        },
        rules: {
          pay_time: [
            {required: true, message: '打款时间不能为空', trigger: 'change'},
          ],
          pay_proof: [
            {required: true, message: '打款凭证不能为空', trigger: 'change'},
          ],
          pay_img: [
            {required: true, message: '凭证附件不能为空', trigger: 'change'},
          ],
        },
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.form.pay_time = formatDate(this.form.pay_time, 'yyyy-MM-dd hh:mm:ss')
            this.$emit('emitSubmit', this.form)
          } else {
            return false
          }
        })
      },
      handleClose() {
        this.$emit('emitClose')
      },
      emitUpload(url) {
        this.form.pay_img = url;
      },
      closeUpload() {
        this.form.pay_img = '';
      },
    }
  }
</script>
