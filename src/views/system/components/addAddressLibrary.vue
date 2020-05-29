<template>
  <el-dialog :title="dialogTitle" width="500px" @close="onClose" class="demo-ruleForm"
             :visible.sync="showFlag" :close-on-click-modal="false">
    <el-form :model="form" status-icon :rules="rules" size="small" label-position="right" label-width="130px"
             ref="form">
      <el-form-item prop="id" label="地址编码：">
        <el-input v-model="form.id" placeholder="地址编码" clearable/>
      </el-form-item>
      <el-form-item prop="name" label="地址名称：">
        <el-input v-model="form.name" placeholder="地址名称" clearable/>
      </el-form-item>
      <el-form-item prop="shortname" label="地址简称：">
        <el-input v-model="form.shortname" placeholder="地址简称" clearable/>
      </el-form-item>
      <el-form-item prop="leveltype" label="级别：">
        <el-select class="w_120" v-model="form.leveltype" @change="levelChange" placeholder="请选择" clearable>
          <el-option
            v-for="item in levelList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="parentid" label="上级地址：">

        <el-cascader v-if="form.leveltype === 3" :options="cascaderList" :props="optionProps"
                     v-model="form.parentid"></el-cascader>
        <el-select v-else class="w_120" v-model="form.parentid" placeholder="请选择" clearable>
          <el-option
            v-for="item in addressList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="citycode" label="区号：">
        <el-input v-model="form.citycode" placeholder="区号" clearable/>
      </el-form-item>
      <el-form-item prop="zipcode" label="邮编：">
        <el-input type="number" v-model="form.zipcode" placeholder="邮编" clearable/>
      </el-form-item>
      <el-form-item prop="pinyin" label="拼音：">
        <el-input v-model="form.pinyin" placeholder="拼音" clearable/>
      </el-form-item>
      <el-form-item prop="status" label="是否显示：">
        <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="onClose">取 消</el-button>
      <el-button size="small" type="primary" @click="onSubmit('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {levelState} from '@/utils/commonData';
  import {parentAddrServe} from '@/api/system/addressLibrary';

  export default {
    name: "addAddressLibrary",
    props: {
      item: {
        type: Object,
        default: {}
      },
      title: {
        type: String,
        default: ''
      },
    },
    data() {
      const {id = '', name = '', shortname = '', leveltype = '', parentid = '', citycode = '', zipcode = '', pinyin = '', status = 0} = this.item;
      return {
        dialogTitle: this.title,
        showFlag: true,
        addressList: [],
        cascaderList: [],
        levelList: levelState,
        optionProps: {
          value: 'id',
          label: 'name',
          children: 'children'
        },
        form: {//添加/编辑举报类型
          id,//	是	int	地址编码
          name,//	是	string	地址名称
          shortname,//	是	string	地址简称
          leveltype,//	是	int	级别
          parentid,//	是	int	上级id
          citycode,//	是	string	区号
          zipcode,//	否	string	邮编
          pinyin,//否	string	拼音
          status,//	是	int	是否显示：0否 1是
        },
        // {min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur'}
        rules: {
          id: [{required: true, trigger: 'change', message: '地址编码不能为空'}],
          name: [{required: true, trigger: 'change', message: '地址名称不能为空'}],
          shortname: [{required: true, trigger: 'change', message: '地址简称不能为空'}],
          leveltype: [{required: true, trigger: 'change', message: '级别不能为空'}],
          parentid: [{required: true, trigger: 'change', message: '上级id不能为空'}],
          citycode: [{required: true, trigger: 'change', message: '区号不能为空'}],
        },
        count: 0,
      }
    },
    created() {
      const {leveltype = ''} = this.form
      leveltype && this.getList(leveltype);
    },
    methods: {
      levelChange(val) {
        if (!val) {
          return
        }
        this.getList(val);
      },
      onSubmit(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let data = JSON.parse(JSON.stringify(this.form))
            if (Array.isArray(data.parentid)) {
              data.parentid = data.parentid[1];
            }
            this.$emit('submit', data)
          } else {
            return false;
          }
        });
      },
      onClose() {
        this.$emit('close')
      },
      getList(val) {
        parentAddrServe(val).then(res => {
          if (val === 3) {
            this.cascaderList = res
            if (this.count === 0) {
              const {parentid} = this.form
              this.count = 1;
              let subItem = [], reg = null, str = '';
              for (let i = 0; i < res.length; i++) {
                subItem = res[i].children;
                str = res[i].id.toString().substr(0, 1)
                reg = new RegExp('^' + str)
                if (reg.test(parentid)) {
                  for (let j = 0; j < subItem.length; j++) {
                    if (subItem[j].id === parentid) {
                      this.form.parentid = [res[i].id, parentid]
                      return
                    }
                  }
                }
              }
            }
          } else {
            this.addressList = res
          }
        }).catch(err => {
          console.log(err) // 这里catch到错误timeout
        })
      },
    }
  }
</script>

<style scoped>

</style>
