<template>
  <el-dialog title="添加分类" width="400px" @close="handleClose" class="demo-ruleForm"
             :visible.sync="showFlag">
    <el-form :model="form" status-icon :rules="rules" label-position="right" label-width="100px"
             ref="form">
      <el-form-item prop="type1" label="一级分类">
        <el-select
          @change="selectChange"
          size="small"
          v-model="form.type1">
          <el-option
            v-for="item in listData"
            :key="item.id"
            :label="item.cate_name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="type2" label="二级分类">
        <el-select
          @change="selectTwoChange"
          size="small"
          v-model="form.type2">
          <el-option
            v-for="item in listData2"
            :key="item.id"
            :label="item.cate_name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="type3" label="三级分类">
        <el-select
          size="small"
          v-model="form.type3">
          <el-option
            v-for="item in listData3"
            :key="item.id"
            :label="item.cate_name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">取 消</el-button>
      <el-button size="small" type="primary" @click="submitForm('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
    import {servetype} from '@/api/cms/serve';

    export default {
        name: "addThreeClass",
        props: ['list'],
        data() {
            return {
                //添加分类
                showFlag: true,
                listData: this.list,
                listData2: [],
                listData3: [],
                form: {
                    type1: '',
                    type2: '',
                    type3: '',
                },
                rules: {
                    type1: [{required: true, trigger: 'change', message: '一级分类不能为空'}],
                    type2: [{required: true, trigger: 'change', message: '二级分类不能为空'}],
                    type3: [{required: true, trigger: 'change', message: '三级分类不能为空'}],
                },
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const {type1, type2, type3} = this.form;
                        let [item1] = this.listData.filter(item => item.id === type1),
                            [item2] = this.listData2.filter(item => item.id === type2),
                            [item3] = this.listData3.filter(item => item.id === type3);
                        let data = {
                            c_id: `${item1.id}|${item2.id}|${item3.id}`,
                            c_name: `${item1.cate_name}->${item2.cate_name}->${item3.cate_name}`
                        }
                        this.$emit('emitSubmit', data)
                    } else {
                        return false;
                    }
                });
            },
            handleClose() {
                this.$emit('emitClose')
            },
            selectChange(id) {
                this.form.type2 = ''; //初始化二级/三级
                this.form.type3 = '';
                servetype(id).then(res => {
                    this.listData2 = res.data
                }).catch(err => {
                  console.log(err)
                })
            },
            selectTwoChange(id) {
                this.form.type3 = ''; //初始化三级
                servetype(id).then(res => {
                    this.listData3 = res.data
                }).catch(err => {
                  console.log(err)
                })
            }
        }
    }
</script>

<style scoped>

</style>
