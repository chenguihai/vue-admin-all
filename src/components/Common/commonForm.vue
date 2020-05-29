<template>
  <el-dialog :title="dialogTitle" width="500px" @close="onClose" class="demo-ruleForm"
             :visible.sync="showFlag" :close-on-click-modal="false">
    <el-form :model="form" status-icon size="small" label-position="right" label-width="120px"
             ref="form" :rules="rules">
      <div v-for="(topItem,index) in formList" :key="index">
        <!--input-->
        <el-form-item :prop="topItem.prop" :label="topItem.label">
          <el-input v-if="topItem.type ===1" v-model="topItem.prop" :placeholder="topItem.label" clearable/>
          <el-input v-else-if="topItem.type ===2" v-model="topItem.prop" type="number" placeholder="名称"
                    clearable/>
          <el-select class="w_100" v-else-if="topItem.type ===3"
                     v-model="topItem.prop" clearable>
            <el-option value="" label="全部"></el-option>
            <el-option
              v-for="item in openStates"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <!--            <el-checkbox v-for="item in openStates" :label="item.label"-->
          <!--                         :key="item.value">{{item.value}}-->
          <!--            </el-checkbox>-->
          <!--                    topItem.prop-->
          <el-checkbox-group v-else-if="topItem.type ===4" v-model="checkList">
            <el-checkbox label="复选框 A"></el-checkbox>
            <el-checkbox label="复选框 B"></el-checkbox>
            <el-checkbox label="复选框 C"></el-checkbox>
            <el-checkbox label="禁用"></el-checkbox>
          </el-checkbox-group>
          <el-radio-group v-model="topItem.prop" v-else-if="topItem.type ===5">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
          <!--          <single-upload v-else-if="topItem.type ===6" :url="topItem.prop" @close="_deleteUpload"-->
          <!--                         @emitSubmit="_handleUpload"></single-upload>-->
        </el-form-item>
        <!--
        <el-form-item style="width:95%;" label="等级背景图：" prop="icon" v-else-if="topItem.type ===6">
          <single-upload :url="form.icon" @close="_deleteUpload" @emitSubmit="_handleUpload"></single-upload>
        </el-form-item>
        -->
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="onClose">取 消</el-button>
      <el-button size="small" type="primary" @click="onSubmit('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
    /**
     * 1、input 2、number 3、select 4、checkbox 5、radio 6、upload
     */
    import SingleUpload from "@/components/Upload/singleUpload";
    import {openState} from '@/utils/commonData'

    export default {
        name: "addServiceLabel",
        components: {SingleUpload},
        props: {
            item: {
                type: Object,
                default: {}
            },
            title: {
                type: String,
                default: '添加服务标签'
            },
            list: {
                type: Array,
                default: []
            }

        },
        data() {
            // const {bankname = '', sort = 1} = this.item;
            let itemArr = this.list, prop = '', param = {};
            for (let i = 0; i < this.list.length; i++) {
                prop = itemArr[i].prop;
                param[prop] = itemArr[i].value;
            }
            console.log(JSON.parse(JSON.stringify(param)));

            return {
                openStates: openState,
                dialogTitle: this.title,
                showFlag: true,
                checkList: [],
                form: param,
                rules: {
                    // bankname: [{required: true, trigger: 'change', message: '服务标签名称不能为空'}],
                    // sort: [{required: true, trigger: 'change', message: '排序值要大于0'}],
                },
                formList: this.list,
                formItem: [
                    {
                        label: '服务标签名称',
                        prop: 'tag_name',
                        type: 1,
                        value: ''
                    },
                    {
                        label: '排序值',
                        prop: 'sort',
                        type: 2,
                        value: 0
                    },
                    {
                        label: '等级select',
                        prop: 'tag3',
                        type: 3,
                        value: ''
                    },
                    {
                        label: '等级checkbox',
                        prop: 'tag4',
                        type: 4,
                        value: []
                    },
                    {
                        label: '等级radio',
                        prop: 'tag5',
                        type: 5,
                        value: ''
                    },
                ]
            }
        },
        methods: {
            onSubmit(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        console.log(this.form);
                        this.$emit('submit', this.form)
                    } else {
                        return false;
                    }
                });
            },
            onClose() {
                this.$emit('close')
            },
            _handleUpload(url) {
                this.form.icon = url;
            },
            _deleteUpload() {
                this.form.icon = '';
            },
        }
    }
</script>

<style scoped>

</style>
