<template>
  <el-dialog :title="titles" width="500px" @close="handleClose" class="demo-ruleForm"
             :visible.sync="showFlag" :close-on-click-modal="false">
    <el-form :model="form" label-width="120px" :rules="rules" style="width: 100%" size="small" ref="form">
      <el-form-item label="分类名称：" prop="name">
        <el-input class="tool_name" v-model="form.name" placeholder="分类名称" clearable></el-input>
      </el-form-item>
      <!--      prop="pid"-->
      <el-form-item label="上级分类：">
        <el-cascader
          class="tool_name"
          v-model="form.pid"
          :options="cateList"
          :props="{ checkStrictly: true }"
          clearable
        >
          <!--          <template slot-scope="{ node, data }">-->
          <!--            <span>{{ data.label }}</span>-->
          <!--            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>-->
          <!--          </template>-->
        </el-cascader>
      </el-form-item>
      <el-form-item label="分类描述：">
        <el-input class="tool_name" type="textarea" v-model="form.description" placeholder="分类描述"
                  maxlength="500" show-word-limit :autosize="{ minRows: 2}"
                  clearable/>
      </el-form-item>
      <el-form-item label="分类关键字：">
        <el-input class="tool_name" type="textarea" v-model="form.keyword" placeholder="分类关键字"
                  maxlength="250" show-word-limit clearable :autosize="{ minRows: 2}"/>
      </el-form-item>
      <el-form-item label="排序：" prop="sort">
        <el-input class="tool_name" type="number" v-model="form.sort" min="1"></el-input>
      </el-form-item>
      <el-form-item label="是否显示：">
        <el-radio-group v-model="form.is_show">
          <el-radio :label="1">显示</el-radio>
          <el-radio :label="0">不显示</el-radio>
        </el-radio-group>
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
    name: "addClassify",
    props: ['title', 'item', 'list'],
    data() {
      const {id = '', pid = 0, name = '', description = '', keyword = '', sort = 1, is_show = 1} = this.item;
      let data = JSON.parse(JSON.stringify(this.list)), subItem;
      for (let i = 0; i < data.length; i++) {
        if (data[i].value === id) {
          data[i].disabled = true;
          break;
        }
        subItem = data[i].children
        if (Array.isArray(subItem)) {
          for (let j = 0; j < subItem.length; j++) {
            if (id === subItem[j].value) {
              subItem[j].disabled = true;
              break;
            }
          }
        }
      }
      return {
        showFlag: true,
        titles: this.title,
        // cateList: this.list,
        cateList: data,
        form: {//添加/编辑单位
          pid: pid,//	是	int	上级分类id
          name: name,//	是	string	分类名称
          description: description,//	否	string	描述
          keyword: keyword,//	否	string	关键字
          sort: sort,//	是	int	排序
          is_show: is_show,//	是	int	是否显示：0 否，1 是
        },
        rules: {
          // pid: [{required: true, trigger: 'change', message: '上级分类不能为空'}],
          name: [{required: true, trigger: 'change', message: '分类名称不能为空'}],
          sort: [{required: true, trigger: 'change', message: '排序不能为空'}],
        },
      }
    }
    ,
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            const {pid, sort} = JSON.parse(JSON.stringify(this.form));
            let cateId = Array.isArray(pid) ? pid.pop() : pid;
            let data = {...this.form, pid: cateId, sort: +sort}
            this.$emit('emitSubmit', data)
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