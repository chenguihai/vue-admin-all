<template>
  <el-dialog :title="dialogTitle" width="500px" @close="handleClose" class="demo-ruleForm"
             :visible.sync="showFlag">
    <el-form :model="form" status-icon :rules="rules" label-position="right" label-width="100px" ref="form"
             size="small" class="headerForm">
      <el-form-item prop="reason" label="退款原因：">
        <el-input v-model="form.reason" maxlength="50" placeholder="退款原因" clearable/>
      </el-form-item>
      <el-form-item prop="type" label="类型：">
        <el-select class="w_260" v-model="form.type" filterable placeholder="请选择" clearable>
          <el-option v-for="item in reasonList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="sort" label="排序：">
        <el-input-number v-model="form.sort" controls-position="right" :min="1"/>
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
    name: "refundReason",
    props: ['title', 'item'],
    data() {
      const {reason = '', sort = '', type = 1} = this.item;
      return {
        showFlag: true,
        dialogTitle: this.title,
        form: {
          reason,
          sort,
          type
        },
        rules: {
          reason: [{required: true, trigger: 'change', message: '退款原因不能为空'}],
          type: [{required: true, trigger: 'change', message: '原因类型不能为空'}],
          sort: [{required: true, trigger: 'change', message: '排序值要大于0'}, {
            type: 'number', message: '排序必须为数字值'
          }],
        },
        reasonList: [
          {label: '用户申请退款', value: 1},
          {label: '用户关闭需求', value: 2},
          {label: '服务商放弃订单', value: 3},
          {label: '用户取消订单', value: 4},
        ]
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$emit('submit', this.form)
          } else {
            return false;
          }
        });
      },
      handleClose() {
        this.$emit('close')
      },
    }
  }
</script>

<style scoped>

</style>
