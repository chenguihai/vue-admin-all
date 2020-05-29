<template>
  <el-dialog title="申请订单佣金转出" width="500px" @close="onClose" class="demo-ruleForm"
             :visible.sync="showFlag" :close-on-click-modal="false">
    <div class="num_wrap">
      <span>订单收入金额 <em>￥{{commissionObj.total || 0}}</em></span>
      <span>已代付 <em>￥{{commissionObj.has_apply || 0}}</em></span>
      <span>剩余 <em>￥{{commissionObj.can_apply || 0}}</em></span>
    </div>
    <el-form :model="form" status-icon :rules="rules" size="small" label-position="right" label-width="130px"
             ref="form">
      <el-form-item prop="money" label="转出金额：">
        <el-input type="number" v-model.number="form.money" placeholder="请输入" clearable/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="onSubmit('form')">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {commission} from '@/api/oms/orderSettle';

  export default {
    name: "commissionTransfer",
    props: ['id'],
    data() {
      return {
        showFlag: true,
        selectId: this.id,
        commissionObj: {},
        form: {//添加/编辑举报类型
          id: this.id,//	是	int	代付id
          money: '',//是	string	转出金额
        },
        rules: {
          money: [{required: true, message: '转出金额不能为空'}],
        },
      }
    },
    created() {
      this.getList();
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (this.form.money > this.commissionObj.can_apply) {
              this.$message.error('转出金额不能大于剩余金额')
              return
            } else if (this.form.money <= 0) {
              this.$message.error('转出金额小于零')
              return
            }
            this.$emit('submit', this.form)
          } else {
            return false;
          }
        });
      },
      onClose() {
        this.$emit('close')
      },
      getList() {
        commission(this.selectId).then(res => {
          this.commissionObj = res
          this.form.money = res.can_apply || 0;
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .num_wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    margin: 10px 0;

    em {
      color: #f00;
      font-style: normal;
    }
  }

</style>
